import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Edit, Truck } from 'lucide-react';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useNavigate, Outlet } from 'react-router-dom';

export const AdminDeliveryAgentsPage = () => {
  const { showToast } = useStore();
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><Truck className="title-icon" /> Delivery Agents</h2>
        <button className="btn btn-primary" onClick={() => navigate('/admin/delivery-agents/add')}>
          <Plus size={18} /> Add Agent
        </button>
      </div>

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
                      <button className="icon-btn edit-btn" onClick={() => navigate(`/admin/delivery-agents/edit/${agent.id}`)}><Edit size={16} /></button>
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
      
      {/* Nested Route Modal will render here */}
      <Outlet />
    </div>
  );
};
