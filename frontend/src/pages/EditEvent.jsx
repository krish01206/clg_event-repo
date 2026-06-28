import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'];

const EditEvent = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    time: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const eventData = res.data.event;
        const formattedDate = eventData.date
          ? new Date(eventData.date).toISOString().split('T')[0]
          : '';
        setFormData({
          title: eventData.title || '',
          description: eventData.description || '',
          category: eventData.category || '',
          location: eventData.location || '',
          date: formattedDate,
          time: eventData.time || '',
          image: eventData.image || '',
        });
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.put(`/events/${id}`, formData);
      navigate(`/events/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p className="text-muted">Loading event...</p>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <div className="glass-card animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div className="flex items-center gap-2 mb-3" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.8rem' }}>✏️</span>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '1.7rem', marginBottom: '0.1rem' }}>Edit Event</h1>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Update the event details below</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-title">Event Title *</label>
            <input
              id="edit-title"
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-category">Category *</label>
              <select
                id="edit-category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">— Select a category —</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-location">Location *</label>
              <input
                id="edit-location"
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-date">Event Date *</label>
              <input
                id="edit-date"
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-time">Event Time *</label>
              <input
                id="edit-time"
                type="time"
                name="time"
                className="form-control"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-image">Image URL</label>
            <input
              id="edit-image"
              type="url"
              name="image"
              className="form-control"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/banner.jpg"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-description">Description *</label>
            <textarea
              id="edit-description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Updating...</>
              ) : '✓ Update Event'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/events/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
