import { useState } from 'react';
import axios from 'axios';
import './user.css';

function RegisterForm({ onRegister }) {
  const [formValues, setFormValues] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
  });

  const [registerError, setRegisterError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setRegisterError(null);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/new`, formValues)
      .then((response) => {
        onRegister(response.data.user);
      })
      .catch((error) => {
        console.error(error);
        setRegisterError(
          error.response?.data?.message ||
            'Erreur lors de la création du profil'
        );
      });
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>Créer un profil</h2>

      <input
        type="email"
        required
        placeholder="Email"
        value={formValues.email}
        onChange={(event) =>
          setFormValues({ ...formValues, email: event.target.value })
        }
      />

      <input
        type="text"
        required
        placeholder="Prénom"
        value={formValues.firstname}
        onChange={(event) =>
          setFormValues({ ...formValues, firstname: event.target.value })
        }
      />

      <input
        type="text"
        required
        placeholder="Nom"
        value={formValues.lastname}
        onChange={(event) =>
          setFormValues({ ...formValues, lastname: event.target.value })
        }
      />

      <input
        type="password"
        required
        placeholder="Mot de passe"
        value={formValues.password}
        onChange={(event) =>
          setFormValues({ ...formValues, password: event.target.value })
        }
      />

      <button type="submit">Créer mon profil</button>

      {registerError && <p className="user-error">{registerError}</p>}
    </form>
  );
}

export default RegisterForm;
