import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.event);
        // We could also set the registrationCount here if we wanted to display it
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role === 'admin') {
      alert("Admins cannot register for events.");
      return;
    }

    setRegistering(true);
    setSuccessMsg('');
    setError('');
    
    try {
      await api.post(`/register/${id}`);
      setSuccessMsg('Successfully registered for the event!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. You might be already registered.');
    } finally {
      setRegistering(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        navigate('/');
      } catch (err) {
        alert("Failed to delete event");
      }
    }
  }

  if (loading) return <h2 className="text-center text-gradient mt-4">Loading...</h2>;
  if (error && !event) return <div className="text-center" style={{color: 'var(--danger-color)', marginTop: '2rem'}}>{error}</div>;
  if (!event) return null;

  return (
    <div style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-card animate-fade-in">
        {event.image ? (
          <img src={event.image} alt={event.title} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '2rem' }} />
        ) : (
          <div style={{ width: '100%', height: '200px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>No Image</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{event.title}</h1>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', alignItems: 'center' }}>
              <span className="badge">{event.category}</span>
              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
              <span>📍 {event.location}</span>
            </div>
          </div>
          
          <div>
            {(!user || user.role === 'student') && (
              <button onClick={handleRegister} className="btn btn-primary" disabled={registering} style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                {registering ? 'Registering...' : 'Register Now'}
              </button>
            )}
            {user && user.role === 'admin' && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => navigate(`/admin/events/edit/${event._id}`)} className="btn btn-secondary">Edit</button>
                <button onClick={() => navigate(`/admin/events/${event._id}/participants`)} className="btn btn-secondary">Participants</button>
                <button onClick={handleDelete} className="btn btn-danger">Delete</button>
              </div>
            )}
          </div>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid var(--success-color)', color: 'var(--success-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {successMsg}
          </div>
        )}

        {error && event && (
          <div style={{ backgroundColor: 'rgba(255, 76, 76, 0.1)', border: '1px solid var(--danger-color)', color: 'var(--danger-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>About this Event</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
