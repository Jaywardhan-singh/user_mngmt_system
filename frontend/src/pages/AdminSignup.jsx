import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PasswordInput from '../components/PasswordInput';

function AdminSignup() {
  const { adminSignup } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await adminSignup(fullName, email, password);
      const message = 'Admin account created successfully!';
      success(message);
      // If token was saved (user is logged in), go to dashboard, otherwise go to login
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/dashboard');
      } else {
        navigate('/admin/login');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to sign up';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Sign Up</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Create a new administrator account
      </p>
      <div style={{
        padding: '0.75rem 1rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)'
      }}>
        <strong style={{ color: 'var(--primary)' }}>ℹ️ Note:</strong> If this is the first admin account, you can create it directly. If admins already exist, you must be logged in as an admin to create additional admin accounts.
      </div>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="admin@company.com"
        />

        <label htmlFor="password">Password</label>
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Enter your password"
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Confirm your password"
        />

        <button type="submit" className="btn" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner size="small" /> Signing up...
            </>
          ) : (
            'Create Admin Account'
          )}
        </button>
      </form>
      <p className="auth-switch">
        Already have an admin account? <Link to="/admin/login">Login</Link>
      </p>
      <p className="auth-switch" style={{ marginTop: '0.5rem' }}>
        <Link to="/user/signup">Sign up as User</Link> instead
      </p>
    </div>
  );
}

export default AdminSignup;

