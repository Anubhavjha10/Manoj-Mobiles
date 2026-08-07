import React from 'react';
import { useStore } from '../../context/StoreContext';
import { LayoutDashboard, ShoppingCart, Package, Users, RotateCcw, LogOut, Settings } from 'lucide-react';
import { authService } from '../../services/authService';

export const AdminLayout = ({ children, currentPath }) => {
  const { navigateAdminTo, setAdminUser, adminUser, navigateTo } = useStore();

  const handleLogout = () => {
    authService.logout();
    setAdminUser({ loggedIn: false, name: '', email: '', role: '' });
    navigateTo('home');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
    { id: 'products', label: 'Products', icon: <Package size={18} /> },
    { id: 'users', label: 'Users', icon: <Users size={18} /> },
    { id: 'returns', label: 'Returns', icon: <RotateCcw size={18} /> },
  ];

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: '260px', backgroundColor: '#1E293B', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#38BDF8' }}>Manoj Admin</h2>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Control Panel v1.0</span>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => navigateAdminTo(item.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.85rem 1.5rem', backgroundColor: currentPath === item.id ? '#334155' : 'transparent',
                    color: currentPath === item.id ? '#38BDF8' : '#CBD5E1', border: 'none', cursor: 'pointer',
                    textAlign: 'left', fontWeight: currentPath === item.id ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid #334155' }}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem', backgroundColor: 'transparent', color: '#EF4444',
              border: '1px solid #EF4444', borderRadius: '0.375rem', cursor: 'pointer',
              justifyContent: 'center', fontWeight: 600
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{ height: '64px', backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0F172A', textTransform: 'capitalize' }}>
            {currentPath}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Welcome, <strong>{adminUser.name || 'Admin'}</strong></span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369A1', fontWeight: 700 }}>
              {adminUser.name ? adminUser.name.charAt(0) : 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};
