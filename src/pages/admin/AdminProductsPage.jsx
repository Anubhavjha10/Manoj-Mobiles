import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { adminService } from '../../services/adminService';
import { Plus, Trash2, Edit, Layers, X, Image as ImageIcon, Box, List, RefreshCw } from 'lucide-react';

export const AdminProductsPage = () => {
  const { products, categories, brands, setProducts, refreshProducts, formatINR, showToast } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', brandId: '', categoryId: '', description: '', 
    warrantyMonths: 12, returnPolicyDays: 7, isReturnable: true
  });

  const [activeProduct, setActiveProduct] = useState(null);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this product? All its variants will also be deleted.')) {
      try {
        await adminService.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Product deleted successfully');
        refreshProducts();
      } catch(err) {
        showToast('Failed to delete product');
      }
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
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="admin-form-box mb-6">
          <h3 className="form-title">Add New Product (Base Details)</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input required type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" style={{ gridColumn: 'span 2' }} />
            
            <select required value={formData.brandId} onChange={e => setFormData({...formData, brandId: e.target.value})} className="form-input">
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            
            <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="form-input">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <input required type="number" placeholder="Warranty (Months)" value={formData.warrantyMonths} onChange={e => setFormData({...formData, warrantyMonths: e.target.value})} className="form-input" />
            <input required type="number" placeholder="Return Policy (Days)" value={formData.returnPolicyDays} onChange={e => setFormData({...formData, returnPolicyDays: e.target.value})} className="form-input" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: 'span 2' }}>
              <input type="checkbox" id="isReturnable" checked={formData.isReturnable} onChange={e => setFormData({...formData, isReturnable: e.target.checked})} />
              <label htmlFor="isReturnable">Is Returnable</label>
            </div>

            <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="form-input" style={{ gridColumn: 'span 2', minHeight: '100px' }}></textarea>
            
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price (Starting)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{brands.find(b => b.id === p.brandId)?.name || p.brand}</td>
                <td>{categories.find(c => c.id === p.categoryId)?.name || p.category}</td>
                <td style={{ fontWeight: 600 }}>
                  {p.variants && p.variants.length > 0 ? formatINR(Math.min(...p.variants.map(v => v.sellingPrice || v.price || 0))) : (p.price ? formatINR(p.price) : 'N/A')}
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => setActiveProduct(p)} className="btn btn-outline btn-sm" style={{ padding: '0.2rem 0.6rem', gap: '0.3rem' }} title="Manage Variants">
                      <Layers size={14} /> Variants
                    </button>
                    <button className="icon-btn edit-btn"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className="icon-btn delete-btn"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="5" className="empty-state">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {activeProduct && (
        <VariantManagerModal 
          product={activeProduct} 
          onClose={() => { setActiveProduct(null); refreshProducts(); }} 
        />
      )}
    </div>
  );
};

