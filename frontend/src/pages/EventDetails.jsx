import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

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

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [regError, setRegError] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.event);
        setRegistrationCount(res.data.registrationCount || 0);
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Check if student is already registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (!user || user.role !== 'student') return;
      try {
        const res = await api.get('/register/my-events');
        const isReg = res.data.some((reg) => reg.event?._id === id || reg.event === id);
        setAlreadyRegistered(isReg);
      } catch {
        // silently ignore
      }
    };
    checkRegistration();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRegistering(true);
    setSuccessMsg('');
    setRegError('');
    try {
      await api.post(`/register/${id}`);
      setSuccessMsg('🎉 You are successfully registered for this event!');
      setAlreadyRegistered(true);
      setRegistrationCount((c) => c + 1);
    } catch (err) {
      setRegError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/events/${id}`);
      navigate('/');
    } catch {
      setRegError('Failed to delete event. Please try again.');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const isUpcoming = event ? new Date(event.date) >= new Date() : false;

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p className="text-muted">Loading event...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="container page-wrapper text-center">
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3 className="empty-state-title">{error}</h3>
          <Link to="/" className="btn btn-secondary mt-3">← Back to Events</Link>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="container page-wrapper">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card animate-fade-in-fast" style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Delete this event?</h3>
            <p className="text-muted mb-3">This action is permanent and will also remove all registrations for this event.</p>
            <div className="flex gap-2 justify-center">
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <Link to="/" className="btn btn-secondary btn-sm mb-3" style={{ display: 'inline-flex' }}>
          ← Back to Events
        </Link>

        <div className="glass-card animate-fade-in">
          {/* Event Image */}
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '8px', marginBottom: '2rem' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{
              width: '100%', height: '220px',
              background: 'linear-gradient(135deg, rgba(31,40,51,0.9), rgba(69,162,158,0.25))',
              borderRadius: '8px', marginBottom: '2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '5rem',
            }}>
              {event.category === 'Technical' ? '💻' : event.category === 'Cultural' ? '🎭' :
               event.category === 'Sports' ? '⚽' : event.category === 'Workshop' ? '🔧' :
               event.category === 'Seminar' ? '🎤' : '📅'}
            </div>
          )}

          {/* Title & Meta Row */}
          <div className="flex justify-between items-center flex-wrap gap-2 mb-3">
            <div style={{ flex: 1 }}>
              <div className="flex gap-2 items-center mb-2" style={{ flexWrap: 'wrap' }}>
                <span className={getCategoryBadgeClass(event.category)}>{event.category}</span>
                <span className={isUpcoming ? 'badge badge-upcoming' : 'badge badge-completed'}>
                  {isUpcoming ? '🟢 Upcoming' : '✓ Completed'}
                </span>
              </div>
              <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: 0 }}>{event.title}</h1>
            </div>

            {/* Admin Actions */}
            {user?.role === 'admin' && (
              <div className="flex gap-2" style={{ flexShrink: 0 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate(`/admin/events/edit/${event._id}`)}
                >
                  ✏️ Edit
                </button>
                <Link
                  to={`/admin/events/${event._id}/participants`}
                  className="btn btn-secondary btn-sm"
                >
                  👥 Participants
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setShowDeleteModal(true)}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>

          <hr className="divider" />

          {/* Event Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="glass-card-flat" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>📅</div>
              <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Date</div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            {event.time && (
              <div className="glass-card-flat" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🕐</div>
                <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Time</div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{event.time}</div>
              </div>
            )}

            <div className="glass-card-flat" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>📍</div>
              <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Location</div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{event.location}</div>
            </div>

            <div className="glass-card-flat" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>👥</div>
              <div className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Registered</div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--primary-color)' }}>{registrationCount} students</div>
            </div>
          </div>

          {/* Registration Alerts */}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}
          {regError && <div className="alert alert-danger">{regError}</div>}

          {/* Registration Button */}
          {!user && (
            <div className="alert alert-info mb-3">
              <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>Login</Link> to register for this event.
            </div>
          )}

          {user?.role === 'student' && !alreadyRegistered && isUpcoming && (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleRegister}
              disabled={registering}
              style={{ marginBottom: '1.5rem' }}
            >
              {registering ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Registering...</>
              ) : '🎯 Register for this Event'}
            </button>
          )}

          {user?.role === 'student' && alreadyRegistered && (
            <div className="alert alert-success mb-3">
              ✅ You are registered for this event. <Link to="/my-events">View My Events →</Link>
            </div>
          )}

          {user?.role === 'student' && !isUpcoming && !alreadyRegistered && (
            <div className="alert alert-info mb-3">⏳ This event has already ended. Registration is closed.</div>
          )}

          <hr className="divider" />

          {/* Description */}
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>📄 About this Event</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.9', whiteSpace: 'pre-wrap' }}>
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
