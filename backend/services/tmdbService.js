import dotenv from 'dotenv';
dotenv.config(); // <-- Cela va forcer Node à lire le fichier .env du dossier courant

const TMDB_API_URL = process.env.TMDB_API_URL;
const TMDB_TOKEN = process.env.TMDB_TOKEN;

/**
 * Fonction générique pour centraliser et formater les requêtes vers TMDB
 */
async function fetchFromTMDB(endpoint, queryParams = '') {
  const url = `${TMDB_API_URL}${endpoint}?language=fr-FR${queryParams}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur TMDB ! Statut : ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      `[TMDB Service Error] Impossible de requêter ${endpoint}:`,
      error
    );
    throw error;
  }
}

// On exporte les fonctions de TMDB
export const tmdbService = {
  getPopularMovies: async (page = 1) => {
    return await fetchFromTMDB('/movie/popular', `&page=${page}`);
  },

  searchMovies: async (query, page = 1) => {
    return await fetchFromTMDB(
      '/search/movie',
      `&query=${encodeURIComponent(query)}&page=${page}`
    );
  },

  getMovieDetails: async (tmdbId) => {
    return await fetchFromTMDB(`/movie/${tmdbId}`);
  },

  getRecommendations: async (tmdbId, page = 1) => {
    return await fetchFromTMDB(
      `/movie/${tmdbId}/recommendations`,
      `&page=${page}`
    );
  },

  getMoviesByCategory: async (category, page = 1) => {
    switch (category) {
      case 'cinema':
        return await fetchFromTMDB('/movie/popular', `&page=${page}`);

      case 'series':
        return await fetchFromTMDB('/tv/popular', `&page=${page}`);

      case 'comedie':
        return await fetchFromTMDB(
          '/discover/movie',
          `&page=${page}&with_genres=35`
        );

      case 'jeunesse':
        return await fetchFromTMDB(
          '/discover/movie',
          `&page=${page}&with_genres=10751`
        );

      case 'thriller':
        return await fetchFromTMDB(
          '/discover/movie',
          `&page=${page}&with_genres=53`
        );

      case 'horreur':
        return await fetchFromTMDB(
          '/discover/movie',
          `&page=${page}&with_genres=27`
        );

      case 'romance':
        return await fetchFromTMDB(
          '/discover/movie',
          `&page=${page}&with_genres=10749`
        );

      case 'animation-japonaise':
        return await fetchFromTMDB(
          '/discover/movie',
          `&page=${page}&with_genres=16&with_origin_country=JP&with_original_language=ja`
        );

      default:
        return await fetchFromTMDB('/movie/popular', `&page=${page}`);
    }
  },
};
