import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react';

export const AdminCatalogPage = () => {
  const { categories, brands, refreshProducts, showToast } = useStore();
  const [activeTab, setActiveTab] = useState('categories');
  const [loading, setLoading] = useState(false);

  // Category Form State
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({ name: '', imageUrl: '' });

  // Brand Form State
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandData, setBrandData] = useState({ name: '', logoUrl: '' });

  // Handlers for Categories
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, categoryData);
        showToast('Category updated successfully');
      } else {
        await adminService.createCategory(categoryData);
        showToast('Category created successfully');
      }
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryData({ name: '', imageUrl: '' });
      await refreshProducts();
    } catch (err) {
      showToast('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryData({ name: cat.name, imageUrl: cat.imageUrl || '' });
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure? This might affect products in this category.')) {
      try {
        await adminService.deleteCategory(id);
        showToast('Category deleted successfully');
        await refreshProducts();
      } catch (err) {
        showToast('Failed to delete category');
      }
    }
  };

  // Handlers for Brands
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingBrand) {
        await adminService.updateBrand(editingBrand.id, brandData);
        showToast('Brand updated successfully');
      } else {
        await adminService.createBrand(brandData);
        showToast('Brand created successfully');
      }
      setShowBrandForm(false);
      setEditingBrand(null);
      setBrandData({ name: '', logoUrl: '' });
      await refreshProducts();
    } catch (err) {
      showToast('Failed to save brand');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setBrandData({ name: brand.name, logoUrl: brand.logoUrl || '' });
    setShowBrandForm(true);
  };

  const handleDeleteBrand = async (id) => {
    if (window.confirm('Are you sure? This might affect products from this brand.')) {
      try {
        await adminService.deleteBrand(id);
        showToast('Brand deleted successfully');
        await refreshProducts();
      } catch (err) {
        showToast('Failed to delete brand');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Catalog Management</h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #E2E8F0', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('categories')}
          style={{ padding: '0.75rem 1.5rem', border: 'none', backgroundColor: 'transparent', borderBottom: activeTab === 'categories' ? '2px solid #38BDF8' : '2px solid transparent', color: activeTab === 'categories' ? '#38BDF8' : '#64748B', fontWeight: 600, cursor: 'pointer' }}
        >
          Categories
        </button>
        <button 
          onClick={() => setActiveTab('brands')}
          style={{ padding: '0.75rem 1.5rem', border: 'none', backgroundColor: 'transparent', borderBottom: activeTab === 'brands' ? '2px solid #38BDF8' : '2px solid transparent', color: activeTab === 'brands' ? '#38BDF8' : '#64748B', fontWeight: 600, cursor: 'pointer' }}
        >
          Brands
        </button>
      </div>

      {/* Categories View */}
      {activeTab === 'categories' && (
        <div>
          <button 
            onClick={() => { setShowCategoryForm(!showCategoryForm); setEditingCategory(null); setCategoryData({name:'', imageUrl:''}); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#38BDF8', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600, marginBottom: '1.5rem' }}
          >
            {showCategoryForm ? 'Cancel' : <><Plus size={16} /> Add Category</>}
          </button>

          {showCategoryForm && (
            <form onSubmit={handleCategorySubmit} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="text" placeholder="Category Name" value={categoryData.name} onChange={e => setCategoryData({...categoryData, name: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', flex: 1 }} />
              <input type="url" placeholder="Image URL (optional)" value={categoryData.imageUrl} onChange={e => setCategoryData({...categoryData, imageUrl: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', flex: 1 }} />
              <button type="submit" disabled={loading} style={{ backgroundColor: '#10B981', color: 'white', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}>
                {loading ? 'Saving...' : (editingCategory ? 'Update' : 'Save')}
              </button>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {categories.map(cat => (
              <div key={cat.id} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#F1F5F9', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}><ImageIcon size={20}/></div>
                  )}
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{cat.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditCategory(cat)} style={{ padding: '0.25rem', color: '#0284C7', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={16}/></button>
                  <button onClick={() => handleDeleteCategory(cat.id)} style={{ padding: '0.25rem', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brands View */}
      {activeTab === 'brands' && (
        <div>
          <button 
            onClick={() => { setShowBrandForm(!showBrandForm); setEditingBrand(null); setBrandData({name:'', logoUrl:''}); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#38BDF8', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600, marginBottom: '1.5rem' }}
          >
            {showBrandForm ? 'Cancel' : <><Plus size={16} /> Add Brand</>}
          </button>

          {showBrandForm && (
            <form onSubmit={handleBrandSubmit} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="text" placeholder="Brand Name" value={brandData.name} onChange={e => setBrandData({...brandData, name: e.target.value})} required style={{ padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', flex: 1 }} />
              <input type="url" placeholder="Logo URL (optional)" value={brandData.logoUrl} onChange={e => setBrandData({...brandData, logoUrl: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem', flex: 1 }} />
              <button type="submit" disabled={loading} style={{ backgroundColor: '#10B981', color: 'white', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}>
                {loading ? 'Saving...' : (editingBrand ? 'Update' : 'Save')}
              </button>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {brands.map(brand => (
              <div key={brand.id} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '0.25rem' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#F1F5F9', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}><ImageIcon size={20}/></div>
                  )}
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>{brand.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditBrand(brand)} style={{ padding: '0.25rem', color: '#0284C7', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={16}/></button>
                  <button onClick={() => handleDeleteBrand(brand.id)} style={{ padding: '0.25rem', color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
