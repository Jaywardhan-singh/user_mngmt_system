import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logo from '../assets/logo.png';

function Navbar() {
  const { user, logout } = useAuth();
  const { info } = useToast();

  if (!user) return null;

  const handleLogout = () => {
    info('Logged out successfully');
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        
        {/* Logo + Title */}
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logo} alt="Logo" style={{ width: 50 }} />
          <span className="navbar-brand">User Management System</span>
        </Link>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>

        {user.role === 'admin' && (
          <Link
            to="/admin/users"
            style={{ color: 'var(--secondary)', fontWeight: '600' }}
          >
            Admin Panel
          </Link>
        )}
      </div>

      <div className="navbar-right">
        <span className="navbar-user">
          {user.fullName}
          <span style={{ marginLeft: '0.5rem' }}>
            <span
              className={`badge badge-${user.role}`}
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
            >
              {user.role}
            </span>
          </span>
        </span>

        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
