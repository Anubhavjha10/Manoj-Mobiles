import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { useStore } from '../../context/StoreContext';
import { Users, ShoppingBag, DollarSign, Package } from 'lucide-react';

export const AdminDashboardPage = () => {
  const { formatINR } = useStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenue: 0
  });

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

        const totalOrders = ordersRes?.totalElements || ordersRes?.data?.totalElements || 0;
        const totalProducts = productsRes?.data?.totalElements || productsRes?.totalElements || 0;
        const totalUsers = usersRes?.totalElements || usersRes?.data?.totalElements || 0;

        setStats({
          totalOrders,
          totalProducts,
          totalUsers,
          revenue: totalOrders * 12500 // Mock revenue for demo
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Revenue', value: formatINR(stats.revenue), icon: <DollarSign size={24} color="#10B981" />, bg: '#D1FAE5' },
    { title: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} color="#3B82F6" />, bg: '#DBEAFE' },
    { title: 'Active Products', value: stats.totalProducts, icon: <Package size={24} color="#F59E0B" />, bg: '#FEF3C7' },
    { title: 'Registered Users', value: stats.totalUsers, icon: <Users size={24} color="#8B5CF6" />, bg: '#EDE9FE' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', marginBottom: '1.5rem' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {card.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B', fontWeight: 600 }}>{card.title}</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>Recent Activity</h3>
        <p style={{ color: '#64748B' }}>More advanced analytics and charts will appear here.</p>
      </div>
    </div>
  );
};
