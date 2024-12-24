
import React from 'react';
import MovieList from '../components/MovieList';

const Home: React.FC = () => {
  return (
    <div>
      <h2>Welcome to the Movie App</h2>
      <MovieList /> {/* Display the list of movies */}
    </div>
  );
};

export default Home;
