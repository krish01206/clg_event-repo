import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/events?limit=5&sort=latest'),
        ]);
        setStats(statsRes.data);
        setRecentEvents(eventsRes.data.events || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p className="text-muted">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      {/* Header */}
      <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>
          Admin Dashboard 👑
        </h1>
        <p className="text-muted">Manage events and monitor platform activity.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Grid */}
      {stats && (
        <div className="stats-grid animate-fade-in">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{stats.totalEvents ?? 0}</div>
            <div className="stat-label">Total Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🟢</div>
            <div className="stat-value" style={{ color: '#34d399' }}>
              {stats.upcomingEvents ?? 0}
            </div>
            <div className="stat-label">Upcoming Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-value" style={{ color: 'var(--primary-color)' }}>
              {stats.totalStudents ?? 0}
            </div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎫</div>
            <div className="stat-value" style={{ color: '#f59e0b' }}>
              {stats.totalRegistrations ?? 0}
            </div>
            <div className="stat-label">Total Registrations</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="glass-card animate-fade-in mt-4">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>⚡ Quick Actions</h2>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/events/create" className="btn btn-primary">
            ✨ Create New Event
          </Link>
          <Link to="/" className="btn btn-secondary">
            🔍 View All Events
          </Link>
        </div>
      </div>

      {/* Recent Events Table */}
      {recentEvents.length > 0 && (
        <div className="mt-4 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h2 style={{ fontSize: '1.15rem' }}>📋 Recent Events</h2>
            <Link to="/" className="btn btn-secondary btn-sm">View All →</Link>
          </div>

          <div className="glass-card" style={{ padding: 0 }}>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event) => {
                    const isUpcoming = new Date(event.date) >= new Date();
                    return (
                      <tr key={event._id}>
                        <td style={{ fontWeight: '600', color: 'var(--text-primary)', maxWidth: '220px' }}>
                          {event.title}
                        </td>
                        <td>
                          <span className="badge badge-default">{event.category}</span>
                        </td>
                        <td>
                          {new Date(event.date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td>
                          <span className={isUpcoming ? 'badge badge-upcoming' : 'badge badge-completed'}>
                            {isUpcoming ? '🟢 Upcoming' : '✓ Done'}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <Link
                              to={`/events/${event._id}`}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                            >
                              View
                            </Link>
                            <Link
                              to={`/admin/events/edit/${event._id}`}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                            >
                              Edit
                            </Link>
                            <Link
                              to={`/admin/events/${event._id}/participants`}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
                            >
                              Participants
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {stats?.categoryBreakdown && Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="glass-card mt-4 animate-fade-in">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>📊 Events by Category</h2>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
            {Object.entries(stats.categoryBreakdown).map(([cat, count]) => (
              <div
                key={cat}
                className="glass-card-flat"
                style={{ textAlign: 'center', padding: '1rem' }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>
                  {cat === 'Technical' ? '💻' : cat === 'Cultural' ? '🎭' :
                   cat === 'Sports' ? '⚽' : cat === 'Workshop' ? '🔧' : '🎤'}
                </div>
                <div style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--primary-color)' }}>
                  {count}
                </div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{cat}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
