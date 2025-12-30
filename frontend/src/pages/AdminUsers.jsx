import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

function AdminUsers() {
  const { success, error: showError } = useToast();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [targetStatus, setTargetStatus] = useState('active');

  const fetchUsers = async (pageToLoad = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/users?page=${pageToLoad}`);
      setUsers(res.data.users);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to load users';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const openStatusModal = (user, status) => {
    setSelectedUser(user);
    setTargetStatus(status);
    setModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;
    try {
      await api.patch(`/api/users/${selectedUser._id}/status`, {
        status: targetStatus
      });
      setModalOpen(false);
      setSelectedUser(null);
      success(`User ${targetStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchUsers(page);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update status';
      setError(errorMsg);
      showError(errorMsg);
      setModalOpen(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ marginBottom: 0 }}>User Management</h2>
        <span className="badge badge-admin" style={{ fontSize: '0.875rem' }}>
          Admin Only
        </span>
      </div>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="loading-center">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>User Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Full Name">{u.fullName}</td>
                  <td data-label="Role">
                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td data-label="User Type">
                    {u.userType ? (
                      <span className="badge badge-user" style={{ textTransform: 'capitalize' }}>
                        {u.userType}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-light)' }}>—</span>
                    )}
                  </td>
                  <td data-label="Status">
                    <span className={`badge badge-${u.status}`}>{u.status}</span>
                  </td>
                  <td data-label="Actions">
                    {u.status === 'active' ? (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => openStatusModal(u, 'inactive')}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => openStatusModal(u, 'active')}
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      <ConfirmModal
        open={modalOpen}
        title="Confirm status change"
        message={
          selectedUser
            ? `Are you sure you want to set ${selectedUser.email} to ${targetStatus}?`
            : ''
        }
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}

export default AdminUsers;


