import './HeroSearch.css';

const HeroSearch = ({ movieName, setMovieName }) => {
  return (
    <div className="hero-search-container">
      {/* Zone de Titre */}
      <section className="hero-section">
        <h1 className="hero-title">PopcornTime</h1>
        <p className="hero-subtitle">
          Découvrez notre sélection exclusive de films
        </p>
      </section>

      {/* Barre de recherche */}
      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="Entrez le nom d'un film..."
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Indicateur de recherche */}
      {movieName && (
        <p className="search-indicator">
          Résultats pour : <strong>{movieName}</strong>
        </p>
      )}
    </div>
  );
};

export default HeroSearch;
