import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './search.css';

function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [movies, setMovies] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    setSearchError(null);

    if (value.trim().length === 0) {
      setMovies([]);

      return;
    }

    setIsLoading(true);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies/search`, {
        params: {
          query: value,
        },
      })
      .then((response) => {
        const results = response.data;

        const filteredResults = results.filter((movie) =>
          movie.title.toLowerCase().startsWith(value.toLowerCase())
        );

        setMovies(filteredResults);
      })
      .catch((error) => {
        console.error(error);
        setSearchError('Erreur lors de la recherche');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="search-page">
      <h1>Recherche de films</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Rechercher un film..."
        value={searchValue}
        onChange={handleSearchChange}
      />

      {isLoading && <p className="search-info">Recherche en cours...</p>}

      {searchError && <p className="search-error">{searchError}</p>}

      {!isLoading && searchValue && movies.length === 0 && (
        <p className="search-info">Aucun film trouvé.</p>
      )}

      <div className="search-results">
        {movies.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="search-result-card"
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                className="search-result-poster"
              />
            ) : (
              <div className="search-result-no-image">Pas d'image</div>
            )}

            <div>
              <h2 className="search-result-title">{movie.title}</h2>

              {movie.release_date && (
                <p className="search-result-date">
                  Sortie : {movie.release_date}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Search;
