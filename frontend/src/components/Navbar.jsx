import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-item active' : 'nav-item';

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          ⚡ EventHub
        </Link>

        {/* Desktop Nav */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={closeMenu}>
            Events
          </Link>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin/dashboard" className={isActive('/admin/dashboard')} onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <Link to="/admin/events/create" className={isActive('/admin/events/create')} onClick={closeMenu}>
                    + Create Event
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className={isActive('/dashboard')} onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <Link to="/my-events" className={isActive('/my-events')} onClick={closeMenu}>
                    My Events
                  </Link>
                  <Link to="/profile" className={isActive('/profile')} onClick={closeMenu}>
                    Profile
                  </Link>
                </>
              )}

              <span className="nav-user-badge">
                {user.role === 'admin' ? '👑' : '🎓'} {user.name || user.role}
              </span>

              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
