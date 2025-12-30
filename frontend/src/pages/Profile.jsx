import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PasswordInput from '../components/PasswordInput';

function Profile() {
  const { user, setUser } = useAuth();
  const { success, error: showError } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setProfileMessage('');
    setProfileLoading(true);

    if (!fullName || !email) {
      setError('Full name and email are required');
      setProfileLoading(false);
      return;
    }

    try {
      const res = await api.put('/api/users/me', { fullName, email });
      setUser(res.data.user);
      setProfileMessage('Profile updated');
      success('Profile updated successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordMessage('');
    setPasswordLoading(true);

    if (!currentPassword || !newPassword) {
      setError('Both current and new password are required');
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      setPasswordLoading(false);
      return;
    }

    try {
      await api.patch('/api/users/me/password', { currentPassword, newPassword });
      setPasswordMessage('Password changed');
      success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to change password';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="page-container profile-page">
      <h2>Profile</h2>
      {error && <div className="error">{error}</div>}
      <div className="profile-columns">
        <form className="form card" onSubmit={handleSaveProfile}>
          <h3>Profile Info</h3>
          {profileMessage && <div className="success">{profileMessage}</div>}
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFullName(user.fullName || '');
                setEmail(user.email || '');
                setError('');
                setProfileMessage('');
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn" disabled={profileLoading}>
              {profileLoading ? (
                <>
                  <LoadingSpinner size="small" /> Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>

        <form className="form card" onSubmit={handleChangePassword}>
          <h3>Change Password</h3>
          {passwordMessage && <div className="success">{passwordMessage}</div>}

          <label htmlFor="currentPassword">Current Password</label>
          <PasswordInput
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />

          <label htmlFor="newPassword">New Password</label>
          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setCurrentPassword('');
                setNewPassword('');
                setError('');
                setPasswordMessage('');
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn" disabled={passwordLoading}>
              {passwordLoading ? (
                <>
                  <LoadingSpinner size="small" /> Changing...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;


