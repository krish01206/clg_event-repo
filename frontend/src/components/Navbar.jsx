import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand text-gradient">EventHub</Link>
        <div className="nav-links">
          <Link to="/" className="nav-item">Events</Link>
          
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin/events/create" className="nav-item">Create Event</Link>
              ) : (
                <Link to="/my-events" className="nav-item">My Events</Link>
              )}
              <span className="nav-item" style={{ color: 'var(--text-secondary)' }}>
                {user.role === 'admin' ? '(Admin)' : '(Student)'}
              </span>
              <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 1rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
