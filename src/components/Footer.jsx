import React from 'react';
import { Smartphone, Instagram, Youtube, Facebook } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer = () => {
  const { navigateTo, navigateAdminTo, categories } = useStore();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1 */}
          <div>
            <div className="footer-brand-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Smartphone size={28} strokeWidth={2.5} color="#38bdf8" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.5px', lineHeight: '1.1' }}>
                  <span style={{ color: '#FFFFFF' }}>MANOJ</span>
                  <span style={{ color: '#38bdf8' }}>MOBILES</span>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', marginTop: '0.15rem' }}>AUTHORIZED TECH RETAILER</span>
              </div>
            </div>
            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
              India's trusted retail brand for genuine smartphones, Apple ecosystem products, audio accessories & fast chargers with nationwide store presence.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="#" style={{ background: 'rgba(255,255,255,0.1)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}><Instagram size={18} /></a>
              <a href="#" style={{ background: 'rgba(255,255,255,0.1)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}><Youtube size={18} /></a>
              <a href="#" style={{ background: 'rgba(255,255,255,0.1)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}><Facebook size={18} /></a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <div className="footer-links-list">
              <a onClick={() => navigateTo('store-locator')}>Store Locator</a>
              <a onClick={() => navigateTo('track-order')}>Track Your Order</a>
              <a onClick={() => navigateTo('wishlist')}>Saved Wishlist</a>
              <a onClick={() => navigateTo('cart')}>Shopping Cart</a>
              <a onClick={() => navigateTo('account')}>My Account</a>
              <a onClick={() => navigateAdminTo('login')} style={{ color: '#38BDF8', fontWeight: 600 }}>Staff / Admin Login</a>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="footer-col-title">Categories</h4>
            <div className="footer-links-list">
              {categories && categories.length > 0 ? (
                categories.slice(0, 5).map(c => (
                  <a key={c.id} onClick={() => navigateTo('products', { category: c.name })}>{c.name}</a>
                ))
              ) : (
                <>
                  <a onClick={() => navigateTo('products', { category: 'Mobiles' })}>5G Smartphones</a>
                  <a onClick={() => navigateTo('products', { category: 'Apple' })}>Apple iPhones & iPads</a>
                </>
              )}
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="footer-col-title">Customer Care</h4>
            <div className="footer-links-list">
              <a href="#">Warranty Claim</a>
              <a href="#">Return & Exchange</a>
              <a href="#">Shipping Policies</a>
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>

          {/* Col 5 */}
          <div>
            <h4 className="footer-col-title">Store Network</h4>
            <p style={{ fontSize: '0.82rem', marginBottom: '0.75rem' }}>Over 50+ Retail Branches in Mumbai, Pune, Thane, Navi Mumbai, Delhi & Bengaluru.</p>
            <div className="payment-icons-row">
              <span className="payment-chip">UPI</span>
              <span className="payment-chip">VISA</span>
              <span className="payment-chip">MasterCard</span>
              <span className="payment-chip">No Cost EMI</span>
              <span className="payment-chip">COD</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>Copyright © 2026 Manoj Mobiles Pvt. Ltd. All Rights Reserved.</div>
          <div>Designed for Premium Indian Retail Experience</div>
        </div>
      </div>
    </footer>
  );
};
