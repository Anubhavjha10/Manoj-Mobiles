import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Network, Plus, Trash2, Edit } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useNavigate, Outlet } from 'react-router-dom';

export const AdminCategoriesPage = () => {
  const { categories, refreshCategories, showToast } = useStore();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { refreshCategories(); }, []);

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

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><Network className="title-icon" /> Category Management</h2>
        <button className="btn btn-primary" onClick={() => navigate('/admin/categories/add')}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Image</th><th>Category Name</th><th>Parent Category</th><th>Sub-categories</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="6" className="empty-state">No categories found.</td></tr>
            ) : (
              categories.map(cat => {
                const parentCat = categories.find(c => c.id === cat.parentId);
                const subCats = categories.filter(c => c.parentId === cat.id);
                return (
                  <tr key={cat.id}>
                    <td><span className="id-badge">{cat.id.substring(0, 8)}</span></td>
                    <td>
                      {cat.imageUrl ? (
                        <div className="table-img-preview" style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
                          <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div className="table-img-preview" style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                          <Network size={20} />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{cat.name}</td>
                    <td>{parentCat ? <span className="badge badge-outline">{parentCat.name}</span> : <span className="text-muted">Root</span>}</td>
                    <td><span className="badge">{subCats.length} items</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit-btn" onClick={() => navigate(`/admin/categories/edit/${cat.id}`)}><Edit size={16} /></button>
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
      
      {/* Nested Route Modal will render here */}
      <Outlet />
    </div>
  );
};
