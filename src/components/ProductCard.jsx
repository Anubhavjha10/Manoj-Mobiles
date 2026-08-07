import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';

export const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart, navigateTo, formatINR } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <motion.div 
      className="product-card"
      whileHover={{ y: -4, boxShadow: "var(--shadow-hover)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="card-image-wrapper">
        {product.badge && <span className="badge badge-solid card-badge-top">{product.badge}</span>}
        <button 
          className={`wishlist-btn-overlay ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
        >
          <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : 'currentColor'} />
        </button>
        <img 
          src={product.image} 
          alt={product.name} 
          className="card-img" 
          onClick={() => navigateTo('product-detail', { productId: product.id })}
        />
      </div>
      <div className="card-body">
        <span className="card-brand">{product.brand}</span>
        <h3 
          className="card-title"
          onClick={() => navigateTo('product-detail', { productId: product.id })}
        >
          {product.name}
        </h3>
        <div className="card-rating-row">
          <div className="rating-stars" style={{ color: '#F59E0B' }}>
            {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="rating-text">{product.rating} ({product.reviewsCount})</span>
        </div>
        <div className="card-price-row">
          <span className="price-current">{formatINR(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="price-original">{formatINR(product.originalPrice)}</span>
          )}
          {product.discount && <span className="price-discount-tag">{product.discount}</span>}
        </div>
        <div className="card-actions">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-sm" 
            style={{ width: '100%', display: 'flex', gap: '0.4rem', justifyContent: 'center' }}
            onClick={() => addToCart(product.id)}
          >
            <ShoppingBag size={16} /> Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
