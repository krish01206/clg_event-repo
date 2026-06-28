import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const getCategoryBadgeClass = (category) => {
  const map = {
    Technical: 'badge-technical',
    Cultural: 'badge-cultural',
    Sports: 'badge-sports',
    Workshop: 'badge-workshop',
    Seminar: 'badge-seminar',
  };
  return `badge ${map[category] || 'badge-default'}`;
};

const MyEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await api.get('/register/my-events');
        setRegistrations(res.data);
      } catch (err) {
        setError('Failed to load your events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  const now = new Date();

  const upcoming = registrations.filter((r) => r.event && new Date(r.event.date) >= now);
  const completed = registrations.filter((r) => r.event && new Date(r.event.date) < now);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p className="text-muted">Loading your events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-wrapper">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const EventCard = ({ reg }) => {
    const event = reg.event;
    if (!event) return null;
    const isUpcoming = new Date(event.date) >= now;
    return (
      <div className="event-card animate-fade-in">
        <div className="event-card-img-placeholder" style={{ height: '120px', fontSize: '2.5rem' }}>
          {event.category === 'Technical' ? '💻' : event.category === 'Cultural' ? '🎭' :
           event.category === 'Sports' ? '⚽' : event.category === 'Workshop' ? '🔧' :
           event.category === 'Seminar' ? '🎤' : '📅'}
        </div>
        <div className="event-card-body">
          <div className="event-card-meta">
            <span className={getCategoryBadgeClass(event.category)}>{event.category}</span>
            <span className={isUpcoming ? 'badge badge-upcoming' : 'badge badge-completed'}>
              {isUpcoming ? '🟢 Upcoming' : '✓ Done'}
            </span>
          </div>
          <h3 className="event-card-title">{event.title}</h3>
          <div className="event-card-info">
            <span className="event-card-info-item">
              📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            {event.time && <span className="event-card-info-item">🕐 {event.time}</span>}
            <span className="event-card-info-item">📍 {event.location}</span>
            <span className="event-card-info-item text-muted" style={{ fontSize: '0.8rem' }}>
              Registered on {new Date(reg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <Link to={`/events/${event._id}`} className="btn btn-secondary btn-full mt-2">
            View Details →
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
        <h1 className="text-gradient">My Registered Events</h1>
        <p className="text-muted">Track all the events you've signed up for</p>
      </div>

      {/* Mini Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-value">{registrations.length}</div>
          <div className="stat-label">Total Registered</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{upcoming.length}</div>
          <div className="stat-label">Upcoming</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{completed.length}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Empty state */}
      {registrations.length === 0 && (
        <div className="glass-card empty-state mt-3">
          <div className="empty-state-icon">🎯</div>
          <h3 className="empty-state-title">No Events Yet</h3>
          <p className="empty-state-text">You haven't registered for any events yet. Browse and join events today!</p>
          <Link to="/" className="btn btn-primary">Browse Events →</Link>
        </div>
      )}

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <>
          <h2 style={{ marginTop: '2rem', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
            📅 Upcoming ({upcoming.length})
          </h2>
          <div className="events-grid">
            {upcoming.map((reg) => <EventCard key={reg._id} reg={reg} />)}
          </div>
        </>
      )}

      {/* Completed Events */}
      {completed.length > 0 && (
        <>
          <h2 style={{ marginTop: '2.5rem', marginBottom: '0.5rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            ✅ Completed ({completed.length})
          </h2>
          <div className="events-grid" style={{ opacity: 0.75 }}>
            {completed.map((reg) => <EventCard key={reg._id} reg={reg} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default MyEvents;
