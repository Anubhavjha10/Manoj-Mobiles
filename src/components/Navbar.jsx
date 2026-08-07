import React, { useState, useMemo, useDeferredValue } from 'react';
import { Smartphone, Search, MapPin, Package, Heart, ShoppingBag, User, Layers, Apple, Watch, Headphones, Zap, Shield, Flame, PhoneCall, Truck, ArrowRight, Menu, LogOut, UserCheck, PackageCheck, ChevronDown, Tag, Sparkles, RefreshCw, Store } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar = () => {
  const { navigateTo, cart, wishlist, user, setUser, formatINR, products, categories } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutosuggest, setShowAutosuggest] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const deferredQuery = useDeferredValue(searchQuery);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  const suggestions = useMemo(() => {
    if (!deferredQuery || deferredQuery.length < 2) return [];
    const q = deferredQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)).slice(0, 5);
  }, [deferredQuery, products]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('products', { search: searchQuery });
      setShowAutosuggest(false);
    }
  };

  const handleLogout = () => {
    setUser(u => ({ ...u, loggedIn: false }));
    navigateTo('home');
  };

  return (
    <>
      {/* SLIM TOP UTILITY BAR (Desktop Only) */}
      <div className="top-utility-bar">
        <div className="container top-utility-content">
          <div className="top-utility-left">
            <div className="top-utility-item">
              <PhoneCall size={14} />
              <span>Helpdesk: <strong>1800-266-6666</strong> (Toll Free)</span>
            </div>
            <div className="top-utility-item">
              <Truck size={14} />
              <span>Free Express Delivery across India on orders &gt; ₹499</span>
            </div>
          </div>
          <div className="top-utility-right">
            <div className="top-utility-item"><a onClick={() => navigateTo('store-locator')}>📍 Store Locator</a></div>
            <div className="top-utility-item"><a onClick={() => navigateTo('track-order')}>🚚 Track Order</a></div>
            <div className="top-utility-item"><a onClick={() => navigateTo('account')}>💬 Customer Support</a></div>
          </div>
        </div>
      </div>

      {/* MAIN STICKY NAVBAR */}
      <header className="main-header">
        <div className="container navbar-container">
          
          {/* Logo (Desktop & Mobile) */}
          <div className="brand-logo" onClick={() => navigateTo('home')}>
            <div className="brand-icon-box">
              <Smartphone size={24} />
            </div>
            <div className="brand-text-container">
              <span className="brand-name">MANOJ <span>MOBILES</span></span>
              <span className="brand-tagline">EST. 2010 • AUTHORISED TECH RETAILER</span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="search-wrapper desktop-only-search">
            <form className="search-bar" onSubmit={handleSearchSubmit}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search iPhones, Samsung S24, AirPods, Smartwatches..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAutosuggest(true);
                }}
                onFocus={() => setShowAutosuggest(true)}
              />
              <button type="submit" className="search-btn">
                <ArrowRight size={16} />
              </button>
            </form>
            
            {showAutosuggest && suggestions.length > 0 && (
              <div className="autosuggest-dropdown active">
                {suggestions.map(item => (
                  <div 
                    key={item.id} 
                    className="autosuggest-item"
                    onClick={() => {
                      navigateTo('product-detail', { productId: item.id });
                      setShowAutosuggest(false);
                    }}
                  >
                    <img src={item.image} className="autosuggest-img" alt={item.name} />
                    <div className="autosuggest-info">
                      <div className="autosuggest-title">{item.name}</div>
                      <div className="autosuggest-price">{formatINR(item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav Actions (Desktop & Mobile Right Actions) */}
          <div className="nav-actions">
            {/* Desktop Only Buttons */}
            <button className="nav-action-btn desktop-only-action" onClick={() => navigateTo('store-locator')}>
              <MapPin size={20} />
              <span>Stores</span>
            </button>

            <button className="nav-action-btn desktop-only-action" onClick={() => navigateTo('track-order')}>
              <Package size={20} />
              <span>Track</span>
            </button>

            {/* Wishlist Icon (Desktop & Mobile Right) */}
            <button className="nav-action-btn" onClick={() => navigateTo('wishlist')}>
              <Heart size={20} />
              <span className="desktop-only-text">Wishlist</span>
              {wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}
            </button>

            {/* Cart Icon (Desktop & Mobile Right) */}
            <button className="nav-action-btn" onClick={() => navigateTo('cart')}>
              <ShoppingBag size={20} />
              <span className="desktop-only-text">Cart</span>
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </button>

            {/* Account Menu (Desktop Only) */}
            <div className="account-dropdown-wrapper desktop-only-action">
              <button className="nav-action-btn" onClick={() => navigateTo('account')}>
                <User size={20} />
                <span>Account</span>
              </button>
              <div className="account-dropdown-menu">
                <div className="dropdown-user-header">
                  <div className="dropdown-user-name">{user.loggedIn ? user.name : 'Welcome Customer'}</div>
                  <div className="dropdown-user-email">{user.loggedIn ? user.email : 'Sign in for fast checkout'}</div>
                </div>
                <div className="dropdown-menu-item" onClick={() => navigateTo('account')}>
                  <UserCheck size={16} /> My Profile
                </div>
                <div className="dropdown-menu-item" onClick={() => navigateTo('account')}>
                  <PackageCheck size={16} /> My Orders
                </div>
                <div className="dropdown-menu-item" onClick={() => navigateTo('wishlist')}>
                  <Heart size={16} /> Saved Wishlist
                </div>
                {user.loggedIn && (
                  <div className="dropdown-menu-item" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE SUB-HEADER ELEMENTS (Location, Quick Menu, Search Bar) */}
        <div className="mobile-header-sub-elements">
          <div className="container">
            {/* 1. Location Bar */}
            <div className="mobile-location-bar">
              <div className="location-left">
                <MapPin size={16} color="var(--primary)" />
                <span>Your Location: <strong>Mumbai, Maharashtra</strong></span>
              </div>
              <ChevronDown size={16} color="var(--primary)" />
            </div>



            {/* 3. Mobile Full Width Search Bar */}
            <div className="search-wrapper mobile-only-search">
              <form className="search-bar" onSubmit={handleSearchSubmit}>
                <Search size={18} color="var(--text-muted)" />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search iPhones, Samsung, Accessories..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowAutosuggest(true);
                  }}
                  onFocus={() => setShowAutosuggest(true)}
                />
                <button type="submit" className="search-btn">
                  <ArrowRight size={16} />
                </button>
              </form>
              
              {showAutosuggest && suggestions.length > 0 && (
                <div className="autosuggest-dropdown active">
                  {suggestions.map(item => (
                    <div 
                      key={item.id} 
                      className="autosuggest-item"
                      onClick={() => {
                        navigateTo('product-detail', { productId: item.id });
                        setShowAutosuggest(false);
                      }}
                    >
                      <img src={item.image} className="autosuggest-img" alt={item.name} />
                      <div className="autosuggest-info">
                        <div className="autosuggest-title">{item.name}</div>
                        <div className="autosuggest-price">{formatINR(item.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CATEGORIES NAV (Desktop Only) */}
        <nav className="category-nav-bar desktop-only-cat-nav">
          <div className="container">
            <ul className="category-nav-list">
              <li className="category-nav-item" onClick={() => navigateTo('products', { category: 'All' })}>
                <Layers size={16} /> All Categories
              </li>
              {categories.slice(0, 6).map((c, idx) => {
                // Map icons based on category name roughly
                let Icon = Layers;
                if (c.name.includes('Mobile')) Icon = Smartphone;
                if (c.name.includes('Apple')) Icon = Apple;
                if (c.name.includes('Wearable')) Icon = Watch;
                if (c.name.includes('Audio')) Icon = Headphones;
                if (c.name.includes('Charger')) Icon = Zap;
                if (c.name.includes('Accessories')) Icon = Shield;
                
                return (
                  <li key={c.id || idx} className="category-nav-item" onClick={() => navigateTo('products', { category: c.name })}>
                    <Icon size={16} /> {c.name}
                  </li>
                );
              })}
              <li className="category-nav-item deals-nav-item" onClick={() => navigateTo('home')}>
                <Flame size={16} /> Super Deals 🔥
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};
