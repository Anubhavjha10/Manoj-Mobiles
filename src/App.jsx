import React from 'react';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { Toast } from './components/Toast';
import { BottomNav } from './components/BottomNav';

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

export const App = () => {
  const { activeView, adminUser } = useStore();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductListingPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'track-order':
        return <TrackOrderPage />;
      case 'store-locator':
        return <StoreLocatorPage />;
      case 'account':
        return <AccountPage />;
      default:
        return <HomePage />;
    }
  };

  const renderAdminView = () => {
    // If not logged in, force login page regardless of activeView
    if (!adminUser?.loggedIn && activeView !== 'admin-login') {
      window.history.replaceState({}, '', '/admin/login');
      return <AdminLoginPage />;
    }
    
    switch (activeView) {
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'admin-orders':
        return <AdminOrdersPage />;
      case 'admin-products':
        return <AdminProductsPage />;
      case 'admin-users':
        return <AdminUsersPage />;
      case 'admin-returns':
        return <AdminReturnsPage />;
      case 'admin-delivery-agents':
        return <AdminDeliveryAgentsPage />;
      case 'admin-catalog':
        return <AdminCatalogPage />;
      default:
        return <AdminDashboardPage />;
    }
  };

  const isAdminRoute = activeView.startsWith('admin');

  return (
    <div className="app-root">
      {isAdminRoute ? (
        (!adminUser?.loggedIn || activeView === 'admin-login') ? (
          <>
            <AdminLoginPage />
            <Toast />
          </>
        ) : (
          <AdminLayout currentPath={activeView.replace('admin-', '')}>
            {renderAdminView()}
            <Toast />
          </AdminLayout>
        )
      ) : (
        <>
          <Navbar />
          <main id="app-content">
            {renderCurrentView()}
          </main>
          <Footer />
          <VideoModal />
          <Toast />
          <BottomNav />
        </>
      )}
    </div>
  );
};

export default App;
