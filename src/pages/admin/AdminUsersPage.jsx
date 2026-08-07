import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';

import { Plus, Trash2, Edit } from 'lucide-react';

export const AdminUsersPage = () => {
  const { showToast } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER'
  });

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      role: user.role || 'CUSTOMER'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to block/delete this user?')) {
      try {
        await adminService.deleteUser(id);
        showToast('User deleted successfully');
        fetchUsers();
      } catch (err) {
        showToast('Failed to delete user');
      }
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>User Management</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#38BDF8', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Add New User</>}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>{editingUser ? 'Edit User' : 'Create New User/Staff'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }} />
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }} />
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" required style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }} />
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={editingUser ? "Leave empty to keep password" : "Password"} required={!editingUser} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }} />
            <select name="role" value={formData.role} onChange={handleInputChange} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }}>
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
              <option value="DELIVERY_AGENT">Delivery Agent</option>
            </select>
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" style={{ backgroundColor: '#10B981', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}>
                {editingUser ? 'Update User' : 'Save User'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Name</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Email</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Phone</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Role</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No users found.</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#0F172A', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748B' }}>{u.email}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748B' }}>{u.phone || 'N/A'}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748B' }}>
                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: u.role === 'ADMIN' ? '#EDE9FE' : '#F1F5F9', color: u.role === 'ADMIN' ? '#6D28D9' : '#475569' }}>
                      {u.role || 'CUSTOMER'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditClick(u)} style={{ padding: '0.5rem', backgroundColor: '#E0F2FE', color: '#0284C7', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(u.id)} style={{ padding: '0.5rem', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
