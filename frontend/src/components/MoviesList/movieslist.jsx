import React, { useState } from 'react';
import './movieslist.css';

function MoviesList({ movies, apiError }) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

        <button className="carousel-button" onClick={nextMovie}>
          ›
        </button>
      </div>

      <div className="movies-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
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
          </div>
        ))}
      </div>
    </section>
  );
}

export default MoviesList;
