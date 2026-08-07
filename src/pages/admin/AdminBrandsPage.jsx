import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Award, Plus, Trash2, Edit } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useNavigate, Outlet } from 'react-router-dom';

export const AdminBrandsPage = () => {
  const { brands, refreshBrands, showToast } = useStore();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { refreshBrands(); }, []);

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

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><Award className="title-icon" /> Brand Management</h2>
        <button className="btn btn-primary" onClick={() => navigate('/admin/brands/add')}>
          <Plus size={18} /> Add Brand
        </button>
      </div>

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
                      <button className="icon-btn edit-btn" onClick={() => navigate(`/admin/brands/edit/${brand.id}`)}><Edit size={16} /></button>
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
      
      {/* Nested Route Modal will render here */}
      <Outlet />
    </div>
  );
};
