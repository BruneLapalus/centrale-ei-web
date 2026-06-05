import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useFetchMovies } from '../../components/CustomHook.jsx';
import MoviesList from '../../components/MoviesList/movieslist';
import MovieCard from '../../components/MovieCard/moviecard';
import './Home.css';

const CATEGORIES = [
  {
    label: 'Cinéma',
    value: 'cinema',
  },
  {
    label: 'Séries',
    value: 'series',
  },
  {
    label: 'Comédie',
    value: 'comedie',
  },
  {
    label: 'Jeunesse',
    value: 'jeunesse',
  },
  {
    label: 'Thriller',
    value: 'thriller',
  },
  {
    label: 'Horreur',
    value: 'horreur',
  },
  {
    label: 'Romance',
    value: 'romance',
  },
  {
    label: 'Animation japonaise',
    value: 'animation-japonaise',
  },
];

function Home() {
  const { movies, apiError } = useFetchMovies();

  const [selectedCategory, setSelectedCategory] = useState('cinema');
  const [categoryMovies, setCategoryMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesError, setMoviesError] = useState(null);

  const fetchMoviesByCategory = (category) => {
    setMoviesLoading(true);
    setMoviesError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies/category/${category}`)
      .then((response) => {
        setCategoryMovies(response.data.results || []);
      })
      .catch((error) => {
        console.error(error);
        setMoviesError('Impossible de charger cette catégorie.');
      })
      .finally(() => {
        setMoviesLoading(false);
      });
  };

  useEffect(() => {
    fetchMoviesByCategory(selectedCategory);
  }, [selectedCategory]);

  const selectedCategoryLabel =
    CATEGORIES.find((category) => category.value === selectedCategory)?.label ||
    'Films';

  return (
    <main className="home-page">
      <section className="home-hero">
        <h1>Pop Corn Time</h1>
        <p>Découvrez des films et séries selon vos envies.</p>

        <Link to="/search" className="home-search-button">
          Rechercher un film
        </Link>
      </section>

      <section className="home-carousel-section">
        <MoviesList movies={movies} apiError={apiError} showList={false} />
      </section>

      <section className="category-filter-section">
        <h2>Catégories</h2>

        <div className="category-buttons">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              className={
                selectedCategory === category.value
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      <section className="category-results-section">
        <h2>{selectedCategoryLabel}</h2>

        {moviesLoading && <p>Chargement...</p>}

        {moviesError && <p className="home-error">{moviesError}</p>}

        {!moviesLoading && !moviesError && categoryMovies.length === 0 && (
          <p>Aucun résultat trouvé.</p>
        )}

        {!moviesLoading && !moviesError && categoryMovies.length > 0 && (
          <div className="category-movies-list">
            {categoryMovies.map((movie) => (
              <MovieCard
                key={`${movie.media_type}-${movie.id}`}
                movie={movie}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
