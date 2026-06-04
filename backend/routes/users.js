import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(User)
    .find({})
    .then(function (users) {
      res.json({ users: users });
    });
});

router.post('/new', function (req, res) {
  const userRepository = appDataSource.getRepository(User);

  const { email, firstname, lastname, password } = req.body;

  if (!email || !firstname || !lastname || !password) {
    return res.status(400).json({
      message: 'Email, firstname, lastname and password are required',
    });
  }

  const newUser = userRepository.create({
    email,
    firstname,
    lastname,
    password,
  });

  userRepository
    .save(newUser)
    .then(function (savedUser) {
      res.status(201).json({
        message: 'User successfully created',
        user: {
          id: savedUser.id,
          email: savedUser.email,
          firstname: savedUser.firstname,
          lastname: savedUser.lastname,
          password: savedUser.password,
        },
      });
    })
    .catch(function (error) {
      console.error(error);

      if (
        error.code === 'SQLITE_CONSTRAINT' ||
        error.code === 'SQLITE_CONSTRAINT_UNIQUE' ||
        error.code === '23505'
      ) {
        return res.status(400).json({
          message: `User with email "${newUser.email}" already exists`,
        });
      }

      res.status(500).json({
        message: 'Error while creating the user',
      });
    });
});

//Fonction pour se log dans le site
router.post('/login', function (req, res) {
  const userRepository = appDataSource.getRepository(User);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
    });
  }

  userRepository
    .findOneBy({ email })
    .then(function (user) {
      if (!user) {
        return res.status(401).json({
          message: 'Invalid email or password',
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          message: 'Invalid email or password',
        });
      }

      res.json({
        message: 'User successfully logged in',
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        },
      });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while logging in' });
    });
});

router.delete('/:userId', function (req, res) {
  appDataSource
    .getRepository(User)
    .delete({ id: req.params.userId })
    .then(function () {
      res.status(204).json({ message: 'User successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

export default router;
