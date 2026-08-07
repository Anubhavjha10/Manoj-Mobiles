import React, { useState } from 'react';
import { Home, LayoutGrid, ShoppingBag, Heart, Menu, MapPin, Package, UserCheck, PackageCheck, LogOut, X, PhoneCall, ChevronRight, Sparkles, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BottomNav = () => {
  const { activeView, navigateTo, cart, wishlist, user, setUser } = useStore();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Categories', icon: LayoutGrid },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
    { id: 'menu', label: 'Menu', icon: Menu }
  ];

  const handleNavClick = (id) => {
    if (id === 'menu') {
      setMobileDrawerOpen(true);
    } else {
      setMobileDrawerOpen(false);
      navigateTo(id);
    }
  };

  const handleLogout = () => {
    setUser(u => ({ ...u, loggedIn: false }));
    setMobileDrawerOpen(false);
    navigateTo('home');
  };

  return (
    <>
      {/* FIXED MOBILE BOTTOM WRAPPER WITH FREE DELIVERY STRIP & BOTTOM NAV */}
      <div className="mobile-bottom-fixed-wrapper">
        <div className="mobile-delivery-strip">
          <Truck size={14} className="delivery-icon" />
          <span>Free Delivery on all orders</span>
        </div>

        <nav className="mobile-bottom-nav">
          <div className="bottom-nav-container">
            {items.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id || (item.id === 'products' && activeView === 'product-detail');

              return (
                <button
                  key={item.id}
                  className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <div className="bottom-nav-icon-wrapper">
                    <Icon size={20} />
                    {item.badge > 0 && <span className="bottom-nav-badge">{item.badge}</span>}
                  </div>
                  <span className="bottom-nav-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* MOBILE HAMBURGER MENU DRAWER */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileDrawerOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-user-info">
                <div className="drawer-avatar">{user.loggedIn ? user.name[0] : 'M'}</div>
                <div>
                  <h4 className="drawer-user-name">{user.loggedIn ? user.name : 'Welcome to Manoj Mobiles'}</h4>
                  <span className="drawer-user-sub">{user.loggedIn ? user.email : 'Explore 1,000+ Tech Deals'}</span>
                </div>
              </div>
              <button className="drawer-close-btn" onClick={() => setMobileDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-menu-list">
              <div className="drawer-item" onClick={() => { setMobileDrawerOpen(false); navigateTo('account'); }}>
                <UserCheck size={18} color="var(--primary)" />
                <span>My Profile</span>
                <ChevronRight size={16} className="drawer-arrow" />
              </div>

              <div className="drawer-item" onClick={() => { setMobileDrawerOpen(false); navigateTo('account'); }}>
                <PackageCheck size={18} color="var(--primary)" />
                <span>My Orders & Purchases</span>
                <ChevronRight size={16} className="drawer-arrow" />
              </div>

              <div className="drawer-item" onClick={() => { setMobileDrawerOpen(false); navigateTo('track-order'); }}>
                <Package size={18} color="var(--primary)" />
                <span>Track Live Order</span>
                <ChevronRight size={16} className="drawer-arrow" />
              </div>

              <div className="drawer-item" onClick={() => { setMobileDrawerOpen(false); navigateTo('store-locator'); }}>
                <MapPin size={18} color="var(--primary)" />
                <span>50+ Nearby Physical Stores</span>
                <ChevronRight size={16} className="drawer-arrow" />
              </div>

              <div className="drawer-item" onClick={() => { setMobileDrawerOpen(false); navigateTo('products', { category: 'Apple' }); }}>
                <Sparkles size={18} color="#0056D2" />
                <span>Apple Authorised Store Zone</span>
                <ChevronRight size={16} className="drawer-arrow" />
              </div>

              <div className="drawer-item" onClick={() => { setMobileDrawerOpen(false); navigateTo('account'); }}>
                <PhoneCall size={18} color="var(--primary)" />
                <span>24x7 Customer Support</span>
                <ChevronRight size={16} className="drawer-arrow" />
              </div>

              {user.loggedIn && (
                <div className="drawer-item logout-item" onClick={handleLogout}>
                  <LogOut size={18} color="#EF4444" />
                  <span style={{ color: '#EF4444' }}>Logout Account</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
