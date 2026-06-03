import React from 'react';
import { Link } from 'react-router-dom';
import './movieslist.css';

function MoviesList({ movies, apiError }) {
  return (
    <div className="movies-list">
      {movies.length > 0
        ? movies.map((movie) => (
            <Link
              to={`/movie/${movie.id}`}
              key={movie.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
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
              </div>
            </Link>
          ))
        : !apiError && <p className="loading-text">Chargement des films...</p>}
    </div>
  );
}

export default MoviesList;
