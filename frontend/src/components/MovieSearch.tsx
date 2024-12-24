import React, { useState } from "react";
import axios from "axios";

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
}

const MovieSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchMovies = async () => {
    if (!searchTerm) return;

    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?s=${searchTerm}&apikey=<c27eadf6>`
      );
      setMovies(response.data.Search || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={fetchMovies}>Search</button>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.imdbID}>
            <img src={movie.Poster} alt={movie.Title} />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSearch;
