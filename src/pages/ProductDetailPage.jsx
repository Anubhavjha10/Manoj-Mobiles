import React, { useState } from 'react';
import { ShoppingBag, Heart, ArrowLeft, Share2, ShieldCheck, Truck, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage = () => {
  const { selectedProductId, addToCart, toggleWishlist, wishlist, cart, navigateTo, previousView, formatINR, products } = useStore();
  const p = products.find(item => item.id === selectedProductId || item.id === Number(selectedProductId)) || products[0] || {};
  const related = products.filter(item => item.category === p.category && item.id !== p.id).slice(0, 4);

  const [activeImg, setActiveImg] = useState(p.image);
  const [selectedColor, setSelectedColor] = useState(p.colors ? p.colors[0] : 'Standard');
  const [selectedStorage, setSelectedStorage] = useState(p.storageOptions ? p.storageOptions[0] : 'Standard');

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const isWishlisted = wishlist.includes(p.id);

  const handleBack = () => {
    navigateTo(previousView || 'home');
  };

  return (
    <div className="product-detail-wrapper">
      {/* MOBILE APP-LIKE TOP NAV BAR */}
      <div className="mobile-detail-top-bar">
        <button className="mobile-back-btn" onClick={handleBack}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="mobile-detail-nav-actions">
          <button className={`nav-action-btn ${isWishlisted ? 'active' : ''}`} onClick={() => toggleWishlist(p.id)}>
            <Heart size={20} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'currentColor'} />
          </button>
          <button className="nav-action-btn" onClick={() => navigateTo('cart')}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className="container">
        <div className="detail-layout">
          {/* Gallery */}
          <div className="detail-gallery-container">
            <div className="gallery-main-wrapper">
              <img src={activeImg} className="gallery-main-img" alt={p.name} />
              {p.discount && <span className="badge badge-discount-floating">{p.discount}</span>}
            </div>
            
            <div className="gallery-thumbs">
              {(p.thumbnails || [p.image]).map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  className={`thumb-img ${activeImg === img ? 'active' : ''}`}
                  onClick={() => setActiveImg(img)} 
                  alt={`${p.name} thumbnail ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="badge badge-blue" style={{ width: 'fit-content', marginBottom: '0.5rem' }}>{p.brand} Official</span>
            <h1 className="detail-title">{p.name}</h1>

            <div className="card-rating-row" style={{ marginBottom: '1rem' }}>
              <div className="rating-stars">{'★'.repeat(Math.floor(p.rating))}</div>
              <span className="rating-text">{p.rating} ({p.reviewsCount || 1840} customer reviews)</span>
            </div>

            <div className="detail-price-box">
              <div className="price-row-detail">
                <span className="price-current">{formatINR(p.price)}</span>
                <span className="price-original">{formatINR(p.originalPrice)}</span>
                <span className="price-discount-tag">{p.discount}</span>
              </div>
              <p className="emi-info-text">
                💳 EMI starts at {formatINR(Math.round(p.price / 12))}/month. 0% No Cost EMI available.
              </p>
            </div>

            {p.colors && (
              <div className="variant-selector">
                <label className="variant-label">Color Variant: <strong>{selectedColor}</strong></label>
                <div className="variant-options">
                  {p.colors.map(c => (
                    <button 
                      key={c} 
                      className={`variant-btn ${selectedColor === c ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {p.storageOptions && (
              <div className="variant-selector">
                <label className="variant-label">Storage Capacity: <strong>{selectedStorage}</strong></label>
                <div className="variant-options">
                  {p.storageOptions.map(s => (
                    <button 
                      key={s} 
                      className={`variant-btn ${selectedStorage === s ? 'active' : ''}`}
                      onClick={() => setSelectedStorage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-action-buttons">
              <button className="btn btn-primary btn-lg detail-add-btn" onClick={() => addToCart(p.id, 1, selectedColor, selectedStorage)}>
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button className="btn btn-outline btn-lg detail-wish-btn" onClick={() => toggleWishlist(p.id)}>
                <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'currentColor'} />
              </button>
            </div>

            <div className="detail-guarantees-box">
              <p>✅ <strong>In Stock:</strong> Ready for immediate dispatch from Dadar Warehouse.</p>
              <p style={{ marginTop: '0.35rem' }}>🚚 Free Express Delivery by tomorrow with live tracking.</p>
              <p style={{ marginTop: '0.35rem' }}>🛡️ 100% Original Brand Guarantee with 1 Year Official Warranty.</p>
            </div>
          </div>
        </div>

        {/* Technical Specs Tab Table */}
        <div className="detail-tabs-wrapper">
          <div className="tab-nav">
            <button className="tab-btn active">Technical Specifications</button>
          </div>
          <table className="spec-table">
            <tbody>
              <tr><td>Brand</td><td>{p.brand}</td></tr>
              <tr><td>Model</td><td>{p.name}</td></tr>
              <tr><td>Screen Display</td><td>{p.screenSize || '6.7-inch Super Retina XDR'}</td></tr>
              <tr><td>Processor</td><td>{p.processor || 'A17 Pro Chip / Snapdragon 8 Gen 3'}</td></tr>
              <tr><td>Camera System</td><td>{p.camera || '48MP Main + 12MP Telephoto + 12MP Ultra Wide'}</td></tr>
              <tr><td>Battery</td><td>{p.battery || '4422 mAh with 25W Fast Charge'}</td></tr>
              <tr><td>Warranty</td><td>1 Year Brand Warranty in India</td></tr>
            </tbody>
          </table>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="deals-section" style={{ paddingTop: 0, marginTop: '2rem' }}>
            <h2 className="section-title" style={{ marginBottom: '1rem', fontSize: '1.15rem' }}>Related Products You Might Like</h2>
            <div className="products-grid">
              {related.map(rel => <ProductCard key={rel.id} product={rel} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
