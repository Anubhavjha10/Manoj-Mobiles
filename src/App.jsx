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

export const App = () => {
  const { activeView } = useStore();

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

  return (
    <div className="app-root">
      <Navbar />
      <main id="app-content">
        {renderCurrentView()}
      </main>
      <Footer />
      <VideoModal />
      <Toast />
      <BottomNav />
    </div>
  );
};

export default App;
