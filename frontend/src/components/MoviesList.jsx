function MoviesList({ movies, apiError }) {
  return (
    <div
      className="movies-list"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
      }}
    >
      {movies.length > 0
        ? movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              style={{
                width: '200px',
                border: '1px solid #000000',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#000000',
              }}
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  style={{
                    width: '100%',
                    borderRadius: '4px',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#ccc',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Pas d'image
                </div>
              )}
              <h3
                style={{
                  fontSize: '16px',
                  margin: '10px 0 5px 0',
                  color: '#ffffff',
                }}
              >
                {movie.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#666' }}>
                Note : {movie.vote_average}/10
              </p>
            </div>
          ))
        : !apiError && (
            <p style={{ fontStyle: 'italic', color: '#888' }}>
              Chargement des films...
            </p>
          )}
    </div>
  );
}

export default MoviesList;
