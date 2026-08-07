import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PremiumImageUpload } from './PremiumImageUpload';

export const AdminBrandModal = () => {
  const { brands, refreshBrands, showToast } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', logoUrl: '' });

  useEffect(() => {
    if (isEditing) {
      const brand = brands.find(b => b.id === id);
      if (brand) {
        setFormData({ name: brand.name || '', description: brand.description || '', logoUrl: brand.logoUrl || '' });
      } else {
        showToast('Brand not found');
        navigate('/admin/brands');
      }
    }
  }, [id, brands, isEditing, navigate, showToast]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (url) => setFormData({ ...formData, logoUrl: url });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await adminService.updateBrand(id, formData);
        showToast('Brand updated');
      } else {
        await adminService.createBrand(formData);
        showToast('Brand created');
      }
      refreshBrands();
      navigate('/admin/brands');
    } catch (err) {
      showToast(isEditing ? 'Failed to update' : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/admin/brands');
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="modal-content" style={{ backgroundColor: 'white', width: '95%', maxWidth: '600px', borderRadius: '16px', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <button onClick={handleClose} className="icon-btn" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: '#F1F5F9', color: '#475569' }}><X size={20} /></button>
        
        <h3 className="form-title" style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
          {isEditing ? 'Edit Brand' : 'Create New Brand'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Brand Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Apple" required className="form-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Brand Logo</label>
            <PremiumImageUpload 
              value={formData.logoUrl} 
              onChange={handleImageChange} 
              onUploadError={showToast} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Brand description..." className="form-input" rows={3}></textarea>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={handleClose}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Brand'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
