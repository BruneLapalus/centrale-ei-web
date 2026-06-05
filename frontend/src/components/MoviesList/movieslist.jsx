import React, { useState } from 'react';
import './movieslist.css';
import { Link } from 'react-router-dom';
import MovieCard from '../MovieCard/moviecard';

function MoviesList({ movies, apiError, showList = true }) {
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

  // --- LOGIQUE DU CARROUSEL POUR 3 AFFICHES ---

  // Avance d'une relance (ou de 3 si vous préférez, ici configuré à 1 pour un défilement fluide)
  const nextMovie = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const previousMovie = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
  };

  // Fonction pour récupérer les 3 films à afficher (gère la boucle infinie si on arrive au bout)
  const getVisibleMovies = () => {
    const visibleMovies = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % movies.length;
      // Sécurité si le tableau contient moins de 3 films au total
      if (movies[index] && !visibleMovies.includes(movies[index])) {
        visibleMovies.push(movies[index]);
      } else if (movies[index] && movies.length < 3) {
        // Si vous avez moins de 3 films en tout, on évite les doublons visuels inutiles
        visibleMovies.push(movies[index]);
      }
    }

    return visibleMovies;
  };

  const visibleMovies = getVisibleMovies();

  return (
    <section className="movies-section">
      <h2 className="section-title">Nouveautés</h2>

      <div className="carousel">
        <button className="carousel-button" onClick={previousMovie}>
          ‹
        </button>

        {/* Conteneur pour regrouper les 3 affiches côte à côte */}
        <div className="carousel-track">
          {visibleMovies.map((movie, index) => (
            <Link
              key={`${movie.id}-${index}`}
              to={`/movie/${movie.id}`}
              className="carousel-card movie-card-link"
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="carousel-poster"
                />
              ) : (
                <div className="no-image">Pas d'image</div>
              )}

              <h3 className="carousel-title">{movie.title}</h3>

              <p className="carousel-rating">Note : {movie.vote_average}/10</p>

              {movie.overview && (
                <p className="carousel-description">{movie.overview}</p>
              )}
            </Link>
          ))}
        </div>

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
      {showList && (
        <div className="movies-list">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default MoviesList;
