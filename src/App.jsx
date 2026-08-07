import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { Toast } from './components/Toast';
import { BottomNav } from './components/BottomNav';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader } from './components/Loader';

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const ProductListingPage = lazy(() => import('./pages/ProductListingPage').then(module => ({ default: module.ProductListingPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(module => ({ default: module.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(module => ({ default: module.CartPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(module => ({ default: module.WishlistPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage').then(module => ({ default: module.OrderConfirmationPage })));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage').then(module => ({ default: module.TrackOrderPage })));
const StoreLocatorPage = lazy(() => import('./pages/StoreLocatorPage').then(module => ({ default: module.StoreLocatorPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(module => ({ default: module.AccountPage })));

const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(module => ({ default: module.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(module => ({ default: module.AdminDashboardPage })));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage').then(module => ({ default: module.AdminOrdersPage })));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage').then(module => ({ default: module.AdminProductsPage })));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage').then(module => ({ default: module.AdminUsersPage })));
const AdminReturnsPage = lazy(() => import('./pages/admin/AdminReturnsPage').then(module => ({ default: module.AdminReturnsPage })));
const AdminDeliveryAgentsPage = lazy(() => import('./pages/admin/AdminDeliveryAgentsPage').then(module => ({ default: module.AdminDeliveryAgentsPage })));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage').then(module => ({ default: module.AdminCategoriesPage })));
const AdminBrandsPage = lazy(() => import('./pages/admin/AdminBrandsPage').then(module => ({ default: module.AdminBrandsPage })));

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
      <Suspense fallback={<Loader />}>
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
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="brands" element={<AdminBrandsPage />} />
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
        </Routes>
      </Suspense>
      <Toast />
    </div>
  );
};

export default App;
