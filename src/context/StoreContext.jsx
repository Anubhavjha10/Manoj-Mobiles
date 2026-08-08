import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../services/productService';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProductId, setSelectedProductId] = useState('m1');
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    brand: 'All',
    maxPrice: 200000,
    sort: 'popularity'
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const loadData = async () => {
    setLoadingProducts(true);
    try {
      const [prodData, catData, brandData] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
        productService.getBrands()
      ]);
      setProducts(Array.isArray(prodData) ? prodData : prodData.content || []);
      setCategories(Array.isArray(catData) ? catData : catData.content || []);
      setBrands(Array.isArray(brandData) ? brandData : brandData.content || []);
    } catch (error) {
      console.error("Failed to load store data", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('mm_cart');
    return saved ? JSON.parse(saved) : [
      { productId: 'm1', qty: 1, color: 'Natural Titanium', storage: '256GB' },
      { productId: 'ap2', qty: 1, color: 'White', storage: 'Standard' }
    ];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('mm_wishlist');
    return saved ? JSON.parse(saved) : ['m2', 'w1'];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mm_user');
    return saved ? JSON.parse(saved) : {
      loggedIn: false,
      name: 'Anubhab Sharma',
      email: 'anubhab@manojmobiles.com',
      phone: '+91 98765 43210'
    };
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('mm_admin_user');
    return saved ? JSON.parse(saved) : {
      loggedIn: false,
      name: '',
      email: '',
      role: ''
    };
  });

  const [adminTheme, setAdminTheme] = useState(() => {
    return localStorage.getItem('mm_admin_theme') || 'light';
  });

  const [aiWizard, setAiWizard] = useState({
    step: 1,
    budget: 80000,
    useCase: 'Camera',
    brand: 'All',
    storage: '256GB'
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    localStorage.setItem('mm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('mm_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mm_admin_user', JSON.stringify(adminUser));
  }, [adminUser]);

  useEffect(() => {
    localStorage.setItem('mm_admin_theme', adminTheme);
  }, [adminTheme]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const navigateTo = (view, params = {}) => {
    // Convert old activeView to valid routes
    let route = view === 'home' ? '/' : `/${view}`;
    
    // Map params to URL search params or paths
    let searchParams = new URLSearchParams();
    if (params.productId && view === 'product-detail') {
      route = `/product/${params.productId}`;
    }
    if (params.category) searchParams.append('category', params.category);
    if (params.brand) searchParams.append('brand', params.brand);
    if (params.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    if (queryString) route += `?${queryString}`;

    navigate(route);
  };

  const navigateAdminTo = (adminView) => {
    const path = adminView.replace('admin-', '');
    navigate(`/admin/${path}`);
  };

  const addToCart = (productId, qty = 1, color = null, storage = null) => {
    const product = products.find(p => p.id === productId || p.id === Number(productId));
    if (!product) return;

    const selectedColor = color || (product.colors ? product.colors[0] : 'Standard');
    const selectedStorage = storage || (product.storageOptions ? product.storageOptions[0] : 'Standard');

    setCart(prev => {
      const idx = prev.findIndex(item => item.productId === productId && item.color === selectedColor && item.storage === selectedStorage);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].qty += qty;
        return updated;
      } else {
        return [...prev, { productId, qty, color: selectedColor, storage: selectedStorage }];
      }
    });

    showToast(`Added ${product.name} to Cart! 🛒`);
  };

  const updateCartQty = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index].qty += delta;
      if (updated[index].qty <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart');
  };

  const toggleWishlist = (productId) => {
    const product = products.find(p => p.id === productId || p.id === Number(productId));
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast(`Saved ${product.name} to Wishlist! ❤️`);
        return [...prev, productId];
      }
    });
  };

  const applyCoupon = (code) => {
    if (code.toUpperCase().trim() === 'MANOJ10') {
      setAppliedCoupon('MANOJ10');
      showToast('Applied 10% Discount Coupon! 🎉');
    } else {
      showToast('Invalid Coupon Code. Try "MANOJ10"');
    }
  };

  const formatINR = (price) => '₹' + Number(price).toLocaleString('en-IN');

  return (
    <StoreContext.Provider value={{
      navigateTo, navigateAdminTo,
      activeView: location.pathname, // Mock activeView for legacy components
      previousView: '/',
      selectedProductId, setSelectedProductId,
      filters, setFilters,
      products, setProducts, refreshProducts: loadData, refreshCategories: loadData, refreshBrands: loadData, categories, brands, loadingProducts,
      cart, addToCart, updateCartQty, removeFromCart,
      wishlist, toggleWishlist,
      user, setUser,
      adminUser, setAdminUser,
      adminTheme, setAdminTheme,
      aiWizard, setAiWizard,
      appliedCoupon, applyCoupon,
      toasts, showToast,
      activeVideo, setActiveVideo,
      formatINR
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
