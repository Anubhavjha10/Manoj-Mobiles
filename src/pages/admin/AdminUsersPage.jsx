import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Trash2, Edit, Users as UsersIcon, Shield } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useNavigate } from 'react-router-dom';

export const AdminUsersPage = () => {
  const { showToast } = useStore();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(0, 50);
      setUsers(res?.content || []);
    } catch (error) {
      showToast('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteUser(deleteTarget);
      showToast('User deleted successfully');
      fetchUsers();
    } catch (err) {
      showToast('Failed to delete user');
    } finally {
      setDeleteTarget(null);
    }
  };

  const roleColors = {
    ADMIN: { bg: '#EDE9FE', color: '#6D28D9' },
    DELIVERY_AGENT: { bg: '#FEF3C7', color: '#92400E' },
    CUSTOMER: { bg: '#F1F5F9', color: '#475569' },
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><UsersIcon className="title-icon" /> User Management</h2>
        <button className="btn btn-primary" onClick={() => navigate('/admin/users/add')}>
          <Shield size={18} /> Add Admin
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="empty-state">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="empty-state">No users found.</td></tr>
            ) : (
              users.map(u => {
                const rc = roleColors[u.role] || roleColors.CUSTOMER;
                return (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td><span className="badge" style={{ backgroundColor: rc.bg, color: rc.color }}><Shield size={12} style={{ marginRight: '4px' }} />{u.role || 'CUSTOMER'}</span></td>
                    <td><span className={`badge ${u.status === 'ACTIVE' ? 'badge-solid' : ''}`} style={u.status !== 'ACTIVE' ? { color: '#EF4444', borderColor: '#EF4444', border: '1.5px solid' } : {}}>{u.status || 'ACTIVE'}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" onClick={() => navigate(`/admin/users/edit/${u.id}`)}><Edit size={16} /></button>
                        <button className="icon-btn delete-btn" onClick={() => setDeleteTarget(u.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog isOpen={!!deleteTarget} title="Delete User?" message="Are you sure you want to block/delete this user? This action cannot be easily undone." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} confirmText="Delete User" danger />
    </div>
  );
};
