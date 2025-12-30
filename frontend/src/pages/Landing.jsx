import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius)',
        padding: '3rem',
        boxShadow: 'var(--shadow-xl)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          IT User Management System
        </h1>
        <p style={{ 
          color: 'var(--text-secondary)', 
          marginBottom: '2rem',
          fontSize: '1.125rem'
        }}>
          Choose your login type to continue
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <Link 
            to="/admin/login" 
            className="btn"
            style={{
              padding: '1.5rem',
              fontSize: '1.125rem',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>👨‍💼</span>
            <span>Admin Login</span>
            <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Administrator Access</span>
          </Link>
          
          <Link 
            to="/user/login" 
            className="btn btn-secondary"
            style={{
              padding: '1.5rem',
              fontSize: '1.125rem',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>👤</span>
            <span>User Login</span>
            <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Employee Access</span>
          </Link>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            New to the system?
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/admin/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Admin Signup
            </Link>
            <span style={{ color: 'var(--text-light)' }}>|</span>
            <Link to="/user/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>
              User Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;

