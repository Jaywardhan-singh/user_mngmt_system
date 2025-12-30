import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PasswordInput from '../components/PasswordInput';

const USER_TYPES = [
  { value: 'developer', label: 'Developer' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
  { value: 'designer', label: 'Designer' },
  { value: 'qa', label: 'QA Engineer' },
  { value: 'hr', label: 'HR' }
];

function UserSignup() {
  const { userSignup } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword || !userType) {
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
      await userSignup(fullName, email, password, userType);
      success('Account created successfully! Please login.');
      navigate('/user/login');
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
      <h2>User Sign Up</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Create your employee account
      </p>
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
          placeholder="user@company.com"
        />

        <label htmlFor="userType">User Type</label>
        <select
          id="userType"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: '2px solid var(--border)',
            fontSize: '1rem',
            background: 'var(--bg-primary)',
            transition: 'var(--transition)',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            e.target.style.background = 'var(--bg-secondary)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
            e.target.style.background = 'var(--bg-primary)';
          }}
        >
          <option value="">Select your role</option>
          {USER_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

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
            'Create Account'
          )}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/user/login">Login</Link>
      </p>
      <p className="auth-switch" style={{ marginTop: '0.5rem' }}>
        <Link to="/admin/signup">Sign up as Admin</Link> instead
      </p>
    </div>
  );
}

export default UserSignup;

