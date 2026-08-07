import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const AdminCategoryModal = () => {
  const { categories, refreshCategories, showToast } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', parentId: '' });

  useEffect(() => {
    if (isEditing) {
      const cat = categories.find(c => c.id === id);
      if (cat) {
        setFormData({ name: cat.name || '', description: cat.description || '', parentId: cat.parentId || '' });
      } else {
        showToast('Category not found');
        navigate('/admin/categories');
      }
    }
  }, [id, categories, isEditing, navigate, showToast]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, parentId: formData.parentId || null };
      if (isEditing) {
        await adminService.updateCategory(id, payload);
        showToast('Category updated');
      } else {
        await adminService.createCategory(payload);
        showToast('Category created');
      }
      refreshCategories();
      navigate('/admin/categories');
    } catch (err) {
      showToast(isEditing ? 'Failed to update' : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/admin/categories');
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="modal-content" style={{ backgroundColor: 'white', width: '95%', maxWidth: '600px', borderRadius: '16px', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <button onClick={handleClose} className="icon-btn" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: '#F1F5F9', color: '#475569' }}><X size={20} /></button>
        
        <h3 className="form-title" style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
          {isEditing ? 'Edit Category' : 'Create New Category'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Category Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Smartphones" required className="form-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Parent Category (Optional)</label>
            <select name="parentId" value={formData.parentId} onChange={handleInputChange} className="form-input">
              <option value="">None (Root Category)</option>
              {categories.filter(c => c.id !== id).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Category description..." className="form-input" rows={3}></textarea>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', gridColumn: '1 / -1', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={handleClose}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Category'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
