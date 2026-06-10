import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

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
        setError('Failed to load your events.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  if (loading) return <h2 className="text-center text-gradient mt-4">Loading Your Events...</h2>;
  if (error) return <div className="text-center" style={{color: 'var(--danger-color)', marginTop: '2rem'}}>{error}</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>My Registered Events</h1>

      <div className="events-grid">
        {registrations.map((reg) => {
          const event = reg.event;
          if (!event) return null; // Handle case where event was deleted
          return (
            <div key={reg._id} className="glass-card animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge">{event.category}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              
              <h3 style={{ margin: '0.5rem 0' }}>{event.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {event.description}
              </p>
              
              <Link to={`/events/${event._id}`} className="btn btn-secondary" style={{ width: '100%', display: 'block' }}>
                View Event Details
              </Link>
            </div>
          );
        })}
        
        {registrations.length === 0 && (
          <div className="glass-card text-center" style={{ gridColumn: '1 / -1', padding: '4rem 2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>No events found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven't registered for any events yet.</p>
            <Link to="/" className="btn btn-primary">Browse Events</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
