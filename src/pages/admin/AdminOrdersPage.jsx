import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';

export const AdminOrdersPage = () => {
  const { formatINR, showToast } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [agents, setAgents] = useState([]);

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
    } catch (error) {
      console.error('Failed to load agents');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAgents();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus, "Status updated by admin");
      showToast(`Order status updated to ${newStatus}`);
      fetchOrders(); // refresh
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

  const [trackingOrder, setTrackingOrder] = useState(null);

  const handleTrack = (order) => {
    setTrackingOrder(order);
  };

  return (
    <div style={{ position: 'relative' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '1.5rem' }}>Order Management</h2>
      
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Order ID</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Date</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Total</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No orders found.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#0F172A', fontWeight: 500 }}>{order.orderNumber || order.id.substring(0, 8)}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748B' }}>{new Date(order.placedAt || order.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#0F172A', fontWeight: 600 }}>{formatINR(order.totalAmount)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                      backgroundColor: order.status === 'DELIVERED' ? '#D1FAE5' : (order.status === 'CANCELLED' ? '#FEE2E2' : '#FEF3C7'),
                      color: order.status === 'DELIVERED' ? '#065F46' : (order.status === 'CANCELLED' ? '#991B1B' : '#92400E')
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                      <option value="PLACED">Placed</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PACKED">Packed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="RETURNED">Returned</option>
                    </select>

                    <select
                      value={order.deliveryAgentId || ''}
                      onChange={(e) => handleAssignAgent(order.id, e.target.value)}
                      style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                      <option value="">Assign Agent...</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                      ))}
                    </select>
                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <button 
                        onClick={() => handleTrack(order)}
                        style={{ padding: '0.4rem', borderRadius: '0.25rem', border: 'none', backgroundColor: '#3B82F6', color: 'white', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Track Location
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {trackingOrder && (
        <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
      )}
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
        if(res) setLocation(res);
      } catch (err) {
        console.error("Failed to fetch location", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoc();
    interval = setInterval(fetchLoc, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [order.id]);

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
      <div className="modal-content" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Live Tracking: {order.orderNumber || order.id.substring(0,8)}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
        
        {loading ? (
          <p>Connecting to agent GPS...</p>
        ) : location ? (
          <div>
            <div style={{ backgroundColor: '#F1F5F9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#334155' }}>Agent Current Location</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Latitude</span>
                  <strong style={{ color: '#0F172A' }}>{location.lat}</strong>
                </div>
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Longitude</span>
                  <strong style={{ color: '#0F172A' }}>{location.lng}</strong>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748B', textAlign: 'center' }}>
              Last updated: {new Date(location.recordedAt).toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FEF2F2', color: '#991B1B', borderRadius: '8px' }}>
            Location data not available for this agent yet.
          </div>
        )}
      </div>
    </div>
  );
};
