import { useState } from 'react';
import LoginForm from '../../components/User/loginform';
import RegisterForm from '../../components/User/registerform';
import UserDashboard from '../../components/User/userdashboard';
import './Users.css';

function Users() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  const [mode, setMode] = useState('login');

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (currentUser) {
    return <UserDashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <main className="user-space-page">
      <h1>Espace utilisateur</h1>

      <div className="user-space-tabs">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={mode === 'login' ? 'active-tab' : ''}
        >
          Se connecter
        </button>

        <button
          type="button"
          onClick={() => setMode('register')}
          className={mode === 'register' ? 'active-tab' : ''}
        >
          Créer un profil
        </button>
      </div>

      {mode === 'login' ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <RegisterForm onRegister={handleLogin} />
      )}
    </main>
  );
}

export default Users;
