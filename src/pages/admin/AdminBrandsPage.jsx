import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Edit, Award, Image as ImageIcon } from 'lucide-react';

export const AdminBrandsPage = () => {
  const { brands, refreshProducts, showToast } = useStore();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', logoUrl: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingBrand) {
        await adminService.updateBrand(editingBrand.id, formData);
        showToast('Brand updated successfully');
      } else {
        await adminService.createBrand(formData);
        showToast('Brand created successfully');
      }
      setShowForm(false);
      setEditingBrand(null);
      setFormData({ name: '', logoUrl: '' });
      await refreshProducts();
    } catch (err) {
      showToast('Failed to save brand');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, logoUrl: brand.logoUrl || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will affect products mapped to this brand.')) {
      try {
        await adminService.deleteBrand(id);
        showToast('Brand deleted successfully');
        await refreshProducts();
      } catch (err) {
        showToast('Failed to delete brand');
      }
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><Award className="title-icon" /> Brand Management</h2>
        <button className="btn btn-primary" onClick={() => { setEditingBrand(null); setFormData({ name: '', logoUrl: '' }); setShowForm(true); }}>
          <Plus size={18} /> Add Brand
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form-box mb-6">
          <h3 className="form-title">{editingBrand ? 'Edit Brand' : 'New Brand'}</h3>
          <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label>Brand Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                required 
                className="form-input" 
                placeholder="e.g. Apple"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Brand Logo URL</label>
              <div className="input-with-icon">
                <ImageIcon className="input-icon" />
                <input 
                  type="url" 
                  value={formData.logoUrl} 
                  onChange={e => setFormData({ ...formData, logoUrl: e.target.value })} 
                  className="form-input" 
                  placeholder="https://..."
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Brand'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </form>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Logo</th>
              <th>Brand Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(brand => (
              <tr key={brand.id}>
                <td><span className="id-badge">{brand.id?.substring(0,8)}</span></td>
                <td>
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.name} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  ) : (
                    <div className="placeholder-img" style={{ width: 40, height: 40, background: '#f1f5f9', borderRadius: 4 }}></div>
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{brand.name}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn edit-btn" onClick={() => handleEdit(brand)}><Edit size={16} /></button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(brand.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr><td colSpan="4" className="empty-state">No brands found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
