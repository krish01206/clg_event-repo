import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const Participants = () => {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [participantsRes, eventRes] = await Promise.all([
          api.get(`/register/participants/${id}`),
          api.get(`/events/${id}`),
        ]);
        setParticipants(participantsRes.data);
        setEventTitle(eventRes.data.event?.title || 'Event');
      } catch (err) {
        setError('Failed to load participants.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p className="text-muted">Loading participants...</p>
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

  return (
    <div className="container page-wrapper">
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-2 mb-3">
          <div>
            <h1 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>
              Event Participants
            </h1>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>{eventTitle}</p>
          </div>
          <Link to={`/events/${id}`} className="btn btn-secondary btn-sm">
            ← Back to Event
          </Link>
        </div>

        {/* Stats */}
        <div className="glass-card-flat mb-3" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>👥</div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-color)' }}>
              {participants.length}
            </div>
            <div className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Registrations
            </div>
          </div>
        </div>

        {/* Participants Table */}
        {participants.length > 0 ? (
          <div className="glass-card animate-fade-in" style={{ padding: '0' }}>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Registered On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((reg, index) => (
                    <tr key={reg._id}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                        {reg.user?.name || 'Unknown User'}
                      </td>
                      <td>{reg.user?.email || 'N/A'}</td>
                      <td>
                        {reg.createdAt
                          ? new Date(reg.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })
                          : 'N/A'}
                      </td>
                      <td>
                        <span className="badge badge-upcoming">Confirmed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-card empty-state">
            <div className="empty-state-icon">👤</div>
            <h3 className="empty-state-title">No Participants Yet</h3>
            <p className="empty-state-text">No students have registered for this event yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Participants;
