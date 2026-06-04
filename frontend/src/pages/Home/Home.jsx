import { useState } from 'react';
import { useFetchMovies } from '../../components/CustomHook.jsx';
import MoviesList from '../../components/MoviesList/movieslist';
import HeroSearch from '../../components/HeroSearch/HeroSearch'; // On importe notre nouveau composant
import './Home.css';

function Home() {
  const [movieName, setMovieName] = useState('');
  const { movies, apiError } = useFetchMovies();

  // Filtrage des films
  const filteredMovies = movies
    ? movies.filter((movie) =>
        movie.title.toLowerCase().includes(movieName.toLowerCase())
      )
    : [];

  return (
    <div className="App">
      {/* 1. Notre composant épuré à qui on passe l'état de recherche */}
      <HeroSearch movieName={movieName} setMovieName={setMovieName} />

      <main
        className="App-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 20px',
        }}
      >
        {/* 2. Message d'erreur API */}
        {apiError && (
          <div className="api-error-message">
            <strong>Attention :</strong> Impossible de charger les films (
            {apiError})
          </div>
        )}
        {/* 3. Liste des films */}
        <MoviesList movies={filteredMovies} apiError={apiError} />
      </main>
    </div>
  );
}

export default Home;
