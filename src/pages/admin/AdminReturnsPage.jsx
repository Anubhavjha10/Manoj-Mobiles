import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';

export const AdminReturnsPage = () => {
  const { showToast } = useStore();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReturns(0, 50);
      setReturns(res?.content || []);
    } catch (error) {
      showToast('Failed to load returns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleStatusChange = async (returnId, newStatus) => {
    try {
      await adminService.updateReturnStatus(returnId, newStatus);
      showToast(`Return status updated to ${newStatus}`);
      fetchReturns(); // refresh
    } catch (error) {
      showToast('Failed to update return status');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '1.5rem' }}>Return Requests</h2>
      
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Return ID</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Order ID</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Reason</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading returns...</td></tr>
            ) : returns.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No returns found.</td></tr>
            ) : (
              returns.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#0F172A', fontWeight: 500 }}>{r.id.substring(0, 8)}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748B' }}>{r.orderId?.substring(0, 8) || 'N/A'}</td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748B' }}>{r.reason}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                      backgroundColor: r.status === 'APPROVED' || r.status === 'COMPLETED' ? '#D1FAE5' : (r.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7'),
                      color: r.status === 'APPROVED' || r.status === 'COMPLETED' ? '#065F46' : (r.status === 'REJECTED' ? '#991B1B' : '#92400E')
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select 
                      value={r.status} 
                      onChange={(e) => handleStatusChange(r.id, e.target.value)}
                      style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                      <option value="REQUESTED">Requested</option>
                      <option value="APPROVED">Approved</option>
                      <option value="PICKED">Picked</option>
                      <option value="REFUNDED">Refunded</option>
                      <option value="REJECTED">Rejected</option>
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
