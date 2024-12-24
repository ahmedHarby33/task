
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie } from '../types/Movie';

export const useMovies = (query: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!query) return;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://www.omdbapi.com/', {
          params: {
            s: query,
            apikey: 'c27eadf6',
          },
        });
        setMovies(response.data.Search || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  return { movies, loading };
};
