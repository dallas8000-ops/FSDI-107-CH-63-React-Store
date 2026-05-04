// src/components/NavBar.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { IconHome, IconInfoCircle, IconDeviceImac, IconUserShield, IconShoppingCart } from '@tabler/icons-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/GlobalComponents.css';
import GlobalContext from '../state/globalContext';

export default function NavBar({ mode = 'light', toggleMode }) {
  const { user, cart } = useContext(GlobalContext);
  const totalItems = cart ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className={`navbar navbar-expand-lg ${mode === 'dark' ? 'bg-dark' : 'bg-light'}`} data-bs-theme={mode === 'dark' ? 'dark' : 'light'}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold">
          🖥️ Computer Gadget Store
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className={`btn btn-sm ${mode === 'dark' ? 'btn-light' : 'btn-dark'} me-3`}
                onClick={toggleMode}
                style={{marginTop: '2px'}}
              >
                {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link d-flex align-items-center">
                <IconHome size={22} color="#4F8EF7" style={{marginRight: 6}} /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link d-flex align-items-center">
                <IconInfoCircle size={22} color="#F7B32B" style={{marginRight: 6}} /> About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/catalog" className="nav-link d-flex align-items-center">
                <IconDeviceImac size={22} color="#43AA8B" style={{marginRight: 6}} /> Catalog
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin" className="nav-link d-flex align-items-center">
                <IconUserShield size={22} color="#E94F37" style={{marginRight: 6}} /> Admin
              </Link>
            </li>
            <li className="nav-item">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: 'maroon', fontWeight: 'bold', marginBottom: '4px' }}>{user.name}</span>
                <button
                  type="button"
                  className="nav-link d-flex align-items-center position-relative"
                  style={{ display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => navigate('/cart')}
                  aria-label="Go to cart"
                >
                  <IconShoppingCart size={22} color="#4F8EF7" style={{marginRight: 6}} />
                  Cart
                  {totalItems > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.75em'}}>
                      {totalItems} item{totalItems !== 1 ? 's' : ''}
                    </span>
                  )}
                </button>
              </div>
            </li>
          </ul>
          {/* Removed user.name display, now shown next to cart */}
        </div>
      </div>
    </nav>
  );
}