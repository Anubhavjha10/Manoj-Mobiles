import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { adminService } from '../../services/adminService';
import { Layers, ChevronLeft, Plus, Trash2, PackagePlus, Info, Banknote, PenTool, Image as ImageIcon, Box } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PremiumRichTextEditor } from '../../components/admin/PremiumRichTextEditor';
import { MultiImageUpload } from '../../components/admin/MultiImageUpload';

export const AdminProductFormPage = () => {
  const { products, categories, brands, refreshProducts, showToast } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    // Basic Product Info
    name: '', brandId: '', categoryId: '', description: '', warrantyMonths: 12, returnPolicyDays: 7, isReturnable: true,
    
    // Media
    images: [],

    // Default Variant Pricing & Inventory
    variantName: 'Standard', sku: '', mrp: '', sellingPrice: '', gstPercentage: 18, stockQuantity: 10, isCodAvailable: true,

    // Technical Specifications
    specifications: [
      { group: 'General', key: '', value: '' }
    ]
  });

  useEffect(() => {
    if (isEditing) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData(prev => ({
          ...prev,
          name: product.name || '',
          brandId: product.brandId || '',
          categoryId: product.categoryId || '',
          description: product.description || '',
          warrantyMonths: product.warrantyMonths || 12,
          returnPolicyDays: product.returnPolicyDays || 7,
          isReturnable: product.isReturnable ?? true
          // In edit mode, we typically just edit basic info here. 
          // Variants/Images/Specs are managed via their respective managers in the table.
        }));
      } else {
        showToast('Product not found in list, fallback needed.');
        navigate('/admin/products');
      }
    }
  }, [id, products, isEditing, navigate, showToast]);

  const handleAddSpec = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { group: prev.specifications.length > 0 ? prev.specifications[prev.specifications.length - 1].group : 'General', key: '', value: '' }]
    }));
  };

  const handleRemoveSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSpecChange = (index, field, value) => {
    setFormData(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specifications: newSpecs };
    });
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Create Product
      const productPayload = {
        name: formData.name, brandId: formData.brandId, categoryId: formData.categoryId,
        description: formData.description, warrantyMonths: parseInt(formData.warrantyMonths),
        returnPolicyDays: parseInt(formData.returnPolicyDays), isReturnable: formData.isReturnable
      };
      
      let productId = id;
      
      if (isEditing) {
        await adminService.updateProduct(id, productPayload);
        showToast('Product Updated Successfully!');
      } else {
        const productRes = await adminService.createProduct(productPayload);
        productId = productRes?.data?.id || productRes?.id;

        if (!productId) {
            throw new Error("Could not retrieve Product ID from response");
        }

        // Step 2: Create Default Variant
        const variantPayload = {
           productId,
           variantName: formData.variantName || 'Standard',
           sku: formData.sku,
           mrp: parseFloat(formData.mrp),
           sellingPrice: parseFloat(formData.sellingPrice),
           gstPercent: parseFloat(formData.gstPercentage),
           stockQty: parseInt(formData.stockQuantity),
           codAvailable: formData.isCodAvailable
        };
        const variantRes = await adminService.createVariant(variantPayload);
        const variantId = variantRes?.data?.id || variantRes?.id;

        if (variantId) {
            // Step 3: Attach Images
            if (formData.images.length > 0) {
               await adminService.addVariantImages(variantId, formData.images);
            }

            // Step 4: Attach Specs
            const validSpecs = formData.specifications
              .filter(s => s.key && s.value)
              .map(s => ({
                specGroup: s.group || 'General',
                specKey: s.key,
                specValue: s.value
              }));
            if (validSpecs.length > 0) {
               await adminService.addVariantSpecifications(variantId, validSpecs);
            }
        }
        
        showToast('Product & Initial Setup Complete!');
      }
      
      refreshProducts();
      navigate('/admin/products');
    } catch(err) {
      showToast(isEditing ? 'Failed to update product' : 'Failed to create product setup');
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
          <PackagePlus className="title-icon" /> {isEditing ? 'Edit Product Basic Info' : 'Create New Product Setup'}
        </h2>
      </div>

      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
        
        {/* SECTION 1: Basic Info */}
        <div className="admin-card">
          <h3 className="admin-card-section-title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem' }}>
            <Info size={18} /> Basic Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Product Name</label>
              <input required type="text" placeholder="e.g. iPhone 15 Pro Max (Titanium, 256GB)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" style={{ fontSize: '1.1rem' }} />
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

        {!isEditing && (
            <>
            {/* SECTION 2: Media Gallery */}
            <div className="admin-card">
              <h3 className="admin-card-section-title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem' }}>
                <ImageIcon size={18} /> Media Gallery (Default Variant)
              </h3>
              <MultiImageUpload 
                value={formData.images}
                onChange={(newImages) => setFormData({...formData, images: newImages})}
                folder="products"
              />
            </div>

            {/* SECTION 3: Pricing & Inventory */}
            <div className="admin-card">
              <h3 className="admin-card-section-title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem' }}>
                <Banknote size={18} /> Default Variant Pricing & Inventory
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Variant Name</label>
                  <input required type="text" placeholder="e.g. Standard or 128GB" value={formData.variantName} onChange={e => setFormData({...formData, variantName: e.target.value})} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>SKU (Stock Keeping Unit)</label>
                  <input required type="text" placeholder="e.g. IPH-15-PRO-256" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="form-input" />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>MRP (₹)</label>
                  <input required type="number" step="0.01" placeholder="99999" value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Selling Price (₹)</label>
                  <input required type="number" step="0.01" placeholder="89999" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} className="form-input" />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>GST Percentage (%)</label>
                  <input required type="number" step="0.01" placeholder="18" value={formData.gstPercentage} onChange={e => setFormData({...formData, gstPercentage: e.target.value})} className="form-input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Initial Stock Quantity</label>
                  <input required type="number" placeholder="10" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="form-input" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1' }}>
                  <input type="checkbox" id="isCodAvailable" checked={formData.isCodAvailable} onChange={e => setFormData({...formData, isCodAvailable: e.target.checked})} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  <label htmlFor="isCodAvailable" style={{ margin: 0, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Cash on Delivery Available</label>
                </div>
              </div>
            </div>

            {/* SECTION 4: Technical Specifications */}
            <div className="admin-card">
              <h3 className="admin-card-section-title" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem' }}>
                <Box size={18} /> Technical Specifications
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="spec-header-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, padding: '0 0.5rem' }}>
                  <div>Group (e.g. Display)</div>
                  <div>Key (e.g. Size)</div>
                  <div>Value (e.g. 6.7 inches)</div>
                  <div style={{ width: '40px' }}></div>
                </div>
                
                {formData.specifications.map((spec, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="text" placeholder="Group" value={spec.group} onChange={e => handleSpecChange(idx, 'group', e.target.value)} className="form-input" style={{ padding: '0.5rem' }} />
                    <input type="text" placeholder="Key" value={spec.key} onChange={e => handleSpecChange(idx, 'key', e.target.value)} className="form-input" style={{ padding: '0.5rem' }} />
                    <input type="text" placeholder="Value" value={spec.value} onChange={e => handleSpecChange(idx, 'value', e.target.value)} className="form-input" style={{ padding: '0.5rem' }} />
                    <button type="button" onClick={() => handleRemoveSpec(idx)} style={{ color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <button type="button" onClick={handleAddSpec} className="btn-add-spec" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                  <Plus size={16} /> Add Specification Row
                </button>
              </div>
            </div>
            </>
        )}

        {/* SECTION 5: Description */}
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
            {loading ? 'Processing...' : (isEditing ? 'Update Product' : 'Save Complete Product')}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};
