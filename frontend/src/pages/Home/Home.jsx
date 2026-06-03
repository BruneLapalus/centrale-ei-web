import { useState } from 'react';
import { useFetchMovies } from '../../components/CustomHook.jsx';
import MoviesList from '../../components/MoviesList';
import './Home.css';

function Home() {
  const [movieName, setMovieName] = useState('');

  // On appelle la fonction ici
  const { movies, apiError } = useFetchMovies();

  return (
    <div className="App">
      <header className="App-header">
        <h1>PopcornTime</h1>
        <p>Découvrez notre sélection exclusive de films</p>
      </header>
      <main className="App-content">
        <div className="search-container" style={{ margin: '20px 0' }}>
          <input
            type="text"
            placeholder="Entrez le nom d'un film..."
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            style={{ padding: '8px', fontSize: '16px', width: '250px' }}
          />
        </div>

        <p style={{ fontWeight: 'bold', margin: '15px 0' }}>
          Film recherché : {movieName}
        </p>

        {apiError && (
          <div
            style={{
              color: 'red',
              backgroundColor: '#ffffff',
              padding: '10px',
              borderRadius: '5px',
              margin: '20px auto',
              maxWidth: '500px',
            }}
          >
            <strong>Attention :</strong> Impossible de charger les films (
            {apiError})
          </div>
        )}

        <MoviesList movies={movies} apiError={apiError} />
      </main>
    </div>
  );
}

export default Home;
