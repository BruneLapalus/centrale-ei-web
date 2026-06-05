import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';
import { tmdbService } from '../services/tmdbService.js';

const router = express.Router();

// 1. Récupérer les films de ta base de données locale
router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movies) {
      res.json({ movies: movies });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while fetching local movies' });
    });
});

// Fonction recherche
router.get('/search', function (req, res) {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({
      message: 'Query is required',
    });
  }

  tmdbService
    .searchMovies(query, 1)
    .then(function (data) {
      res.json(data.results);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error while searching movies',
      });
    });
});

// 2. Récupérer les films tendances, films par catégorie
router.get('/trending', async (req, res, next) => {
  try {
    const data = await tmdbService.getPopularMovies(1);
    res.json(data.results);
  } catch (error) {
    next(error);
  }
});

router.get('/category/:category', async function (req, res) {
  const { category } = req.params;

  try {
    const pages = [1, 2, 3, 4, 5];

    const responses = await Promise.all(
      pages.map((page) => tmdbService.getMoviesByCategory(category, page))
    );

    const movies = responses.flatMap((response) => response.results);

    const formattedMovies = movies.map((movie) => ({
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date || movie.first_air_date,
      overview: movie.overview,
      media_type: category === 'series' ? 'tv' : 'movie',
    }));

    res.json({
      category,
      results: formattedMovies.slice(0, 100),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error while fetching movies by category',
    });
  }
});

// 3. Créer un film manuellement en local (en acceptant le tmdbId)
router.post('/new', function (req, res) {
  const moviesRepository = appDataSource.getRepository(Movie);
  const newMovie = moviesRepository.create({
    title: req.body.title,
    rating: req.body.rating,
    tmdbId: req.body.tmdbId || null,
  });

  moviesRepository
    .save(newMovie)
    .then(function (savedMovie) {
      res.status(201).json({
        message: 'Movie successfully created',
        id: savedMovie.id,
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `Movie with title "${newMovie.title}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the movie' });
      }
    });
});

// 4. MISE À JOUR : Enregistrer une recommandation avec Like ou Dislike
router.post('/recommend', async (req, res, next) => {
  try {
    const { tmdbId, title, rating, isLiked } = req.body;

    if (!tmdbId || !title) {
      return res
        .status(400)
        .json({ message: 'Le tmdbId et le titre du film sont requis.' });
    }

    const moviesRepository = appDataSource.getRepository(Movie);

    // On cherche si le film existe déjà dans notre base locale via son tmdbId
    const movie = await moviesRepository.findOneBy({ tmdbId: Number(tmdbId) });

    // On détermine le statut (si non fourni, on considère que c'est un Like par défaut)
    const userOpinion = isLiked !== undefined ? isLiked : true;

    if (movie) {
      // Si le film existe déjà, on met juste à jour l'avis de l'utilisateur
      movie.isLiked = userOpinion;
      if (rating !== undefined) {
        movie.rating = rating;
      }

      await moviesRepository.save(movie);

      return res.status(200).json({
        message: 'Votre avis sur ce film a été mis à jour.',
        movie: movie,
        isNew: false,
      });
    } else {
      // S'il n'existe pas, on le crée avec son statut Like / Dislike
      const newMovie = moviesRepository.create({
        tmdbId: Number(tmdbId),
        title: title,
        rating: rating || null,
        isLiked: userOpinion,
      });

      const savedMovie = await moviesRepository.save(newMovie);

      return res.status(201).json({
        message: 'Film enregistré avec votre avis !',
        movie: savedMovie,
        isNew: true,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la recommandation :', error);
    next(error);
  }
});

// 5. Supprimer un film local par son ID
router.delete('/:movieId', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.movieId })
    .then(function () {
      res.status(204).json({ message: 'Movie successfully deleted' });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while deleting the movie' });
    });
});

// 6. NOUVEAUTÉ : L'Algorithme intelligent basé sur les Likes et les Dislikes
router.get('/recommendations', async (req, res, next) => {
  try {
    const moviesRepository = appDataSource.getRepository(Movie);

    // A. Récupérer le dernier film AIMÉ (isLiked = true)
    const lastLiked = await moviesRepository.findOne({
      where: { isLiked: true },
      order: { id: 'DESC' },
    });

    // B. Récupérer le dernier film DÉTESTÉ (isLiked = false)
    const lastDisliked = await moviesRepository.findOne({
      where: { isLiked: false },
      order: { id: 'DESC' },
    });

    // Sécurité : Si aucun film n'est aimé en BDD, on donne les tendances mondiales
    if (!lastLiked || !lastLiked.tmdbId) {
      const trending = await tmdbService.getPopularMovies(1);

      return res.json({
        message:
          'Aucun coup de cœur trouvé pour le moment. Voici les tendances globales.',
        source: 'trending',
        results: trending.results,
      });
    }

    // C. Récupérer les recommandations positives auprès de TMDB
    console.log(
      `[ALGO] Génération des suggestions basées sur le LIKE : ${lastLiked.title}`
    );
    const likedData = await tmdbService.getRecommendations(lastLiked.tmdbId);
    let finalResults = likedData.results;

    // D. Si l'utilisateur a déjà disliké un film, on applique le filtre de censure !
    if (lastDisliked && lastDisliked.tmdbId) {
      console.log(
        `[ALGO] Filtrage actif. On supprime le contenu similaire au DISLIKE : ${lastDisliked.title}`
      );

      // On demande à TMDB ce qui ressemble au film détesté (la liste noire)
      const dislikedData = await tmdbService.getRecommendations(
        lastDisliked.tmdbId
      );
      const blacklistedIds = dislikedData.results.map((movie) => movie.id);

      // On filtre la liste de départ en éjectant les films de la liste noire
      finalResults = finalResults.filter(
        (movie) => !blacklistedIds.includes(movie.id)
      );
    }

    // E. On renvoie le résultat épuré
    res.json({
      message:
        `Recommandations basées sur votre intérêt pour "${lastLiked.title}"` +
        (lastDisliked
          ? ` (épurées des films similaires à "${lastDisliked.title}")`
          : ''),
      basedOnLiked: lastLiked,
      excludedBasedOn: lastDisliked || null,
      results: finalResults.slice(0, 10),
    });
  } catch (error) {
    console.error('Erreur algo de recommandation :', error);
    next(error);
  }
});

export default router;
