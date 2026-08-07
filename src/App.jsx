import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { Toast } from './components/Toast';
import { BottomNav } from './components/BottomNav';
import { AnimatePresence, motion } from 'framer-motion';

import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { StoreLocatorPage } from './pages/StoreLocatorPage';
import { AccountPage } from './pages/AccountPage';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReturnsPage } from './pages/admin/AdminReturnsPage';
import { AdminDeliveryAgentsPage } from './pages/admin/AdminDeliveryAgentsPage';
import { AdminCatalogPage } from './pages/admin/AdminCatalogPage';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const AdminProtectedRoute = ({ children }) => {
  const { adminUser } = useStore();
  if (!adminUser?.loggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App = () => {
  const location = useLocation();

  return (
    <div className="app-root">
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="returns" element={<AdminReturnsPage />} />
          <Route path="delivery-agents" element={<AdminDeliveryAgentsPage />} />
          <Route path="catalog" element={<AdminCatalogPage />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main id="app-content">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route index element={<PageTransition><HomePage /></PageTransition>} />
                  <Route path="products" element={<PageTransition><ProductListingPage /></PageTransition>} />
                  <Route path="product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
                  <Route path="cart" element={<PageTransition><CartPage /></PageTransition>} />
                  <Route path="wishlist" element={<PageTransition><WishlistPage /></PageTransition>} />
                  <Route path="checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
                  <Route path="order-confirmation" element={<PageTransition><OrderConfirmationPage /></PageTransition>} />
                  <Route path="track-order" element={<PageTransition><TrackOrderPage /></PageTransition>} />
                  <Route path="store-locator" element={<PageTransition><StoreLocatorPage /></PageTransition>} />
                  <Route path="account" element={<PageTransition><AccountPage /></PageTransition>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
            <VideoModal />
            <BottomNav />
          </>
        } />
        
        {/* Fallback for Customer Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </div>
  );
};

export default App;
