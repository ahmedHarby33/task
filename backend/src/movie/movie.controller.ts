import { Controller, Get, Param, Post, Body, Delete, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
//================================================
  @UseGuards(AuthGuard)
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  //===============================
  // @UseGuards(AuthGuard)
  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.movieService.searchMovies(query, page, limit);
  }
//===============================
  @Get('favorites/:userId')
  async getAllFavoriteMovies(@Param('userId') userId: number) {
    return this.movieService.getAllFavoriteMovies(userId);
  }
//===============================
  @Post('favorites')
  async addFavoriteMovie(
    @Body('userId') userId: number,
    @Body('imdbID') imdbID: string,
  ): Promise<Movie> {
    return this.movieService.addFavoriteMovie(userId, imdbID);
  }
//===============================
  @Delete('favorites')
  async removeFavoriteMovie(
    @Body('userId') userId: number,
    @Body('imdbID') imdbID: string,
  ): Promise<void> {
    return this.movieService.removeFavoriteMovie(userId, imdbID);
  }
}
