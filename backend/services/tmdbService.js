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

// Ici, on exporte les fonctions spécifiques dont ton application aura besoin
export const tmdbService = {
  // Récupérer les films populaires
  getPopularMovies: async (page = 1) => {
    return await fetchFromTMDB('/movie/popular', `&page=${page}`);
  },

  // Rechercher un film par texte (ex: "Inception")
  searchMovies: async (query, page = 1) => {
    return await fetchFromTMDB(
      '/search/movie',
      `&query=${encodeURIComponent(query)}&page=${page}`
    );
  },

  // Récupérer les détails d'un film spécifique grâce à son ID TMDB
  getMovieDetails: async (tmdbId) => {
    return await fetchFromTMDB(`/movie/${tmdbId}`);
  },

  // AJOUT : Récupérer les recommandations basées sur un film spécifique
  getRecommendations: async (tmdbId, page = 1) => {
    return await fetchFromTMDB(
      `/movie/${tmdbId}/recommendations`,
      `&page=${page}`
    );
  },
};
