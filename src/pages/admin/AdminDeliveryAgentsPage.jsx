import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Edit } from 'lucide-react';

export const AdminDeliveryAgentsPage = () => {
  const { showToast } = useStore();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleNo: ''
  });

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

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name || '',
      email: agent.email || '',
      phone: agent.phone || '',
      password: '', // leave empty unless they want to change
      vehicleNo: agent.vehicleNo || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this delivery agent?')) {
      try {
        await adminService.deleteDeliveryAgent(id);
        showToast('Delivery agent deleted successfully');
        fetchAgents();
      } catch (err) {
        showToast('Failed to delete agent');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAgent) {
        await adminService.updateDeliveryAgent(editingAgent.id, formData);
        showToast('Delivery agent updated successfully');
      } else {
        await adminService.createDeliveryAgent(formData);
        showToast('Delivery agent created successfully');
      }
      setShowAddForm(false);
      setEditingAgent(null);
      setFormData({ name: '', email: '', phone: '', password: '', vehicleNo: '' });
      fetchAgents();
    } catch (err) {
      showToast(editingAgent ? 'Failed to update agent' : 'Failed to create agent');
    }
  };

  const cancelEdit = () => {
    setShowAddForm(false);
    setEditingAgent(null);
    setFormData({ name: '', email: '', phone: '', password: '', vehicleNo: '' });
  };

  if (loading) return <div>Loading Delivery Agents...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Delivery Agents</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#38BDF8', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
        >
          {showAddForm ? 'Cancel' : <><Plus size={18} /> Add New Agent</>}
        </button>
      </div>

      {showAddForm && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>{editingAgent ? 'Edit Delivery Agent' : 'Create New Delivery Agent'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }} />
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }} />
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" required style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }} />
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={editingAgent ? "Leave empty to keep current password" : "Password"} required={!editingAgent} style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }} />
            <input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleInputChange} placeholder="Vehicle No" required style={{ padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.375rem' }} />
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" style={{ backgroundColor: '#10B981', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}>
                {editingAgent ? 'Update Agent' : 'Save Agent'}
              </button>
              {editingAgent && (
                <button type="button" onClick={cancelEdit} style={{ backgroundColor: '#64748B', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '1rem', color: '#64748B', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
              <th style={{ padding: '1rem', color: '#64748B', fontWeight: 600, fontSize: '0.875rem' }}>Email</th>
              <th style={{ padding: '1rem', color: '#64748B', fontWeight: 600, fontSize: '0.875rem' }}>Phone</th>
              <th style={{ padding: '1rem', color: '#64748B', fontWeight: 600, fontSize: '0.875rem' }}>Vehicle No</th>
              <th style={{ padding: '1rem', color: '#64748B', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
              <th style={{ padding: '1rem', color: '#64748B', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '1rem', color: '#0F172A', fontWeight: 500 }}>{agent.name}</td>
                <td style={{ padding: '1rem', color: '#64748B' }}>{agent.email || '-'}</td>
                <td style={{ padding: '1rem', color: '#64748B' }}>{agent.phone}</td>
                <td style={{ padding: '1rem', color: '#64748B' }}>{agent.vehicleNo}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: agent.isAvailable ? '#D1FAE5' : '#FEE2E2', color: agent.isAvailable ? '#059669' : '#DC2626' }}>
                    {agent.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditClick(agent)} style={{ padding: '0.5rem', backgroundColor: '#E0F2FE', color: '#0284C7', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(agent.id)} style={{ padding: '0.5rem', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {agents.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No delivery agents found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
