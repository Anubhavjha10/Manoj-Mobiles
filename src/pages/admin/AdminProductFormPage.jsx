import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { adminService } from '../../services/adminService';
import { ChevronLeft, PackagePlus, Info, PenTool } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PremiumRichTextEditor } from '../../components/admin/PremiumRichTextEditor';

export const AdminProductFormPage = () => {
  const { products, categories, brands, refreshProducts, showToast } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '',
    brandId: '',
    categoryId: '',
    description: '',
    warrantyMonths: 12,
    returnPolicyDays: 7,
    isReturnable: true
  });

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
        showToast('Product not found.');
        navigate('/admin/products');
      }
    }
  }, [id, products, isEditing, navigate, showToast]);

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productPayload = {
        name: formData.name,
        brandId: formData.brandId,
        categoryId: formData.categoryId,
        description: formData.description,
        warrantyMonths: parseInt(formData.warrantyMonths),
        returnPolicyDays: parseInt(formData.returnPolicyDays),
        isReturnable: formData.isReturnable
      };
      
      if (isEditing) {
        await adminService.updateProduct(id, productPayload);
        showToast('Product Updated Successfully!');
      } else {
        await adminService.createProduct(productPayload);
        showToast('Product Created! Now you can manage its variants.');
      }
      
      refreshProducts();
      navigate('/admin/products');
    } catch(err) {
      showToast(isEditing ? 'Failed to update product' : 'Failed to create product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header" style={{ marginBottom: '1rem' }}>
        <h2 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/admin/products" className="icon-btn" style={{ color: '#64748B' }}>
            <ChevronLeft size={24} />
          </Link>
          <PackagePlus className="title-icon" /> {isEditing ? 'Edit Product Details' : 'Create New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
        
        {/* SECTION 1: Basic Info */}
        <div className="admin-card">
          <h3 className="admin-card-section-title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem' }}>
            <Info size={18} /> Basic Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Product Name</label>
              <input required type="text" placeholder="e.g. iPhone 15 Pro Max" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" style={{ fontSize: '1.1rem' }} />
              {formData.name && !isEditing && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>Auto-Slug Preview:</span> 
                  <span className="auto-slug-badge" style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'monospace' }}>
                    {generateSlug(formData.name)}
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Brand</label>
              <select required value={formData.brandId} onChange={e => setFormData({...formData, brandId: e.target.value})} className="form-input">
                <option value="">Select Brand...</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Category</label>
              <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="form-input">
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Warranty (Months)</label>
              <input required type="number" placeholder="12" value={formData.warrantyMonths} onChange={e => setFormData({...formData, warrantyMonths: e.target.value})} className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Return Policy (Days)</label>
              <input required type="number" placeholder="7" value={formData.returnPolicyDays} onChange={e => setFormData({...formData, returnPolicyDays: e.target.value})} className="form-input" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1', padding: '0.5rem 0' }}>
              <input type="checkbox" id="isReturnable" checked={formData.isReturnable} onChange={e => setFormData({...formData, isReturnable: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
              <label htmlFor="isReturnable" style={{ margin: 0, fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500 }}>Item is eligible for return</label>
            </div>
          </div>
        </div>

        {/* SECTION 2: Description */}
        <div className="admin-card">
          <h3 className="admin-card-section-title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem' }}>
            <PenTool size={18} /> Rich Description
          </h3>
          <PremiumRichTextEditor 
            value={formData.description} 
            onChange={(val) => setFormData({...formData, description: val})} 
          />
        </div>
        
        {/* SUBMIT BUTTON */}
        <div className="admin-form-sticky-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '1rem', borderRadius: '12px', position: 'sticky', bottom: '1rem', zIndex: 10 }}>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem', flex: 1 }}>
            {loading ? 'Processing...' : (isEditing ? 'Update Product' : 'Save Product')}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};
