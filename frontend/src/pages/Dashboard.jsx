import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/register/my-events');
        setRegistrations(res.data);
      } catch {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const now = new Date();
  const upcoming = registrations.filter((r) => r.event && new Date(r.event.date) >= now);
  const completed = registrations.filter((r) => r.event && new Date(r.event.date) < now);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p className="text-muted">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      {/* Welcome Header */}
      <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>
          Welcome back, {user?.name || 'Student'}! 👋
        </h1>
        <p className="text-muted">Here's your event activity overview.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Cards */}
      <div className="stats-grid animate-fade-in">
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-value">{registrations.length}</div>
          <div className="stat-label">Total Registered</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value" style={{ color: '#34d399' }}>{upcoming.length}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value" style={{ color: '#9ca3af' }}>{completed.length}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card animate-fade-in mt-4">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>🚀 Quick Actions</h2>
        <div className="flex gap-2 flex-wrap">
          <Link to="/" className="btn btn-primary">🔍 Browse Events</Link>
          <Link to="/my-events" className="btn btn-secondary">🎫 My Events</Link>
          <Link to="/profile" className="btn btn-secondary">👤 Edit Profile</Link>
        </div>
      </div>

      {/* Upcoming Events Preview */}
      {upcoming.length > 0 && (
        <div className="mt-4 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h2 style={{ fontSize: '1.15rem' }}>📅 Your Upcoming Events</h2>
            <Link to="/my-events" className="btn btn-secondary btn-sm">View All →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcoming.slice(0, 3).map((reg) => {
              const event = reg.event;
              if (!event) return null;
              return (
                <div
                  key={reg._id}
                  className="glass-card-flat"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{event.title}</div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      {event.time && (
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>🕐 {event.time}</span>
                      )}
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>📍 {event.location}</span>
                    </div>
                  </div>
                  <Link to={`/events/${event._id}`} className="btn btn-secondary btn-sm">
                    View →
                  </Link>
                </div>
              );
            })}
          </div>

          {upcoming.length > 3 && (
            <p className="text-muted mt-2" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
              +{upcoming.length - 3} more upcoming events — <Link to="/my-events">View all</Link>
            </p>
          )}
        </div>
      )}

      {/* No events CTA */}
      {registrations.length === 0 && !loading && (
        <div className="glass-card empty-state mt-4">
          <div className="empty-state-icon">🎯</div>
          <h3 className="empty-state-title">No Events Yet</h3>
          <p className="empty-state-text">Start exploring events and register for ones you're interested in!</p>
          <Link to="/" className="btn btn-primary">Browse Events →</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
