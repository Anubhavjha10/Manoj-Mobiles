import React from 'react';
import { useStore } from '../../context/StoreContext';
import { LayoutDashboard, ShoppingCart, Package, Users, RotateCcw, LogOut, Settings, Network, Award, Truck, ChevronRight } from 'lucide-react';
import { authService } from '../../services/authService';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export const AdminLayout = () => {
  const { setAdminUser, adminUser } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.split('/').pop();

  const handleLogout = () => {
    authService.logout();
    setAdminUser({ loggedIn: false, name: '', email: '', role: '' });
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
    { id: 'products', label: 'Products', icon: <Package size={18} /> },
    { id: 'users', label: 'Users', icon: <Users size={18} /> },
    { id: 'returns', label: 'Returns', icon: <RotateCcw size={18} /> },
    { id: 'delivery-agents', label: 'Delivery Agents', icon: <Truck size={18} /> },
    { id: 'categories', label: 'Categories', icon: <Network size={18} /> },
    { id: 'brands', label: 'Brands', icon: <Award size={18} /> },
  ];

  return (
    <div className="admin-layout-wrapper">
      {/* Premium Sidebar */}
      <aside className="premium-sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">
            <span className="brand-icon">M</span>
          </div>
          <div className="brand-text">
            <h2>Manoj Admin</h2>
            <span>Control Panel v2.0</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            {navItems.map(item => {
              const isActive = currentPath === item.id;
              return (
                <li key={item.id}>
                  <button 
                    onClick={() => navigate(`/admin/${item.id}`)}
                    className={`nav-btn ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {isActive && <ChevronRight size={16} className="active-indicator" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* Topbar */}
        <header className="premium-topbar">
          <div className="topbar-left">
            <h3 className="page-title">{currentPath.replace('-', ' ')}</h3>
          </div>
          <div className="topbar-right">
            <div className="admin-profile-badge">
              <div className="profile-info">
                <span className="greeting">Welcome back,</span>
                <span className="name">{adminUser.name || 'System Admin'}</span>
              </div>
              <div className="avatar">
                {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
