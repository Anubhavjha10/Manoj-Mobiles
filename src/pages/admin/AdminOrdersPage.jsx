import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, MapPin } from 'lucide-react';

const statusColors = {
  PLACED: { bg: '#F1F5F9', color: '#475569' },
  CONFIRMED: { bg: '#DBEAFE', color: '#1E40AF' },
  PACKED: { bg: '#FEF3C7', color: '#92400E' },
  SHIPPED: { bg: '#E0F2FE', color: '#0369A1' },
  OUT_FOR_DELIVERY: { bg: '#FEF9C3', color: '#854D0E' },
  DELIVERED: { bg: '#D1FAE5', color: '#065F46' },
  CANCELLED: { bg: '#FEE2E2', color: '#991B1B' },
  RETURNED: { bg: '#EDE9FE', color: '#6D28D9' },
};

export const AdminOrdersPage = () => {
  const { formatINR, showToast } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders(0, 50);
      setOrders(res?.content || []);
    } catch (error) {
      showToast('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await adminService.getDeliveryAgents(0, 100);
      setAgents(res?.content || []);
    } catch (error) { /* silent */ }
  };

  useEffect(() => { fetchOrders(); fetchAgents(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus, "Status updated by admin");
      showToast(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      showToast('Failed to update status');
    }
  };

  const handleAssignAgent = async (orderId, agentId) => {
    if (!agentId) return;
    try {
      await adminService.assignAgentToOrder(orderId, agentId);
      showToast('Agent assigned successfully');
      fetchOrders();
    } catch (error) {
      showToast('Failed to assign agent');
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><ShoppingBag className="title-icon" /> Order Management</h2>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>Order</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th>Update Status</th><th>Assign Agent</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="empty-state">Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="7" className="empty-state">No orders found.</td></tr>
            ) : (
              orders.map(order => {
                const sc = statusColors[order.orderStatus || order.status] || statusColors.PLACED;
                return (
                  <tr key={order.id}>
                    <td><span className="id-badge">{order.orderNumber || order.id.substring(0, 8)}</span></td>
                    <td>{new Date(order.placedAt || order.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 700 }}>{formatINR(order.totalAmount)}</td>
                    <td><span className="badge badge-outline">{order.paymentMethod || 'COD'}</span></td>
                    <td><span className="badge" style={{ backgroundColor: sc.bg, color: sc.color }}>{order.orderStatus || order.status}</span></td>
                    <td>
                      <select value={order.orderStatus || order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="form-input" style={{ width: 'auto', minWidth: '140px', padding: '0.4rem 0.6rem' }}>
                        {Object.keys(statusColors).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <select value={order.deliveryAgentId || ''} onChange={(e) => handleAssignAgent(order.id, e.target.value)} className="form-input" style={{ width: 'auto', minWidth: '140px', padding: '0.4rem 0.6rem' }}>
                          <option value="">Assign Agent...</option>
                          {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                        </select>
                        {(order.orderStatus === 'OUT_FOR_DELIVERY' || order.status === 'OUT_FOR_DELIVERY') && (
                          <button className="btn btn-primary btn-sm" onClick={() => setTrackingOrder(order)}>
                            <MapPin size={14} /> Track
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {trackingOrder && <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />}
    </div>
  );
};

const TrackingModal = ({ order, onClose }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    const fetchLoc = async () => {
      try {
        const res = await adminService.trackOrderLocation(order.id);
        if (res) setLocation(res);
      } catch (err) { /* silent */ }
      finally { setLoading(false); }
    };
    fetchLoc();
    interval = setInterval(fetchLoc, 10000);
    return () => clearInterval(interval);
  }, [order.id]);

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div className="modal-content" style={{ padding: '2rem', borderRadius: '16px', width: '460px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="form-title" style={{ margin: 0 }}>Live Tracking: {order.orderNumber || order.id.substring(0,8)}</h3>
          <button className="icon-btn" onClick={onClose} style={{ border: 'none' }}>✕</button>
        </div>
        
        {loading ? (
          <p className="text-muted">Connecting to agent GPS...</p>
        ) : location ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📍</div>
            <p style={{ fontWeight: 700, color: '#334155', margin: '0 0 1rem 0' }}>Agent Current Location</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-card" style={{ padding: '1rem' }}><span className="text-muted" style={{ display: 'block', fontSize: '0.72rem' }}>LATITUDE</span><strong>{location.lat}</strong></div>
              <div className="admin-card" style={{ padding: '1rem' }}><span className="text-muted" style={{ display: 'block', fontSize: '0.72rem' }}>LONGITUDE</span><strong>{location.lng}</strong></div>
            </div>
            <p className="text-muted" style={{ marginTop: '1rem' }}>Last updated: {new Date(location.recordedAt).toLocaleTimeString()}</p>
          </div>
        ) : (
          <div className="admin-card" style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#FEF2F2', color: '#991B1B' }}>
            Location data not available for this agent yet.
          </div>
        )}
      </div>
    </div>
  );
};
