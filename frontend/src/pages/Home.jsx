import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <h2 className="text-center text-gradient mt-4">Loading Events...</h2>;
  if (error) return <div className="text-center" style={{color: 'var(--danger-color)', marginTop: '2rem'}}>{error}</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Discover College Events</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Find and register for the latest workshops, seminars, and cultural events happening on campus.
        </p>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <div key={event._id} className="glass-card animate-fade-in">
            {event.image ? (
              <img src={event.image} alt={event.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>No Image</span>
              </div>
            )}
            
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
            
            <Link to={`/events/${event._id}`} className="btn btn-primary" style={{ width: '100%', display: 'block' }}>
              View Details
            </Link>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-center" style={{ gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
            No events found. Check back later!
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
