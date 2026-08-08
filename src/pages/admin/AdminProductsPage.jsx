import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { adminService } from '../../services/adminService';
import { Plus, Trash2, Edit, Layers, X, Image as ImageIcon, Box, List } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { PremiumImageUpload } from '../../components/admin/PremiumImageUpload';

export const AdminProductsPage = () => {
  const { products, categories, brands, setProducts, refreshProducts, formatINR, showToast } = useStore();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '', brandId: '', categoryId: '', description: '', warrantyMonths: 12, returnPolicyDays: 7, isReturnable: true });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteProduct(deleteTarget);
      setProducts(prev => prev.filter(p => p.id !== deleteTarget));
      showToast('Product deleted successfully');
      refreshProducts();
    } catch(err) {
      showToast('Failed to delete product');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name, brandId: formData.brandId, categoryId: formData.categoryId,
        description: formData.description, warrantyMonths: parseInt(formData.warrantyMonths),
        returnPolicyDays: parseInt(formData.returnPolicyDays), isReturnable: formData.isReturnable
      };
      await adminService.createProduct(payload);
      showToast('Product Created Successfully!');
      setShowAddForm(false);
      setFormData({ name: '', brandId: '', categoryId: '', description: '', warrantyMonths: 12, returnPolicyDays: 7, isReturnable: true });
      refreshProducts();
    } catch(err) {
      showToast('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><Layers className="title-icon" /> Product Inventory</h2>
        <button className="btn btn-primary" onClick={() => navigate('/admin/products/add')}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Brand</th><th>Category</th><th>Price (Starting)</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="5" className="empty-state">No products found.</td></tr>
            ) : (
              products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td><span className="badge badge-outline">{brands.find(b => b.id === p.brandId)?.name || p.brand}</span></td>
                  <td><span className="badge badge-outline">{categories.find(c => c.id === p.categoryId)?.name || p.category}</span></td>
                  <td style={{ fontWeight: 600 }}>
                    {p.variants && p.variants.length > 0 ? formatINR(Math.min(...p.variants.map(v => v.sellingPrice || v.price || 0))) : (p.price ? formatINR(p.price) : 'N/A')}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => setActiveProduct(p)} className="btn btn-outline btn-sm" style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }} title="Manage Variants">
                        <Layers size={14} /> Variants
                      </button>
                      <button onClick={() => navigate(`/admin/products/edit/${p.id}`)} className="icon-btn edit-btn"><Edit size={16} /></button>
                      <button onClick={() => setDeleteTarget(p.id)} className="icon-btn delete-btn"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Product?" message="Are you sure you want to delete this product? All its variants, images, and specifications will be permanently deleted." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} confirmText="Delete Product" danger />

      {activeProduct && <VariantManagerModal product={activeProduct} onClose={() => { setActiveProduct(null); refreshProducts(); }} />}
    </div>
  );
};