const VariantManagerModal = ({ product, onClose }) => {
  const { showToast, refreshProducts } = useStore();
  const [variants, setVariants] = useState(product.variants || []);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // list, edit
  const [editData, setEditData] = useState(null);

  // Sub-modals
  const [activeInventoryVariant, setActiveInventoryVariant] = useState(null);
  const [activeImageVariant, setActiveImageVariant] = useState(null);
  const [activeSpecVariant, setActiveSpecVariant] = useState(null);

  const fetchUpdatedProduct = async () => {
    // In a real scenario we'd fetch product by ID. 
    // Here we'll just trigger a global refresh and the parent will pass new variants next render, 
    // but to prevent losing local state immediately, we can wait.
    await refreshProducts();
    // Assuming refreshProducts updates global state, we might need a direct fetch to update local `variants` instantly.
    // For now, we rely on the parent closing/reopening or passing down props.
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

  const handleDeleteVariant = async (vid) => {
    if(window.confirm('Delete variant?')) {
      try {
        await adminService.deleteVariant(vid);
        showToast('Variant deleted');
        setVariants(variants.filter(v => v.id !== vid));
        await fetchUpdatedProduct();
      } catch(e) {
        showToast('Delete failed');
      }
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ backgroundColor: 'white', width: '90%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px', padding: '1.5rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers /> Manage Variants for {product.name}
        </h2>

        {activeTab === 'list' && (
          <>
            <button className="btn btn-primary mb-4" onClick={() => { setEditData({ productId: product.id, variantName: '', sku: '', mrp: 0, sellingPrice: 0, gstPercent: 18, stockQty: 0, codAvailable: true }); setActiveTab('edit'); }}>
              <Plus size={16} /> Add Variant
            </button>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Tools</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map(v => (
                    <tr key={v.id}>
                      <td><span className="badge badge-outline">{v.sku}</span></td>
                      <td style={{ fontWeight: 600 }}>{v.variantName}</td>
                      <td>₹{v.sellingPrice}</td>
                      <td>
                        <span className={`badge ${v.stockQty > 0 ? 'badge-solid' : 'badge-outline'}`} style={v.stockQty === 0 ? {color: 'red', borderColor: 'red'} : {}}>
                          {v.stockQty} in stock
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.2rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => setActiveInventoryVariant(v)} title="Adjust Stock"><Box size={14} /></button>
                          <button className="btn btn-outline btn-sm" onClick={() => setActiveImageVariant(v)} title="Images"><ImageIcon size={14} /></button>
                          <button className="btn btn-outline btn-sm" onClick={() => setActiveSpecVariant(v)} title="Specs"><List size={14} /></button>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn edit-btn" onClick={() => { setEditData(v); setActiveTab('edit'); }}><Edit size={16} /></button>
                          <button className="icon-btn delete-btn" onClick={() => handleDeleteVariant(v.id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {variants.length === 0 && <tr><td colSpan="6" className="empty-state">No variants added yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'edit' && editData && (
          <form onSubmit={handleSaveVariant} className="admin-form-box">
            <h3 className="form-title">{editData.id ? 'Edit Variant' : 'New Variant'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Variant Name</label>
                <input required type="text" className="form-input" value={editData.variantName} onChange={e => setEditData({...editData, variantName: e.target.value})} />
              </div>
              <div>
                <label>SKU (Unique)</label>
                <input required type="text" className="form-input" value={editData.sku} onChange={e => setEditData({...editData, sku: e.target.value})} />
              </div>
              <div>
                <label>MRP (₹)</label>
                <input required type="number" step="0.01" className="form-input" value={editData.mrp} onChange={e => setEditData({...editData, mrp: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label>Selling Price (₹)</label>
                <input required type="number" step="0.01" className="form-input" value={editData.sellingPrice} onChange={e => setEditData({...editData, sellingPrice: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label>GST (%)</label>
                <input required type="number" step="0.01" className="form-input" value={editData.gstPercent} onChange={e => setEditData({...editData, gstPercent: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label>Initial Stock Qty</label>
                <input required type="number" className="form-input" value={editData.stockQty} disabled={!!editData.id} onChange={e => setEditData({...editData, stockQty: parseInt(e.target.value)})} title={editData.id ? "Use Inventory Adjustment to change stock" : ""} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: 'span 2' }}>
                <input type="checkbox" id="cod" checked={editData.codAvailable} onChange={e => setEditData({...editData, codAvailable: e.target.checked})} />
                <label htmlFor="cod">COD Available</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => setActiveTab('list')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Variant'}</button>
            </div>
          </form>
        )}

        {/* Sub-modals for variant specific data */}
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
      showToast('Inventory updated. Please refresh products to see changes globally.');
      onClose();
    } catch(err) {
      showToast('Failed to update inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div className="modal-content" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', width: '400px' }}>
        <h3 className="form-title">Adjust Inventory: {variant.sku}</h3>
        <p className="text-muted mb-4">Current Stock: <strong>{variant.stockQty}</strong></p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Adjustment Quantity (+/-)</label>
            <input type="number" required className="form-input" value={data.changeQty} onChange={e => setData({...data, changeQty: e.target.value})} placeholder="e.g. 5 or -2" />
          </div>
          <div className="mb-4">
            <label>Reason</label>
            <select required className="form-input" value={data.reason} onChange={e => setData({...data, reason: e.target.value})}>
              <option value="PURCHASE">Purchase (New Stock)</option>
              <option value="SALE">Sale (Manual Reduction)</option>
              <option value="RETURN">Return (Restock)</option>
              <option value="ADJUSTMENT">Adjustment (Audit/Loss)</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>Update</button>
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
      showToast('Image added');
    } catch(err) {
      showToast('Failed to add image');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    // Current API doc says delete image by ID `/api/products/images/{id}`
    // But variant.imageUrls is a string array, so we don't have Image IDs unless we change the API or DTO.
    // Assuming we can't easily delete a specific string URL without a custom backend method, 
    // we'll just show a toast for now or simulate it.
    alert("Image deletion requires the Image Entity ID from backend. In string array mode, this is restricted.");
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div className="modal-content" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', width: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="form-title" style={{ margin: 0 }}>Manage Images: {variant.sku}</h3>
          <button onClick={onClose} className="icon-btn"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input type="url" required className="form-input" placeholder="https://image-url..." value={url} onChange={e => setUrl(e.target.value)} style={{ flex: 1 }} />
          <button type="submit" className="btn btn-primary" disabled={loading}>Add URL</button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: 'relative', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={img} alt="Variant" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
              <button type="button" onClick={() => handleDelete(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px' }}><Trash2 size={12} /></button>
            </div>
          ))}
          {images.length === 0 && <p className="text-muted" style={{ gridColumn: 'span 4' }}>No images yet.</p>}
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
      showToast('Spec added');
    } catch(err) {
      showToast('Failed to add spec');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div className="modal-content" style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', width: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 className="form-title" style={{ margin: 0 }}>Specifications: {variant.sku}</h3>
          <button onClick={onClose} className="icon-btn"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}><label>Group</label><input type="text" required className="form-input" value={data.specGroup} onChange={e => setData({...data, specGroup: e.target.value})} placeholder="e.g. Display" /></div>
          <div style={{ flex: 1 }}><label>Key</label><input type="text" required className="form-input" value={data.specKey} onChange={e => setData({...data, specKey: e.target.value})} placeholder="e.g. Size" /></div>
          <div style={{ flex: 1 }}><label>Value</label><input type="text" required className="form-input" value={data.specValue} onChange={e => setData({...data, specValue: e.target.value})} placeholder="e.g. 6.5 inch" /></div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: '42px' }}><Plus size={18} /></button>
        </form>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr><th>Group</th><th>Key</th><th>Value</th><th>Act</th></tr>
            </thead>
            <tbody>
              {specs.map((s, i) => (
                <tr key={i}>
                  <td><span className="badge badge-outline">{s.specGroup}</span></td>
                  <td style={{ fontWeight: 600 }}>{s.specKey}</td>
                  <td>{s.specValue}</td>
                  <td><button type="button" className="icon-btn delete-btn"><Trash2 size={14}/></button></td>
                </tr>
              ))}
              {specs.length === 0 && <tr><td colSpan="4" className="empty-state">No specifications added.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
