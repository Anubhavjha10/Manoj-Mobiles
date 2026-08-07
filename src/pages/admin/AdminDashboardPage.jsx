import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Users, ShoppingBag, IndianRupee, Package, TrendingUp, ArrowUpRight } from 'lucide-react';

export const AdminDashboardPage = () => {
  const { formatINR } = useStore();
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, totalUsers: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const results = await Promise.allSettled([
          adminService.getOrders(0, 1),
          fetch('/api/public/products?size=1').then(res => res.json()),
          adminService.getUsers(0, 1)
        ]);
        const ordersRes = results[0].status === 'fulfilled' ? results[0].value : null;
        const productsRes = results[1].status === 'fulfilled' ? results[1].value : null;
        const usersRes = results[2].status === 'fulfilled' ? results[2].value : null;
        setStats({
          totalOrders: ordersRes?.totalElements || ordersRes?.data?.totalElements || 0,
          totalProducts: productsRes?.data?.totalElements || productsRes?.totalElements || 0,
          totalUsers: usersRes?.totalElements || usersRes?.data?.totalElements || 0,
          revenue: (ordersRes?.totalElements || 0) * 12500
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: formatINR(stats.revenue), icon: <IndianRupee size={22} />, color: '#10B981', bg: '#ECFDF5' },
    { title: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={22} />, color: '#3B82F6', bg: '#EFF6FF' },
    { title: 'Active Products', value: stats.totalProducts, icon: <Package size={22} />, color: '#F59E0B', bg: '#FFFBEB' },
    { title: 'Registered Users', value: stats.totalUsers, icon: <Users size={22} />, color: '#8B5CF6', bg: '#F5F3FF' },
  ];

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h2 className="admin-page-title"><TrendingUp className="title-icon" /> Dashboard Overview</h2>
      </div>
      
      <div className="admin-stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className="admin-stat-card">
            <div className="stat-icon-wrap" style={{ backgroundColor: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <span className="stat-label">{card.title}</span>
              <h3 className="stat-value">{card.value}</h3>
            </div>
            <ArrowUpRight size={18} className="stat-arrow" style={{ color: card.color }} />
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginTop: '2rem' }}>
        <h3 className="form-title">Recent Activity</h3>
        <p className="text-muted">Advanced analytics, charts, and real-time feed will appear here in future updates.</p>
      </div>
    </div>
  );
};
