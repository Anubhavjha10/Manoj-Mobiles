import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const AdminDeliveryAgentModal = () => {
  const { showToast } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', vehicleNo: '' });

  useEffect(() => {
    if (isEditing) {
      const fetchAgent = async () => {
        try {
          const res = await adminService.getDeliveryAgents(0, 100);
          const agents = res?.content || [];
          const agent = agents.find(a => a.id === id);
          if (agent) {
            setFormData({ name: agent.name || '', email: agent.email || '', phone: agent.phone || '', password: '', vehicleNo: agent.vehicleNo || '' });
          } else {
            showToast('Agent not found');
            navigate('/admin/delivery-agents');
          }
        } catch (err) {
          showToast('Failed to load agent');
        }
      };
      fetchAgent();
    }
  }, [id, isEditing, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await adminService.updateDeliveryAgent(id, formData);
        showToast('Agent updated successfully');
      } else {
        await adminService.createDeliveryAgent(formData);
        showToast('Agent created successfully');
      }
      navigate('/admin/delivery-agents');
    } catch (err) {
      showToast(isEditing ? 'Failed to update' : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/admin/delivery-agents');
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="modal-content" style={{ backgroundColor: 'white', width: '95%', maxWidth: '700px', borderRadius: '16px', padding: '2rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <button onClick={handleClose} className="icon-btn" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: '#F1F5F9', color: '#475569' }}><X size={20} /></button>
        
        <h3 className="form-title" style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
          {isEditing ? 'Edit Agent' : 'Create New Agent'}
        </h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Full Name</label><input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Agent Name" required className="form-input" /></div>
          <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Email</label><input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="agent@email.com" required className="form-input" /></div>
          <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Phone</label><input type="text" name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" required className="form-input" /></div>
          <div><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Password</label><input type="password" name="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={isEditing ? "Leave empty to keep" : "••••••"} required={!isEditing} className="form-input" /></div>
          <div style={{ gridColumn: '1 / -1' }}><label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Vehicle Number</label><input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={e => setFormData({...formData, vehicleNo: e.target.value})} placeholder="MH-12-AB-1234" required className="form-input" /></div>
          
          <div style={{ display: 'flex', gap: '0.75rem', gridColumn: '1 / -1', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={handleClose}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save Agent'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
