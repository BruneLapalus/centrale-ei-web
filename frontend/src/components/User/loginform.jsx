import { useState } from 'react';
import axios from 'axios';
import './user.css';

function LoginForm({ onLogin }) {
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });

  const [loginError, setLoginError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginError(null);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, formValues)
      .then((response) => {
        onLogin(response.data.user);
      })
      .catch((error) => {
        console.error(error);
        setLoginError(
          error.response?.data?.message || 'Erreur lors de la connexion'
        );
      });
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>Connexion</h2>

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
        type="password"
        required
        placeholder="Mot de passe"
        value={formValues.password}
        onChange={(event) =>
          setFormValues({ ...formValues, password: event.target.value })
        }
      />

      <button type="submit">Se connecter</button>

      {loginError && <p className="user-error">{loginError}</p>}
    </form>
  );
}

export default LoginForm;
