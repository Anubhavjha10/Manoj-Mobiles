import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { RotateCcw } from 'lucide-react';

const statusColors = {
  REQUESTED: { bg: '#FEF3C7', color: '#92400E' },
  APPROVED: { bg: '#D1FAE5', color: '#065F46' },
  PICKED: { bg: '#DBEAFE', color: '#1E40AF' },
  REFUNDED: { bg: '#EDE9FE', color: '#6D28D9' },
  REJECTED: { bg: '#FEE2E2', color: '#991B1B' },
};

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

  useEffect(() => { fetchReturns(); }, []);

  const handleStatusChange = async (returnId, newStatus) => {
    try {
      await adminService.updateReturnStatus(returnId, newStatus);
      showToast(`Return status updated to ${newStatus}`);
      fetchReturns();
    } catch (error) {
      showToast('Failed to update return status');
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><RotateCcw className="title-icon" /> Return Requests</h2>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr><th>Return ID</th><th>Order</th><th>Product</th><th>Reason</th><th>Refund Amt</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="empty-state">Loading returns...</td></tr>
            ) : returns.length === 0 ? (
              <tr><td colSpan="7" className="empty-state">No return requests found.</td></tr>
            ) : (
              returns.map(r => {
                const sc = statusColors[r.status] || statusColors.REQUESTED;
                return (
                  <tr key={r.id}>
                    <td><span className="id-badge">{r.id.substring(0, 8)}</span></td>
                    <td><span className="id-badge">{r.orderNumber || r.orderId?.substring(0, 8)}</span></td>
                    <td style={{ fontWeight: 600 }}>{r.productName || 'N/A'}<br/><span className="text-muted">{r.variantName || ''}</span></td>
                    <td>{r.reason}</td>
                    <td style={{ fontWeight: 600 }}>₹{r.refundAmount || 'N/A'}</td>
                    <td><span className="badge" style={{ backgroundColor: sc.bg, color: sc.color }}>{r.status}</span></td>
                    <td>
                      <select value={r.status} onChange={(e) => handleStatusChange(r.id, e.target.value)} className="form-input" style={{ width: 'auto', minWidth: '130px', padding: '0.4rem 0.6rem' }}>
                        <option value="REQUESTED">Requested</option>
                        <option value="APPROVED">Approved</option>
                        <option value="PICKED">Picked</option>
                        <option value="REFUNDED">Refunded</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
