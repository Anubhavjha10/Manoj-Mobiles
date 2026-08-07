import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Edit, Users as UsersIcon, UserPlus, X, Shield } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';

export const AdminUsersPage = () => {
  const { showToast } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'CUSTOMER' });

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

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '', password: '', role: user.role || 'CUSTOMER' });
    setShowForm(true);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, formData);
        showToast('User updated successfully');
      } else {
        await adminService.createUser(formData);
        showToast('User created successfully');
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', phone: '', password: '', role: 'CUSTOMER' });
      fetchUsers();
    } catch (err) {
      showToast(editingUser ? 'Failed to update user' : 'Failed to create user');
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
        <button className="btn btn-primary" onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', phone: '', password: '', role: 'ADMIN' }); setShowForm(!showForm); }}>
          {showForm ? <><X size={18} /> Close</> : <><Shield size={18} /> Add Admin</>}
        </button>
      </div>

      {showForm && (
        <div className="admin-form-box">
          <h3 className="form-title">{editingUser ? 'Edit User' : 'Create New Admin'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" required className="form-input" /></div>
            <div><label>Email</label><input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@email.com" required className="form-input" /></div>
            <div><label>Phone</label><input type="text" name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" required className="form-input" /></div>
            <div><label>Password</label><input type="password" name="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={editingUser ? "Leave empty to keep" : "••••••"} required={!editingUser} className="form-input" /></div>
            <div><label>Role</label>
              <select name="role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="form-input">
                <option value="ADMIN">Admin</option>
                <option value="DELIVERY_AGENT">Delivery Agent</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditingUser(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

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
                        <button className="icon-btn edit-btn" onClick={() => handleEditClick(u)}><Edit size={16} /></button>
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
