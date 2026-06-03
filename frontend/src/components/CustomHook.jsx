import { useEffect, useState } from 'react';

export function useFetchMovies() {
  const [movies, setMovies] = useState([]);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const tokenV4 =
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';
    const url =
      'https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=1';

    fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${tokenV4}`,
      },
    })
      .then((response) => {
        // 1. On vérifie si la réponse est OK
        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }

        // 2. Si c'est OK, on retourne le JSON (ce qui manquait ou était bloqué)
        return response.json();
      })
      .then((data) => {
        if (data && data.results) {
          setMovies(data.results);
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération :', error);
        setApiError(error.message);
      });
  }, []);

  return { movies, apiError };
}
