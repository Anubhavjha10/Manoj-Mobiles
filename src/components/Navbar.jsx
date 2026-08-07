import React, { useState, useMemo, useDeferredValue } from 'react';
import { Smartphone, Search, MapPin, Package, Heart, ShoppingBag, User, Layers, Apple, Watch, Headphones, Zap, Shield, Flame, PhoneCall, Truck, ArrowRight, Menu, LogOut, UserCheck, PackageCheck, ChevronDown, Tag, Sparkles, RefreshCw, Store } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import './Navbar.css';
import logoImg from '../assets/logo.png';

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
      {/* Top Utility Bar */}
      <div className="top-utility-bar">
        <div className="container top-utility-content">
          <div className="top-utility-left">
            <div className="top-utility-item">
              <PhoneCall size={14} />
              <span>Helpdesk: <strong>1800-266-6666</strong></span>
            </div>
            <div className="top-utility-item hidden-mobile">
              <Truck size={14} />
              <span>Free Express Delivery across India</span>
            </div>
          </div>
          <div className="top-utility-right">
            <a className="top-utility-item" onClick={() => navigateTo('store-locator')}>
              <MapPin size={14} /> <span>Stores</span>
            </a>
            <a className="top-utility-item" onClick={() => navigateTo('track-order')}>
              <Package size={14} /> <span>Track Order</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navbar */}
      <header className="main-header glass-navbar">
        <div className="container navbar-container">
          
          {/* Logo */}
          <div className="premium-brand-wrapper" onClick={() => navigateTo('home')}>
            <div className="brand-icon-modern">
              <Smartphone size={28} strokeWidth={2.5} color="var(--primary)" />
            </div>
            <div className="brand-text-modern">
              <span className="brand-text-primary">MANOJ</span>
              <span className="brand-text-secondary">MOBILES</span>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="nav-search-wrapper desktop-search">
            <form className="premium-search-form" onSubmit={handleSearchSubmit}>
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                className="premium-search-input" 
                placeholder="Search iPhones, Samsung, AirPods..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAutosuggest(true);
                }}
                onFocus={() => setShowAutosuggest(true)}
              />
              <button type="submit" className="premium-search-btn">
                <ArrowRight size={16} />
              </button>
            </form>
            
            {showAutosuggest && suggestions.length > 0 && (
              <div className="premium-autosuggest-dropdown">
                {suggestions.map(item => (
                  <div 
                    key={item.id} 
                    className="premium-suggestion-item"
                    onClick={() => {
                      navigateTo('product-detail', { productId: item.id });
                      setShowAutosuggest(false);
                    }}
                  >
                    <img src={item.image} alt={item.name} />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{item.name}</span>
                      <span className="suggestion-price">{formatINR(item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Nav Actions */}
          <div className="nav-icon-group">
            <button className="nav-icon-btn hidden-mobile" onClick={() => navigateTo('wishlist')}>
              <div className="icon-badge-wrapper">
                <Heart size={22} />
                {wishlist.length > 0 && <span className="premium-badge">{wishlist.length}</span>}
              </div>
              <span className="nav-icon-label hidden-mobile">Wishlist</span>
            </button>

            <button className="nav-icon-btn" onClick={() => navigateTo('cart')}>
              <div className="icon-badge-wrapper">
                <ShoppingBag size={22} />
                {cartCount > 0 && <span className="premium-badge">{cartCount}</span>}
              </div>
              <span className="nav-icon-label hidden-mobile">Cart</span>
            </button>

            <div className="account-dropdown-container">
              <button className="nav-icon-btn" onClick={() => navigateTo('account')}>
                <User size={22} />
                <span className="nav-icon-label hidden-mobile">{user.loggedIn ? 'Account' : 'Sign In'}</span>
              </button>
              
              <div className="premium-account-menu">
                <div className="menu-header">
                  <div className="menu-name">{user.loggedIn ? user.name : 'Welcome'}</div>
                  <div className="menu-sub">{user.loggedIn ? user.email : 'Sign in to access your account'}</div>
                </div>
                <div className="menu-options">
                  <div className="menu-item" onClick={() => navigateTo('account')}><UserCheck size={16}/> Profile</div>
                  <div className="menu-item" onClick={() => navigateTo('account')}><PackageCheck size={16}/> Orders</div>
                  {user.loggedIn && (
                    <div className="menu-item text-danger" onClick={handleLogout}><LogOut size={16}/> Logout</div>
                  )}
                </div>
              </div>
            </div>

            <button className="nav-icon-btn mobile-menu-toggle mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search & Menu Expandable Area */}
      <div className={`mobile-nav-expandable ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="container">
          <form className="premium-search-form mobile-search" onSubmit={handleSearchSubmit}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="premium-search-input" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAutosuggest(true);
              }}
              onFocus={() => setShowAutosuggest(true)}
            />
          </form>
          {showAutosuggest && suggestions.length > 0 && (
            <div className="premium-autosuggest-dropdown mobile-suggestions">
              {suggestions.map(item => (
                <div 
                  key={item.id} 
                  className="premium-suggestion-item"
                  onClick={() => {
                    navigateTo('product-detail', { productId: item.id });
                    setShowAutosuggest(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  <img src={item.image} alt={item.name} />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{item.name}</span>
                    <span className="suggestion-price">{formatINR(item.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mobile-links">
            <a onClick={() => { navigateTo('store-locator'); setMobileMenuOpen(false); }}><MapPin size={16}/> Stores</a>
            <a onClick={() => { navigateTo('track-order'); setMobileMenuOpen(false); }}><Package size={16}/> Track Order</a>
            <a onClick={() => { navigateTo('wishlist'); setMobileMenuOpen(false); }}><Heart size={16}/> Wishlist ({wishlist.length})</a>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <nav className="categories-bar">
        <div className="container cat-scroll-container">
          <ul className="cat-list">
            <li className="cat-item" onClick={() => navigateTo('products', { category: 'All' })}>
              <Layers size={14} /> All Categories
            </li>
            {categories.slice(0, 6).map((c, idx) => {
              let Icon = Layers;
              if (c.name.includes('Mobile')) Icon = Smartphone;
              if (c.name.includes('Apple')) Icon = Apple;
              if (c.name.includes('Wearable')) Icon = Watch;
              if (c.name.includes('Audio')) Icon = Headphones;
              
              return (
                <li key={c.id || idx} className="cat-item" onClick={() => navigateTo('products', { category: c.name })}>
                  <Icon size={14} /> {c.name}
                </li>
              );
            })}
            <li className="cat-item highlight-deals" onClick={() => navigateTo('home')}>
              <Flame size={14} /> Super Deals 🔥
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};
