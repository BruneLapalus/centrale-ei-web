import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './MovieDetail.css';

function MovieDetail() {
  const { id } = useParams(); // Récupère l'ID du film depuis l'URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

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
