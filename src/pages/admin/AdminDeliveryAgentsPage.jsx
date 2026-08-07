import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Edit, Truck, X } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';

export const AdminDeliveryAgentsPage = () => {
  const { showToast } = useStore();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', vehicleNo: '' });

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDeliveryAgents(0, 50);
      setAgents(response?.content || []);
    } catch (err) {
      showToast('Failed to load delivery agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  const handleEditClick = (agent) => {
    setEditingAgent(agent);
    setFormData({ name: agent.name || '', email: agent.email || '', phone: agent.phone || '', password: '', vehicleNo: agent.vehicleNo || '' });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deleteDeliveryAgent(deleteTarget);
      showToast('Delivery agent deleted');
      fetchAgents();
    } catch (err) {
      showToast('Failed to delete agent');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAgent) {
        await adminService.updateDeliveryAgent(editingAgent.id, formData);
        showToast('Agent updated successfully');
      } else {
        await adminService.createDeliveryAgent(formData);
        showToast('Agent created successfully');
      }
      setShowForm(false);
      setEditingAgent(null);
      setFormData({ name: '', email: '', phone: '', password: '', vehicleNo: '' });
      fetchAgents();
    } catch (err) {
      showToast(editingAgent ? 'Failed to update' : 'Failed to create');
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><Truck className="title-icon" /> Delivery Agents</h2>
        <button className="btn btn-primary" onClick={() => { setEditingAgent(null); setFormData({ name: '', email: '', phone: '', password: '', vehicleNo: '' }); setShowForm(!showForm); }}>
          {showForm ? <><X size={18} /> Close</> : <><Plus size={18} /> Add Agent</>}
        </button>
      </div>

      {showForm && (
        <div className="admin-form-box">
          <h3 className="form-title">{editingAgent ? 'Edit Agent' : 'Create New Agent'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Agent Name" required className="form-input" /></div>
            <div><label>Email</label><input type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="agent@email.com" required className="form-input" /></div>
            <div><label>Phone</label><input type="text" name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" required className="form-input" /></div>
            <div><label>Password</label><input type="password" name="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={editingAgent ? "Leave empty to keep" : "••••••"} required={!editingAgent} className="form-input" /></div>
            <div><label>Vehicle Number</label><input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={e => setFormData({...formData, vehicleNo: e.target.value})} placeholder="MH-12-AB-1234" required className="form-input" /></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditingAgent(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Vehicle</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="empty-state">Loading agents...</td></tr>
            ) : agents.length === 0 ? (
              <tr><td colSpan="6" className="empty-state">No delivery agents found.</td></tr>
            ) : (
              agents.map(agent => (
                <tr key={agent.id}>
                  <td style={{ fontWeight: 600 }}>{agent.name}</td>
                  <td>{agent.email || '-'}</td>
                  <td>{agent.phone}</td>
                  <td><span className="badge badge-outline">{agent.vehicleNo}</span></td>
                  <td>
                    <span className={`badge ${agent.isAvailable ? 'badge-solid' : ''}`} style={!agent.isAvailable ? { color: '#EF4444', borderColor: '#EF4444', border: '1.5px solid' } : {}}>
                      {agent.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit-btn" onClick={() => handleEditClick(agent)}><Edit size={16} /></button>
                      <button className="icon-btn delete-btn" onClick={() => setDeleteTarget(agent.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Agent?" message="This will permanently remove this delivery agent from the system." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} confirmText="Delete Agent" danger />
    </div>
  );
};
