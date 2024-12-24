import { Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager'; // Import Cache
import { Inject } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';
import { Movie } from '@prisma/client';

@Injectable()
export class MovieService {
  private readonly omdbApiUrl = 'http://www.omdbapi.com/';
  private readonly apiKey = 'c27eadf6'; // Replace with your OMDb API Key

  constructor(
    private readonly prisma: PrismaService, // Prisma service for DB operations
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache, // Inject CacheManager
  ) {}
  //===============================
  // Fetch movie details from OMDb API and cache the results
  async fetchMovieDetails(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const cacheKey = `movies:${query}:${page}`; // Cache key based on query and page
    const cachedResult = await this.cacheManager.get(cacheKey);

    if (cachedResult) {
      // console.log('Cache hit');
      return cachedResult;
    }

    // Fetch data from OMDb API if not cached
    const response = await axios.get(this.omdbApiUrl, {
      params: {
        s: query,
        apikey: this.apiKey,
        page: page.toString(),
      },
    });

    // Store the result in cache for future use
    await this.cacheManager.set(cacheKey, response.data, 3600); // Cache for 1 hour (3600 seconds)
    // console.log('Cache miss');
    return response.data;
  }
  //===============================
  // Save a movie as a favorite in the database
  async addFavoriteMovie(userId: number, imdbID: string): Promise<Movie> {
    // Check if the movie is already in the database
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: { userId_imdbID: { userId, imdbID } },
    });
    if (existingFavorite) {
      throw new Error('Movie is already in your favorites');
    }

    // Add the movie to the favorites
    const newFavorite = await this.prisma.favorite.create({
      data: {
        userId,
        imdbID,
      },
      include: {
        movie: true, // Optionally include movie details
      },
    });

    return newFavorite.movie;
  }
  //===============================
  // Get all favorite movies for a user
  async getAllFavoriteMovies(userId: number): Promise<Movie[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        movie: true, // Include movie details
      },
    });

    return favorites.map((fav) => fav.movie); // Return only movie details
  }
  //===============================
  // Update details of a favorite movie (for example, title, description, etc.)
  async updateFavoriteMovie(
    userId: number,
    imdbID: string,
    updatedData: Partial<Movie>,
  ): Promise<Movie> {
    // Find the movie by imdbID and userId
    const movie = await this.prisma.favorite.findFirst({
      where: { imdbID, userId },
      include: { movie: true }, // Include movie details
    });

    if (!movie) {
      throw new NotFoundException('Movie not found in your favorites');
    }

    // Update the movie details
    const updatedMovie = await this.prisma.movie.update({
      where: { imdbID },
      data: updatedData,
    });

    return updatedMovie;
  }
  //===============================
  // Remove a movie from the favorites
  async removeFavoriteMovie(userId: number, imdbID: string): Promise<void> {
    // Find the favorite movie entry by imdbID and userId
    const movie = await this.prisma.favorite.findFirst({
      where: { imdbID, userId },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found in your favorites');
    }

    // Remove the movie from favorites
    await this.prisma.favorite.delete({
      where: { userId_imdbID: { userId, imdbID } },
    });
  }
  //===============================
  // Search for movies by a query
  async searchMovies(
    query: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const cacheKey = `movies:search:${query}:${page}:${limit}`;
    const cachedResult = await this.cacheManager.get(cacheKey);

    if (cachedResult) {
      // console.log('Cache hit');
      return cachedResult;
    }

    // Fetch from OMDb API if not cached
    const response = await axios.get(this.omdbApiUrl, {
      params: {
        s: query,
        apikey: this.apiKey,
        page: page.toString(),
        type: 'movie', // Filtering to only return movies
      },
    });

    // Cache the result for future use
    await this.cacheManager.set(cacheKey, response.data, 3600); // Cache for 1 hour (3600 seconds)
    // console.log('Cache miss');
    return response.data;
  }
}
