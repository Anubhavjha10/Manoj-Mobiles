import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Award, Plus, Trash2, Edit, X } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';

export const AdminBrandsPage = () => {
  const { brands, setBrands, refreshBrands, showToast } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', logoUrl: '' });

  useEffect(() => { refreshBrands(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditClick = (brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name || '', description: brand.description || '', logoUrl: brand.logoUrl || '' });
    setShowAddForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteBrand(deleteTarget);
      showToast('Brand deleted');
      refreshBrands();
    } catch (err) {
      showToast('Failed to delete brand');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingBrand) {
        await adminService.updateBrand(editingBrand.id, formData);
        showToast('Brand updated');
      } else {
        await adminService.createBrand(formData);
        showToast('Brand created');
      }
      setShowAddForm(false);
      setEditingBrand(null);
      setFormData({ name: '', description: '', logoUrl: '' });
      refreshBrands();
    } catch (err) {
      showToast(editingBrand ? 'Failed to update' : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><Award className="title-icon" /> Brand Management</h2>
        <button className="btn btn-primary" onClick={() => { setEditingBrand(null); setFormData({ name: '', description: '', logoUrl: '' }); setShowAddForm(!showAddForm); }}>
          {showAddForm ? <><X size={18} /> Close</> : <><Plus size={18} /> Add Brand</>}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-box">
          <h3 className="form-title">{editingBrand ? 'Edit Brand' : 'Create New Brand'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>Brand Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Apple" required className="form-input" />
            </div>
            <div>
              <label>Logo URL (Optional)</label>
              <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleInputChange} placeholder="https://..." className="form-input" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Brand description..." className="form-input"></textarea>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', gridColumn: '1 / -1', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => { setShowAddForm(false); setEditingBrand(null); }}>Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Brand'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Logo</th><th>Brand Name</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr><td colSpan="4" className="empty-state">No brands found.</td></tr>
            ) : (
              brands.map(brand => (
                <tr key={brand.id}>
                  <td><span className="id-badge">{brand.id.substring(0, 8)}</span></td>
                  <td>
                    {brand.logoUrl ? (
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
                        <img src={brand.logoUrl} alt={brand.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>N/A</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{brand.name}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit-btn" onClick={() => handleEditClick(brand)}><Edit size={16} /></button>
                      <button className="icon-btn delete-btn" onClick={() => setDeleteTarget(brand.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Brand?" message="Are you sure you want to delete this brand? Products linked to this brand may lose their association." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} confirmText="Delete Brand" danger />
    </div>
  );
};
