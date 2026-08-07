import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Users as UsersIcon, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export const AdminUserFormPage = () => {
  const { showToast } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'ADMIN' });

  useEffect(() => {
    if (isEditing) {
      // In a real app we'd fetch the single user by ID.
      // For now, fetch list and find, or just fallback if not found.
      const loadUser = async () => {
        try {
          const res = await adminService.getUsers(0, 100);
          const users = res?.content || [];
          const user = users.find(u => u.id === id);
          if (user) {
            setFormData({
              name: user.name || '',
              email: user.email || '',
              phone: user.phone || '',
              password: '', // leave empty to not override
              role: user.role || 'ADMIN'
            });
          } else {
            showToast('User not found');
            navigate('/admin/users');
          }
        } catch(e) {
          showToast('Failed to load user');
        }
      };
      loadUser();
    }
  }, [id, navigate, showToast, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await adminService.updateUser(id, formData);
        showToast('Admin user updated successfully');
      } else {
        await adminService.createUser(formData);
        showToast('Admin user created successfully');
      }
      navigate('/admin/users');
    } catch (err) {
      showToast(isEditing ? 'Failed to update user' : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/admin/users" className="icon-btn" style={{ color: '#64748B' }}>
            <ChevronLeft size={24} />
          </Link>
          <UsersIcon className="title-icon" /> {isEditing ? 'Edit Admin Details' : 'Create New Admin'}
        </h2>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" required className="form-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@email.com" required className="form-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" required className="form-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={isEditing ? "Leave empty to keep current password" : "••••••"} required={!isEditing} className="form-input" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Role</label>
            <select name="role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="form-input" style={{ width: '50%' }}>
              <option value="ADMIN">Admin</option>
              <option value="DELIVERY_AGENT">Delivery Agent</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving...' : (isEditing ? 'Update Admin' : 'Save Admin')}
            </button>
            <button type="button" onClick={() => navigate('/admin/users')} className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
