import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './MovieDetail.css';
import axios from 'axios';

function MovieDetail() {
  const { id } = useParams(); // Récupère l'ID du film depuis l'URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [currentUser, setCurrentUser] = useState(() => {
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

  const movieId = Number(id);
  const isInWatchlist = currentUser?.watchlist?.some(
    (watchlistMovie) => Number(watchlistMovie.id) === Number(movie?.id)
  );

  const isLiked = currentUser?.likedMovies?.includes(movieId);
  const isDisliked = currentUser?.dislikedMovies?.includes(movieId);

  const handlePreference = (preference) => {
    if (!currentUser) {
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/users/${
          currentUser.id
        }/movie-preference`,
        {
          movieId: movieId,
          preference: preference,
        }
      )
      .then((response) => {
        const updatedUser = response.data.user;

        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      })
      .catch((error) => {
        console.error('Erreur lors du like/dislike :', error);
      });
  };

  useEffect(() => {
    const TMDB_TOKEN =
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';

    const url = `https://api.themoviedb.org/3/movie/${id}?language=fr-FR`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        return res.json();
      })
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="loading-text">Chargement du détail...</p>;
  }
  if (!movie) {
    return <p className="error-text">Film introuvable.</p>;
  }

  const handleWatchlist = () => {
    if (!currentUser || !movie) {
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/users/${currentUser.id}/watchlist`,
        {
          movie: {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
          },
        }
      )
      .then((response) => {
        const updatedUser = response.data.user;

        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour de la watchlist :', error);
      });
  };

  return (
    <div className="movie-detail-container">
      <Link to="/" className="back-button">
        ← Retour à l'accueil
      </Link>

      <div className="movie-detail-content">
        <div className="detail-poster">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
              alt={movie.title}
            />
          ) : (
            <div className="no-image-detail">Pas d'image</div>
          )}
        </div>

        <div className="detail-info">
          <h2>{movie.title}</h2>
          {movie.tagline && (
            <p className="tagline">
              <em>{movie.tagline}</em>
            </p>
          )}
          <p className="overview">
            <strong>Synopsis :</strong>{' '}
            {movie.overview || 'Aucun synopsis disponible.'}
          </p>
          <p>
            <strong>Date de sortie :</strong> {movie.release_date || 'Inconnue'}
          </p>
          <p>
            <strong>Note :</strong> ⭐{' '}
            {movie.vote_average ? movie.vote_average.toFixed(1) : '?'}/10 (
            {movie.vote_count} votes)
          </p>
          {currentUser && (
            <div className="movie-detail-preference-buttons">
              <button
                type="button"
                className={
                  isLiked ? 'preference-button active' : 'preference-button'
                }
                onClick={() => handlePreference('like')}
              >
                👍 Like
              </button>

              <button
                type="button"
                className={
                  isDisliked ? 'preference-button active' : 'preference-button'
                }
                onClick={() => handlePreference('dislike')}
              >
                👎 Dislike
              </button>
            </div>
          )}
          {currentUser && (
            <button
              type="button"
              className={
                isInWatchlist ? 'watchlist-button active' : 'watchlist-button'
              }
              onClick={handleWatchlist}
            >
              {isInWatchlist
                ? '✓ Dans ma watchlist'
                : '+ Ajouter à ma watchlist'}
            </button>
          )}
          <p>
            <strong>Durée :</strong>{' '}
            {movie.runtime ? `${movie.runtime} minutes` : 'Inconnue'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
