import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { adminService } from '../../services/adminService';
import { Layers, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PremiumRichTextEditor } from '../../components/admin/PremiumRichTextEditor';

export const AdminProductFormPage = () => {
  const { products, categories, brands, refreshProducts, showToast } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', brandId: '', categoryId: '', description: '', warrantyMonths: 12, returnPolicyDays: 7, isReturnable: true });

  useEffect(() => {
    if (isEditing) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData({
          name: product.name || '',
          brandId: product.brandId || '',
          categoryId: product.categoryId || '',
          description: product.description || '',
          warrantyMonths: product.warrantyMonths || 12,
          returnPolicyDays: product.returnPolicyDays || 7,
          isReturnable: product.isReturnable ?? true
        });
      } else {
        showToast('Product not found in list, fallback needed.');
        navigate('/admin/products');
      }
    }
  }, [id, products, isEditing, navigate, showToast]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name, brandId: formData.brandId, categoryId: formData.categoryId,
        description: formData.description, warrantyMonths: parseInt(formData.warrantyMonths),
        returnPolicyDays: parseInt(formData.returnPolicyDays), isReturnable: formData.isReturnable
      };
      
      if (isEditing) {
        await adminService.updateProduct(id, payload);
        showToast('Product Updated Successfully!');
      } else {
        await adminService.createProduct(payload);
        showToast('Product Created Successfully!');
      }
      
      refreshProducts();
      navigate('/admin/products');
    } catch(err) {
      showToast(isEditing ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/admin/products" className="icon-btn" style={{ color: '#64748B' }}>
            <ChevronLeft size={24} />
          </Link>
          <Layers className="title-icon" /> {isEditing ? 'Edit Product Details' : 'Add New Product'}
        </h2>
      </div>

      <div className="admin-card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Product Name</label>
            <input required type="text" placeholder="e.g. iPhone 15 Pro" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Brand</label>
            <select required value={formData.brandId} onChange={e => setFormData({...formData, brandId: e.target.value})} className="form-input">
              <option value="">Select Brand...</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Category</label>
            <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="form-input">
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Warranty (Months)</label>
            <input required type="number" placeholder="12" value={formData.warrantyMonths} onChange={e => setFormData({...formData, warrantyMonths: e.target.value})} className="form-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Return Policy (Days)</label>
            <input required type="number" placeholder="7" value={formData.returnPolicyDays} onChange={e => setFormData({...formData, returnPolicyDays: e.target.value})} className="form-input" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1', padding: '0.5rem 0' }}>
            <input type="checkbox" id="isReturnable" checked={formData.isReturnable} onChange={e => setFormData({...formData, isReturnable: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            <label htmlFor="isReturnable" style={{ margin: 0, fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500, color: '#334155' }}>Item is eligible for return</label>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Description</label>
            <PremiumRichTextEditor 
              value={formData.description} 
              onChange={(val) => setFormData({...formData, description: val})} 
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Save Product')}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
