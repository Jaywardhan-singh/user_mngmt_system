import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PasswordInput from '../components/PasswordInput';

function AdminLogin() {
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, 'admin');
      success('Admin login successful!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to login';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Login</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Access the admin control panel
      </p>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        <button type="submit" className="btn" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner size="small" /> Logging in...
            </>
          ) : (
            'Login as Admin'
          )}
        </button>
      </form>
      <p className="auth-switch">
        Don&apos;t have an admin account? <Link to="/admin/signup">Sign up</Link>
      </p>
      <p className="auth-switch" style={{ marginTop: '0.5rem' }}>
        <Link to="/user/login">Login as User</Link> instead
      </p>
    </div>
  );
}

export default AdminLogin;

