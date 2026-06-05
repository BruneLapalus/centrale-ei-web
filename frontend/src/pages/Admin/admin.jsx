import { useState } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [currentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem('currentUser');

      return null;
    }
  });

  const [title, setTitle] = useState('');
  const [tmdbId, setTmdbId] = useState('');
  const [rating, setRating] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!currentUser) {
    return (
      <main className="admin-page">
        <h1>Administrateur</h1>
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </main>
    );
  }

  if (!currentUser.isDeveloper) {
    return (
      <main className="admin-page">
        <h1>Administrateur</h1>
        <p>Accès refusé. Cette page est réservée aux comptes développeurs.</p>
      </main>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    setSuccessMessage('');
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Le titre du film est obligatoire.');

      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/movies/new`, {
        title: title,
        tmdbId: tmdbId ? Number(tmdbId) : null,
        rating: rating ? Number(rating) : null,
      })
      .then(() => {
        setSuccessMessage('Film ajouté avec succès !');
        setTitle('');
        setTmdbId('');
        setRating('');
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Erreur lors de l'ajout du film.");
      });
  };

  return (
    <main className="admin-page">
      <h1>Administrateur</h1>

      <p className="admin-intro">
        Vous êtes connecté avec un compte développeur.
      </p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Titre du film
          <input
            type="text"
            value={title}
            placeholder="Exemple : Inception"
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label>
          ID TMDB
          <input
            type="number"
            value={tmdbId}
            placeholder="Exemple : 27205"
            onChange={(event) => setTmdbId(event.target.value)}
          />
        </label>

        <label>
          Note
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={rating}
            placeholder="Exemple : 8.5"
            onChange={(event) => setRating(event.target.value)}
          />
        </label>

        <button type="submit" className="admin-submit-button">
          Ajouter le film
        </button>
      </form>

      {successMessage && <p className="admin-success">{successMessage}</p>}
      {errorMessage && <p className="admin-error">{errorMessage}</p>}
    </main>
  );
}

export default Admin;
