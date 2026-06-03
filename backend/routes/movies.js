import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';

const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movies) {
      res.json({ movies: movies });
    });
});

router.post('/new', function (req, res) {
  const moviesRepository = appDataSource.getRepository(Movie);
  const newMovie = moviesRepository.create({
    title: req.body.title,
    rating: req.body.rating,
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

router.delete('/:movieId', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.movieIdId })
    .then(function () {
      res.status(204).json({ message: 'Movie successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the movie' });
    });
});

export default router;
