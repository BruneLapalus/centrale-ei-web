import React from 'react';
import './movieslist.css'; // Importation du fichier CSS

function movieslist({ movies, apiError }) {
  return (
    <div className="movies-list">
      {movies.length > 0
        ? movies.map((movie) => (
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
          ))
        : !apiError && <p className="loading-text">Chargement des films...</p>}
    </div>
  );
}

export default movieslist;
