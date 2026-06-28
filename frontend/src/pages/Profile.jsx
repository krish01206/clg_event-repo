import React, { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUserName } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Fetch current profile from backend to populate email
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setName(res.data.name || '');
        setEmail(res.data.email || '');
      } catch {
        // silently fail — name is already from AuthContext
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      return setProfileMsg({ type: 'danger', text: 'Name must be at least 2 characters.' });
    }
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await api.put('/auth/profile', { name: name.trim() });
      updateUserName(res.data.name);
      setProfileMsg({ type: 'success', text: '✅ Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword.length < 6) {
      return setPasswordMsg({ type: 'danger', text: 'New password must be at least 6 characters.' });
    }
    if (newPassword !== confirmPassword) {
      return setPasswordMsg({ type: 'danger', text: 'New passwords do not match.' });
    }

    setPasswordLoading(true);
    try {
      await api.put('/auth/profile', { currentPassword, newPassword });
      setPasswordMsg({ type: 'success', text: '✅ Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to change password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>
          My Profile
        </h1>
        <p className="text-muted">Manage your account information and security settings.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Info Card */}
        <div className="glass-card animate-fade-in">
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', color: '#fff', fontWeight: '700', flexShrink: 0,
            }}>
              {name.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {name || user?.name}
              </div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>{email}</div>
              <span className="badge badge-upcoming" style={{ marginTop: '0.4rem', display: 'inline-block' }}>
                🎓 Student
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Update Display Name
          </h3>

          {profileMsg.text && (
            <div className={`alert alert-${profileMsg.type}`}>{profileMsg.text}</div>
          )}

          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email Address</label>
              <input
                id="profile-email"
                type="email"
                className="form-control"
                value={email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <small className="text-muted" style={{ fontSize: '0.8rem' }}>Email cannot be changed.</small>
            </div>

            <button type="submit" className="btn btn-primary" disabled={profileLoading}>
              {profileLoading ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
              ) : '💾 Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="glass-card animate-fade-in">
          <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
            🔒 Change Password
          </h3>

          {passwordMsg.text && (
            <div className={`alert alert-${passwordMsg.type}`}>{passwordMsg.text}</div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label" htmlFor="current-password">Current Password</label>
              <input
                id="current-password"
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Your current password"
                autoComplete="current-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">Confirm New Password</label>
              <input
                id="confirm-password"
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your new password"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              {passwordLoading ? (
                <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Updating...</>
              ) : '🔒 Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
