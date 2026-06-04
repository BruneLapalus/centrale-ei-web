import './User.css';

function UserDashboard({ user, onLogout }) {
  return (
    <main className="user-dashboard">
      <h1>Mon espace utilisateur</h1>

      <p>Bienvenue {user.firstname} !</p>

      <div className="user-info">
        <p>
          <strong>Email :</strong> {user.email}
        </p>

        <p>
          <strong>Prénom :</strong> {user.firstname}
        </p>

        <p>
          <strong>Nom :</strong> {user.lastname}
        </p>
      </div>

      <button type="button" onClick={onLogout}>
        Se déconnecter
      </button>
    </main>
  );
}

export default UserDashboard;
