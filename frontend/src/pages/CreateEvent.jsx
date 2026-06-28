import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'];

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    time: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!formData.category) {
      return setError('Please select a category.');
    }

    const eventDate = new Date(formData.date);
    if (eventDate < new Date(new Date().toDateString())) {
      return setError('Event date cannot be in the past.');
    }

    setLoading(true);
    try {
      const res = await api.post('/events', formData);
      navigate(`/events/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="glass-card animate-fade-in" style={{ maxWidth: '780px', margin: '0 auto' }}>
        <div className="flex items-center gap-2 mb-3" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.8rem' }}>✨</span>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '1.7rem', marginBottom: '0.1rem' }}>Create New Event</h1>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Fill in the details to publish your event</p>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Event Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Tech Fest 2025 — Hackathon"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select
                id="category"
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
              <label className="form-label" htmlFor="location">Location *</label>
              <input
                id="location"
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Seminar Hall A, Block B"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="date">Event Date *</label>
              <input
                id="date"
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="time">Event Time *</label>
              <input
                id="time"
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
            <label className="form-label" htmlFor="image">
              Image URL
              <span className="text-muted" style={{ fontWeight: 400, marginLeft: '0.4rem' }}>(optional)</span>
            </label>
            <input
              id="image"
              type="url"
              name="image"
              className="form-control"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/event-banner.jpg"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              placeholder="Describe the event — what to expect, who should attend, prizes, etc."
            />
          </div>

          <div className="flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating...</>
              ) : '✨ Create Event'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
