import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'];
const SORT_OPTIONS = [
  { value: 'latest', label: '🕐 Latest' },
  { value: 'upcoming', label: '📅 Upcoming' },
  { value: 'oldest', label: '🗓 Oldest' },
];

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

const getCategoryIcon = (category) => {
  const icons = {
    Technical: '💻',
    Cultural: '🎭',
    Sports: '⚽',
    Workshop: '🔧',
    Seminar: '🎤',
  };
  return icons[category] || '📅';
};

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        search,
        category: category === 'All' ? '' : category,
        sort,
        page: currentPage,
        limit: 6,
      });
      const res = await api.get(`/events?${params}`);
      setEvents(res.data.events);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, currentPage]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container page-wrapper">
      {/* Hero Header */}
      <div className="page-header animate-fade-in">
        <h1 className="text-gradient">Discover College Events</h1>
        <p>Browse and register for workshops, seminars, cultural fests, and more.</p>
      </div>

      {/* Search & Filter Section */}
      <div className="search-section animate-fade-in">
        <div className="search-bar-wrapper">
          <span className="search-bar-icon">🔍</span>
          <input
            id="event-search"
            type="text"
            className="search-bar"
            placeholder="Search by title, category, or location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="filter-sort-row">
          <div className="filter-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${category === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            id="sort-select"
            className="sort-select"
            value={sort}
            onChange={handleSortChange}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      {!loading && !error && (
        <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>
          {total} event{total !== 1 ? 's' : ''} found
          {category !== 'All' ? ` in "${category}"` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-wrapper">
          <div className="spinner" />
          <p className="text-muted">Loading events...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="alert alert-danger mt-3">{error}</div>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <>
          <div className="events-grid">
            {events.map((event, idx) => (
              <div
                key={event._id}
                className="event-card animate-fade-in"
                style={{ animationDelay: `${idx * 0.06}s`, opacity: 0 }}
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-card-img"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="event-card-img-placeholder">
                    {getCategoryIcon(event.category)}
                  </div>
                )}

                <div className="event-card-body">
                  <div className="event-card-meta">
                    <span className={getCategoryBadgeClass(event.category)}>
                      {event.category}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(event.date) >= new Date()
                        ? <span className="badge badge-upcoming">Upcoming</span>
                        : <span className="badge badge-completed">Completed</span>
                      }
                    </span>
                  </div>

                  <h3 className="event-card-title">{event.title}</h3>
                  <p className="event-card-desc">{event.description}</p>

                  <div className="event-card-info">
                    <span className="event-card-info-item">
                      📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {event.time && (
                      <span className="event-card-info-item">🕐 {event.time}</span>
                    )}
                    <span className="event-card-info-item">📍 {event.location}</span>
                  </div>

                  <Link
                    to={`/events/${event._id}`}
                    className="btn btn-primary btn-full mt-2"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                <div className="empty-state-icon">🔎</div>
                <h3 className="empty-state-title">No Events Found</h3>
                <p className="empty-state-text">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setSearchInput(''); setCategory('All'); setSort('latest'); }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="page-btn"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
