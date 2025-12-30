import React, { useState } from 'react';

function PasswordInput({ id, value, onChange, placeholder, autoComplete, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{ paddingRight: '3rem' }}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: 'absolute',
          right: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          fontSize: '1.25rem',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'var(--transition)',
          borderRadius: 'var(--radius-sm)'
        }}
        onMouseEnter={(e) => {
          e.target.style.color = 'var(--primary)';
          e.target.style.background = 'var(--bg-primary)';
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'var(--text-secondary)';
          e.target.style.background = 'none';
        }}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? '👁️' : '👁️‍🗨️'}
      </button>
    </div>
  );
}

export default PasswordInput;

