import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = ({ cartCount, darkMode, setDarkMode }) => {
  return (
    <header className="nav">
      <div className="nav-container">
        <Link to="/" className="logo">
          Computer Gadgets
        </Link>

        <nav className="nav-links">
          <Link to="/catalog" className="nav-link">
            Catalog
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </nav>

        <input type="text" className="search-bar" placeholder="Search products…" />

        <button 
          className="dark-mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        <Link to="/cart" className="cart-icon">
          <span className="cart-icon-symbol">🛒</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
};

export default Navigation;