
import React, { useState, useEffect } from 'react';

interface Movie {
  title: string;
  year: number;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  return (
    <div>
      <h2>Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorite movies yet!</p>
      ) : (
        <ul>
          {favorites.map((movie, index) => (
            <li key={index}>
              <strong>{movie.title}</strong> ({movie.year})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
