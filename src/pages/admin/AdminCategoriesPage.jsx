import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Edit, Network } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const { categories, refreshProducts, showToast } = useStore();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', parentId: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, formData);
        showToast('Category updated successfully');
      } else {
        await adminService.createCategory(formData);
        showToast('Category created successfully');
      }
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '', parentId: '' });
      await refreshProducts();
    } catch (err) {
      showToast('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, parentId: cat.parentId || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will also delete all sub-categories mapped to this category.')) {
      try {
        await adminService.deleteCategory(id);
        showToast('Category deleted successfully');
        await refreshProducts();
      } catch (err) {
        showToast('Failed to delete category');
      }
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><Network className="title-icon" /> Category Management</h2>
        <button className="btn btn-primary" onClick={() => { setEditingCategory(null); setFormData({ name: '', parentId: '' }); setShowForm(true); }}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form-box mb-6">
          <h3 className="form-title">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
          <div className="form-row" style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label>Category Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                required 
                className="form-input" 
                placeholder="e.g. Mobiles"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Parent Category (Optional)</label>
              <select 
                value={formData.parentId} 
                onChange={e => setFormData({ ...formData, parentId: e.target.value })} 
                className="form-input"
              >
                <option value="">None (Root Category)</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} disabled={editingCategory?.id === c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Category'}
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
              <th>Category Name</th>
              <th>Parent Category</th>
              <th>Sub-categories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td><span className="id-badge">{cat.id?.substring(0,8)}</span></td>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td>
                  {cat.parentId ? (
                    <span className="badge badge-outline">
                      {categories.find(c => c.id === cat.parentId)?.name || 'Unknown'}
                    </span>
                  ) : <span className="text-muted">Root</span>}
                </td>
                <td>{cat.children?.length || 0} items</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn edit-btn" onClick={() => handleEdit(cat)}><Edit size={16} /></button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(cat.id)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan="5" className="empty-state">No categories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
