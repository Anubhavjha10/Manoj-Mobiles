import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Network, Plus, Trash2, Edit, X } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';

export const AdminCategoriesPage = () => {
  const { categories, setCategories, refreshCategories, showToast } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', parentId: '' });

  useEffect(() => { refreshCategories(); }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditClick = (cat) => {
    setEditingCat(cat);
    setFormData({ name: cat.name || '', description: cat.description || '', parentId: cat.parentId || '' });
    setShowAddForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteCategory(deleteTarget);
      showToast('Category deleted');
      refreshCategories();
    } catch (err) {
      showToast('Failed to delete category');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, parentId: formData.parentId || null };
      if (editingCat) {
        await adminService.updateCategory(editingCat.id, payload);
        showToast('Category updated');
      } else {
        await adminService.createCategory(payload);
        showToast('Category created');
      }
      setShowAddForm(false);
      setEditingCat(null);
      setFormData({ name: '', description: '', parentId: '' });
      refreshCategories();
    } catch (err) {
      showToast(editingCat ? 'Failed to update' : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><Network className="title-icon" /> Category Management</h2>
        <button className="btn btn-primary" onClick={() => { setEditingCat(null); setFormData({ name: '', description: '', parentId: '' }); setShowAddForm(!showAddForm); }}>
          {showAddForm ? <><X size={18} /> Close</> : <><Plus size={18} /> Add Category</>}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-box">
          <h3 className="form-title">{editingCat ? 'Edit Category' : 'Create New Category'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>Category Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Smartphones" required className="form-input" />
            </div>
            <div>
              <label>Parent Category (Optional)</label>
              <select name="parentId" value={formData.parentId} onChange={handleInputChange} className="form-input">
                <option value="">None (Root Category)</option>
                {categories.filter(c => c.id !== editingCat?.id).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Category description..." className="form-input"></textarea>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', gridColumn: '1 / -1', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => { setShowAddForm(false); setEditingCat(null); }}>Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Category'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Category Name</th><th>Parent Category</th><th>Sub-categories</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="5" className="empty-state">No categories found.</td></tr>
            ) : (
              categories.map(cat => {
                const parentCat = categories.find(c => c.id === cat.parentId);
                const subCats = categories.filter(c => c.parentId === cat.id);
                return (
                  <tr key={cat.id}>
                    <td><span className="id-badge">{cat.id.substring(0, 8)}</span></td>
                    <td style={{ fontWeight: 600 }}>{cat.name}</td>
                    <td>{parentCat ? <span className="badge badge-outline">{parentCat.name}</span> : <span className="text-muted">Root</span>}</td>
                    <td><span className="badge">{subCats.length} items</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" onClick={() => handleEditClick(cat)}><Edit size={16} /></button>
                        <button className="icon-btn delete-btn" onClick={() => setDeleteTarget(cat.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Category?" message="Are you sure you want to delete this category? Products linked to this category may lose their categorization." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} confirmText="Delete Category" danger />
    </div>
  );
};
