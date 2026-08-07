import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { adminService } from '../../services/adminService';
import { Plus, Trash2, Edit } from 'lucide-react';

export const AdminProductsPage = () => {
  const { products, setProducts, refreshProducts, formatINR, showToast } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', brand: '', category: '', price: '', originalPrice: '',
    description: '', imageUrl: '', slug: ''
  });

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
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
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-'),
        brand: formData.brand,
        category: formData.category,
        subCategory: formData.category,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
        description: formData.description,
        isDeal: false,
        isTrending: false,
        isBestSeller: false
      };
      
      await adminService.createProduct(payload);
      showToast('Product Created Successfully!');
      setShowAddForm(false);
      refreshProducts();
    } catch(err) {
      showToast('Failed to create product');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Product Inventory</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#0284C7', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} /> {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Add New Product</h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input required type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.25rem' }} />
            <input required type="text" placeholder="Brand (e.g. Apple)" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.25rem' }} />
            <input required type="text" placeholder="Category (e.g. Mobiles)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.25rem' }} />
            <input required type="number" placeholder="Price (₹)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.25rem' }} />
            <input type="number" placeholder="Original Price (₹)" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.25rem' }} />
            <input type="text" placeholder="Slug (optional)" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} style={{ padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.25rem' }} />
            <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ gridColumn: 'span 2', padding: '0.75rem', border: '1px solid #CBD5E1', borderRadius: '0.25rem', minHeight: '100px' }}></textarea>
            
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" style={{ padding: '0.75rem 2rem', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}>
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Name</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Brand</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Category</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Price</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#0F172A', fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748B' }}>{p.brand}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748B' }}>{p.category}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#0F172A', fontWeight: 600 }}>{formatINR(p.price)}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', marginRight: '1rem' }}><Edit size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
