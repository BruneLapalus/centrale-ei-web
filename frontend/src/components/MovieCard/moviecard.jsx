import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './moviecard.css';

function MovieCard({ movie }) {
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

  const isLiked = currentUser?.likedMovies?.includes(movie.id);
  const isDisliked = currentUser?.dislikedMovies?.includes(movie.id);

  const handlePreference = (event, preference) => {
    event.preventDefault();

    if (!currentUser) {
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/users/${
          currentUser.id
        }/movie-preference`,
        {
          movieId: movie.id,
          preference: preference,
        }
      )
      .then((response) => {
        const updatedUser = response.data.user;

        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        return axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/movies/recommend`,
          {
            tmdbId: movie.id,
            title: movie.title,
            rating: movie.vote_average,
            isLiked: preference === 'like',
          }
        );
      })
      .catch((error) => {
        console.error('Erreur lors du like/dislike :', error);
      });
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster"
          />
        ) : (
          <div className="no-image">Pas d'image</div>
        )}

        <h3 className="movie-title">{movie.title}</h3>

        <p className="movie-rating">Note : {movie.vote_average}/10</p>

        {currentUser && (
          <div className="movie-preference-buttons">
            <button
              type="button"
              className={
                isLiked ? 'preference-button active' : 'preference-button'
              }
              onClick={(event) => handlePreference(event, 'like')}
            >
              👍
            </button>

            <button
              type="button"
              className={
                isDisliked ? 'preference-button active' : 'preference-button'
              }
              onClick={(event) => handlePreference(event, 'dislike')}
            >
              👎
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

export default MovieCard;
