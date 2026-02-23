import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">DRAPE</Link>

        <div className="navbar-links">
          <Link to="/products">Shop</Link>
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="user-initial">{user.name[0].toUpperCase()}</span>
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <div className="dropdown-user">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  <button onClick={handleLogout} className="dropdown-logout">Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{padding:'8px 20px',fontSize:'11px'}}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
