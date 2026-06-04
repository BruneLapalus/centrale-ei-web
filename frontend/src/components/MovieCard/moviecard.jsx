import { Link } from 'react-router-dom';
import './MovieCard.css';

function MovieCard({ movie }) {
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
      </div>
    </Link>
  );
}

export default MovieCard;
