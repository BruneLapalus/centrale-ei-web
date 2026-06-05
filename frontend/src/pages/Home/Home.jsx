import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFetchMovies } from '../../components/CustomHook.jsx';
import MoviesList from '../../components/MoviesList/movieslist';
import './Home.css';

import MovieCard from '../../components/MovieCard/moviecard';

function Home() {
  const [movieName, setMovieName] = useState('');
  const { movies, apiError } = useFetchMovies();

  const [currentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem('currentUser');

      return null;
    }
  });

  const [recommendations, setRecommendations] = useState([]);
  const [recommendationMessage, setRecommendationMessage] = useState('');
  const [recommendationError, setRecommendationError] = useState(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  const fetchRecommendations = () => {
    if (!currentUser) {
      return;
    }

    setRecommendationsLoading(true);
    setRecommendationError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies/recommendations`)
      .then((response) => {
        setRecommendationMessage(response.data.message || '');
        setRecommendations(response.data.results || []);
      })
      .catch((error) => {
        console.error('Erreur recommandations :', error);
        setRecommendationError('Impossible de charger les recommandations.');
      })
      .finally(() => {
        setRecommendationsLoading(false);
      });
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Filtrage des films
  const filteredMovies = movies
    ? movies.filter((movie) =>
        movie.title.toLowerCase().includes(movieName.toLowerCase())
      )
    : [];

  return (
    <div className="App">
      {/* 1. Notre composant épuré à qui on passe l'état de recherche */}

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
        <Link to="/search" className="home-search-button">
          Rechercher un film
        </Link>
        {currentUser && (
          <section className="recommendations-section">
            <h2>Recommandations pour vous</h2>

            {recommendationsLoading && <p>Chargement des recommandations...</p>}

            {recommendationError && (
              <p className="api-error-message">{recommendationError}</p>
            )}

            {recommendationMessage && (
              <p className="recommendation-message">{recommendationMessage}</p>
            )}

            {recommendations.length > 0 ? (
              <div className="recommendations-list">
                {recommendations.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              !recommendationsLoading && (
                <p>Aucune recommandation disponible pour le moment.</p>
              )
            )}

            <button
              type="button"
              className="refresh-recommendations-button"
              onClick={fetchRecommendations}
            >
              Actualiser les recommandations
            </button>
          </section>
        )}
        {/* 3. Liste des films */}
        <MoviesList movies={filteredMovies} apiError={apiError} />
      </main>
    </div>
  );
}

export default Home;