const VariantManagerModal = ({ product, onClose }) => {
  const { showToast, refreshProducts, formatINR } = useStore();
  const [variants, setVariants] = useState(product.variants || []);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [editData, setEditData] = useState(null);
  const [deleteVariantTarget, setDeleteVariantTarget] = useState(null);

  const [activeInventoryVariant, setActiveInventoryVariant] = useState(null);
  const [activeImageVariant, setActiveImageVariant] = useState(null);
  const [activeSpecVariant, setActiveSpecVariant] = useState(null);

  const fetchUpdatedProduct = async () => {
    await refreshProducts();
    // Assuming context refresh is enough
  };

  const handleSaveVariant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData.id) {
        await adminService.updateVariant(editData.id, editData);
        showToast('Variant updated');
      } else {
        await adminService.createVariant(editData);
        showToast('Variant created');
      }
      setActiveTab('list');
      await fetchUpdatedProduct();
    } catch(err) {
      showToast('Error saving variant');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariant = async () => {
    if (!deleteVariantTarget) return;
    try {
      await adminService.deleteVariant(deleteVariantTarget);
      showToast('Variant deleted');
      setVariants(variants.filter(v => v.id !== deleteVariantTarget));
      await fetchUpdatedProduct();
    } catch(e) {
      showToast('Delete failed');
    } finally {
      setDeleteVariantTarget(null);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ width: '95%', maxWidth: '1100px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <button onClick={onClose} className="icon-btn" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: '#F1F5F9', color: '#475569' }}><X size={20} /></button>
        
        <h2 className="admin-page-title" style={{ marginBottom: '1.5rem' }}><Layers className="title-icon" /> Manage Variants for {product.name}</h2>

        {activeTab === 'list' && (
          <>
            <button className="btn btn-primary mb-6" onClick={() => { setEditData({ productId: product.id, variantName: '', sku: '', mrp: 0, sellingPrice: 0, gstPercent: 18, stockQty: 0, codAvailable: true }); setActiveTab('edit'); }}>
              <Plus size={16} /> Add New Variant
            </button>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr><th>SKU</th><th>Variant Name</th><th>Pricing</th><th>Stock</th><th>Configure</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {variants.length === 0 ? (
                    <tr><td colSpan="6" className="empty-state">No variants configured.</td></tr>
                  ) : (
                    variants.map(v => (
                      <tr key={v.id}>
                        <td><span className="id-badge">{v.sku}</span></td>
                        <td style={{ fontWeight: 600 }}>{v.variantName}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                            <span style={{ color: '#0F172A', fontWeight: 700 }}>{formatINR(v.sellingPrice)}</span>
                            <span style={{ color: '#94A3B8', textDecoration: 'line-through' }}>{formatINR(v.mrp)}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${v.stockQty > 0 ? 'badge-solid' : 'badge-outline'}`} style={v.stockQty <= 0 ? {color: '#EF4444', borderColor: '#EF4444'} : {}}>
                            {v.stockQty} in stock
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-outline btn-sm" onClick={() => setActiveInventoryVariant(v)} title="Adjust Stock"><Box size={14} /> Stock</button>
                            <button className="btn btn-outline btn-sm" onClick={() => setActiveImageVariant(v)} title="Images"><ImageIcon size={14} /> Media</button>
                            <button className="btn btn-outline btn-sm" onClick={() => setActiveSpecVariant(v)} title="Specs"><List size={14} /> Specs</button>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="icon-btn edit-btn" onClick={() => { setEditData(v); setActiveTab('edit'); }}><Edit size={16} /></button>
                            <button className="icon-btn delete-btn" onClick={() => setDeleteVariantTarget(v.id)}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'edit' && editData && (
          <div className="admin-form-box" style={{ margin: 0, boxShadow: 'none', border: '1px solid #E2E8F0' }}>
            <h3 className="form-title">{editData.id ? 'Edit Variant Details' : 'Configure New Variant'}</h3>
            <form onSubmit={handleSaveVariant} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><label>Variant Name</label><input required type="text" className="form-input" placeholder="e.g. 256GB - Blue" value={editData.variantName} onChange={e => setEditData({...editData, variantName: e.target.value})} /></div>
              <div><label>SKU (Must be Unique)</label><input required type="text" className="form-input" placeholder="IP15-256-BLU" value={editData.sku} onChange={e => setEditData({...editData, sku: e.target.value})} /></div>
              <div><label>MRP (₹)</label><input required type="number" step="0.01" className="form-input" value={editData.mrp} onChange={e => setEditData({...editData, mrp: parseFloat(e.target.value)})} /></div>
              <div><label>Selling Price (₹)</label><input required type="number" step="0.01" className="form-input" value={editData.sellingPrice} onChange={e => setEditData({...editData, sellingPrice: parseFloat(e.target.value)})} /></div>
              <div><label>GST (%)</label><input required type="number" step="0.01" className="form-input" value={editData.gstPercent} onChange={e => setEditData({...editData, gstPercent: parseFloat(e.target.value)})} /></div>
              <div><label>Initial Stock Qty</label><input required type="number" className="form-input" value={editData.stockQty} disabled={!!editData.id} onChange={e => setEditData({...editData, stockQty: parseInt(e.target.value)})} title={editData.id ? "Use Inventory Adjustment tool to change stock" : ""} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: '1 / -1', padding: '0.5rem 0' }}>
                <input type="checkbox" id="cod" checked={editData.codAvailable} onChange={e => setEditData({...editData, codAvailable: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <label htmlFor="cod" style={{ margin: 0, cursor: 'pointer' }}>Cash on Delivery Available</label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', gridColumn: '1 / -1', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveTab('list')}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Variant'}</button>
              </div>
            </form>
          </div>
        )}

        <ConfirmDialog isOpen={!!deleteVariantTarget} title="Delete Variant?" message="Deleting this variant will permanently erase its data. Continue?" onConfirm={handleDeleteVariant} onCancel={() => setDeleteVariantTarget(null)} confirmText="Delete Variant" danger />

        {activeInventoryVariant && <InventoryModal variant={activeInventoryVariant} onClose={() => setActiveInventoryVariant(null)} />}
        {activeImageVariant && <ImageModal variant={activeImageVariant} onClose={() => setActiveImageVariant(null)} />}
        {activeSpecVariant && <SpecModal variant={activeSpecVariant} onClose={() => setActiveSpecVariant(null)} />}
      </div>
    </div>
  );
};

// --- SUB MODALS ---

const InventoryModal = ({ variant, onClose }) => {
  const { showToast } = useStore();
  const [data, setData] = useState({ changeQty: 0, reason: 'PURCHASE' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.adjustInventory(variant.id, { changeQty: parseInt(data.changeQty), reason: data.reason });
      showToast('Inventory updated');
      onClose();
    } catch(err) {
      showToast('Failed to update inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, borderRadius: '16px' }}>
      <div className="modal-content admin-form-box" style={{ width: '420px', margin: 0 }}>
        <h3 className="form-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Box className="title-icon" /> Adjust Inventory</h3>
        <p className="text-muted mb-4">SKU: <strong>{variant.sku}</strong> • Current Stock: <strong>{variant.stockQty}</strong></p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>Adjustment Quantity (+/-)</label>
            <input type="number" required className="form-input" value={data.changeQty} onChange={e => setData({...data, changeQty: e.target.value})} placeholder="e.g. 10 or -5" />
          </div>
          <div>
            <label>Adjustment Reason</label>
            <select required className="form-input" value={data.reason} onChange={e => setData({...data, reason: e.target.value})}>
              <option value="PURCHASE">Purchase (Add Stock)</option>
              <option value="SALE">Sale (Manual Deduction)</option>
              <option value="RETURN">Return (Restock)</option>
              <option value="ADJUSTMENT">Adjustment (Audit/Loss)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>Update Stock</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ImageModal = ({ variant, onClose }) => {
  const { showToast } = useStore();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(variant.imageUrls || []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.addVariantImages(variant.id, [url]);
      setImages([...images, url]);
      setUrl('');
      showToast('Image URL added');
    } catch(err) {
      showToast('Failed to add image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    alert("In a real scenario, this would call DELETE /api/products/images/{id}. Currently restricted in string array mode.");
  };

  return (
    <div className="modal-overlay" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, borderRadius: '16px' }}>
      <div className="modal-content admin-form-box" style={{ width: '600px', margin: 0, padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="form-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}><ImageIcon className="title-icon" /> Manage Images</h3>
          <button onClick={onClose} className="icon-btn" style={{ border: 'none' }}><X size={20} /></button>
        </div>
        
        <div className="mb-4">
          <PremiumImageUpload 
            value={url} 
            onChange={setUrl} 
            onUploadError={showToast} 
            folder="products"
          />
          <button 
            type="button" 
            onClick={handleAdd} 
            className="btn btn-primary" 
            disabled={loading || !url} 
            style={{ width: '100%', marginTop: '0.75rem', height: '38px' }}
          >
            {loading ? 'Adding Image...' : 'Add Image to Variant'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', minHeight: '90px' }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: 'relative', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', padding: '0.25rem' }}>
              <img src={img} alt="Variant" style={{ width: '100%', height: '90px', objectFit: 'contain' }} />
              <button type="button" onClick={() => handleDelete(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '4px' }}><Trash2 size={12} /></button>
            </div>
          ))}
          {images.length === 0 && <div className="empty-state" style={{ gridColumn: 'span 4', padding: '2rem 1rem !important' }}>No images uploaded.</div>}
        </div>
      </div>
    </div>
  );
};

const SpecModal = ({ variant, onClose }) => {
  const { showToast } = useStore();
  const [specs, setSpecs] = useState(variant.specifications || []);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ specGroup: 'General', specKey: '', specValue: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { variantId: variant.id, specGroup: data.specGroup, specKey: data.specKey, specValue: data.specValue };
      await adminService.addVariantSpecifications(variant.id, [payload]);
      setSpecs([...specs, payload]);
      setData({ specGroup: 'General', specKey: '', specValue: '' });
      showToast('Specification added');
    } catch(err) {
      showToast('Failed to add specification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, borderRadius: '16px' }}>
      <div className="modal-content admin-form-box" style={{ width: '700px', margin: 0, maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="form-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><List className="title-icon" /> Technical Specifications</h3>
          <button onClick={onClose} className="icon-btn" style={{ border: 'none' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleAdd} className="form-row mb-6">
          <div style={{ flex: 1 }}><label>Group</label><input type="text" required className="form-input" value={data.specGroup} onChange={e => setData({...data, specGroup: e.target.value})} placeholder="e.g. Display" /></div>
          <div style={{ flex: 1 }}><label>Property Name</label><input type="text" required className="form-input" value={data.specKey} onChange={e => setData({...data, specKey: e.target.value})} placeholder="e.g. Screen Size" /></div>
          <div style={{ flex: 1 }}><label>Property Value</label><input type="text" required className="form-input" value={data.specValue} onChange={e => setData({...data, specValue: e.target.value})} placeholder="e.g. 6.7 inches" /></div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: '42px', padding: '0 1rem' }}><Plus size={18} /></button>
        </form>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr><th>Group</th><th>Property Key</th><th>Value</th><th>Action</th></tr>
            </thead>
            <tbody>
              {specs.length === 0 ? (
                <tr><td colSpan="4" className="empty-state">No specifications added yet.</td></tr>
              ) : (
                specs.map((s, i) => (
                  <tr key={i}>
                    <td><span className="badge badge-outline">{s.specGroup}</span></td>
                    <td style={{ fontWeight: 600 }}>{s.specKey}</td>
                    <td>{s.specValue}</td>
                    <td><button type="button" className="icon-btn delete-btn"><Trash2 size={14}/></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
