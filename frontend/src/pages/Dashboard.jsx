import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users?page=1&limit=1000');
      const users = res.data.users || [];
      const totalUsers = res.data.total || 0;
      const activeUsers = users.filter((u) => u.status === 'active').length;
      const adminUsers = users.filter((u) => u.role === 'admin').length;
      const regularUsers = users.filter((u) => u.role === 'user').length;

      setStats({
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        adminUsers,
        regularUsers
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="page-container">
      <h2>Welcome back, {user.fullName}!</h2>

      {user.role === 'admin' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="stat-value">
                {loading ? <LoadingSpinner size="small" /> : stats?.totalUsers || 0}
              </div>
              <div className="stat-label">Registered accounts</div>
            </div>
            <div className="stat-card">
              <h3>Active Users</h3>
              <div className="stat-value">
                {loading ? <LoadingSpinner size="small" /> : stats?.activeUsers || 0}
              </div>
              <div className="stat-label">Currently active</div>
            </div>
            <div className="stat-card">
              <h3>Admin Users</h3>
              <div className="stat-value">
                {loading ? <LoadingSpinner size="small" /> : stats?.adminUsers || 0}
              </div>
              <div className="stat-label">Administrators</div>
            </div>
            <div className="stat-card">
              <h3>Regular Users</h3>
              <div className="stat-value">
                {loading ? <LoadingSpinner size="small" /> : stats?.regularUsers || 0}
              </div>
              <div className="stat-label">Standard users</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/admin/users" className="btn">
                Manage Users
              </Link>
              <Link to="/profile" className="btn btn-secondary">
                Update Profile
              </Link>
            </div>
          </div>
        </>
      )}

      <div className="card" style={{ marginTop: user.role === 'admin' ? '1.5rem' : '0' }}>
        <h3>Your Profile</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Full Name
            </strong>
            <div style={{ marginTop: '0.25rem', fontSize: '1.125rem', fontWeight: '500' }}>
              {user.fullName}
            </div>
          </div>
          <div>
            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Email
            </strong>
            <div style={{ marginTop: '0.25rem', fontSize: '1.125rem', fontWeight: '500' }}>
              {user.email}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Role
              </strong>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`badge badge-${user.role}`}>{user.role}</span>
              </div>
            </div>
            {user.userType && (
              <div>
                <strong style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  User Type
                </strong>
                <div style={{ marginTop: '0.25rem' }}>
                  <span className="badge badge-user" style={{ textTransform: 'capitalize' }}>
                    {user.userType}
                  </span>
                </div>
              </div>
            )}
            <div>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Status
              </strong>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`badge badge-${user.status}`}>{user.status}</span>
              </div>
            </div>
          </div>
          {user.lastLogin && (
            <div>
              <strong style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Last Login
              </strong>
              <div style={{ marginTop: '0.25rem', fontSize: '1.125rem', fontWeight: '500' }}>
                {new Date(user.lastLogin).toLocaleString()}
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Link to="/profile" className="btn">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


