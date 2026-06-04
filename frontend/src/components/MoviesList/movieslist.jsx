import React, { useState } from 'react';
import './movieslist.css';
import { Link } from 'react-router-dom';
import MovieCard from '../MovieCard/moviecard';

function MoviesList({ movies, apiError }) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  if (apiError) {
    return null;
  }

  if (!movies || movies.length === 0) {
    return <p className="loading-text">Chargement des films...</p>;
  }

  const nextMovie = () => {
    setCurrentIndex((currentIndex + 1) % movies.length);
  };

  const previousMovie = () => {
    setCurrentIndex((currentIndex - 1 + movies.length) % movies.length);
  };

  const currentMovie = movies[currentIndex];

  return (
    <section className="movies-section">
      <h2 className="section-title">Nouveautés</h2>

      <div className="carousel">
        <button className="carousel-button" onClick={previousMovie}>
          ‹
        </button>
        <Link
          to={`/movie/${currentMovie.id}`}
          className="carousel-card movie-card-link"
        >
          <div className="carousel-card">
            {currentMovie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
                alt={currentMovie.title}
                className="carousel-poster"
              />
            ) : (
              <div className="no-image">Pas d'image</div>
            )}

            <h3 className="carousel-title">{currentMovie.title}</h3>

            <p className="carousel-rating">
              Note : {currentMovie.vote_average}/10
            </p>

            {currentMovie.release_date && (
              <p className="carousel-date">
                Sortie : {currentMovie.release_date}
              </p>
            )}

            {currentMovie.overview && (
              <p className="carousel-description">{currentMovie.overview}</p>
            )}
          </div>
        </Link>
        <button className="carousel-button" onClick={nextMovie}>
          ›
        </button>
      </div>
      {currentUser &&
        currentUser.watchlist &&
        currentUser.watchlist.length > 0 && (
          <section className="watchlist-section">
            <h2>Ma watchlist</h2>

            <div className="movies-list">
              {currentUser.watchlist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

      <div className="movies-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}

export default MoviesList;
