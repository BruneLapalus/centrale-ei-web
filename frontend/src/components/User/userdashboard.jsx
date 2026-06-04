import './user.css';
import MovieCard from '../MovieCard/moviecard';

function UserDashboard({ user, onLogout }) {
  return (
    <main className="user-dashboard">
      <h1>Mon espace utilisateur</h1>

      <p>Bienvenue {user.firstname} !</p>

      <button type="button" onClick={onLogout}>
        Se déconnecter
      </button>
      {user.watchlist && user.watchlist.length > 0 ? (
        <section className="user-watchlist">
          <h2>Ma watchlist</h2>

          <div className="movies-list">
            {user.watchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      ) : (
        <p>Votre watchlist est vide pour le moment.</p>
      )}
    </main>
  );
}

export default UserDashboard;
