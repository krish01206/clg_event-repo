import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const Participants = () => {
  const { id } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await api.get(`/register/participants/${id}`);
        setParticipants(res.data);
      } catch (err) {
        setError('Failed to load participants.');
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, [id]);

  if (loading) return <h2 className="text-center text-gradient mt-4">Loading Participants...</h2>;
  if (error) return <div className="text-center" style={{color: 'var(--danger-color)', marginTop: '2rem'}}>{error}</div>;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient">Event Participants</h1>
        <Link to={`/events/${id}`} className="btn btn-secondary">Back to Event</Link>
      </div>
      
      <div className="glass-card animate-fade-in">
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
          Total Registered: {participants.length}
        </h3>
        
        {participants.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {participants.map((reg, index) => (
              <div key={reg._id} style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{reg.user?.name || 'Unknown User'}</h4>
                  <p style={{ margin: '0.2rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{reg.user?.email || 'N/A'}</p>
                </div>
                <span className="badge">Student</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>No participants have registered for this event yet.</p>
        )}
      </div>
    </div>
  );
};

export default Participants;
