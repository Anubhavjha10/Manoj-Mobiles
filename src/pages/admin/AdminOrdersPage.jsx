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

  return (
    <div>
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
