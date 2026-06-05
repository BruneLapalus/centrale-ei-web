import { Link } from 'react-router-dom';
import './Header.css';
// 1. Importe ton logo ici (adapte le chemin et le nom du fichier)
import logo from '../../assets/logo.png';

const Header = () => {
  return (
    <header className="header-container">
      {/* Logo / Nom du site */}
      <div className="header-logo">
        <Link to="/">
          {/* 2. Ajoute la balise img à côté du texte */}
          <img src={logo} alt="Pop Corn Time Logo" className="logo-img" />
          <span>Pop Corn Time</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <Link className="header-link" to="/">
          Home
        </Link>
        <Link className="header-link" to="/search">
          Recherche
        </Link>
        <Link className="header-link" to="/users-space">
          Espace Utilisateur
        </Link>
        <Link className="header-link" to="/about">
          About
        </Link>
      </nav>
    </header>
  );
};

export default Header;
