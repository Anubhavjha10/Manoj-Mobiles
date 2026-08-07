import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart, navigateTo, formatINR } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        {product.badge && <span className="badge badge-solid card-badge-top">{product.badge}</span>}
        <button 
          className={`wishlist-btn-overlay ${isWishlisted ? 'active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
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
          <div className="rating-stars">
            {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="rating-text">{product.rating} ({product.reviewsCount})</span>
        </div>
        <div className="card-price-row">
          <span className="price-current">{formatINR(product.price)}</span>
          <span className="price-original">{formatINR(product.originalPrice)}</span>
          <span className="price-discount-tag">{product.discount}</span>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary btn-sm" onClick={() => addToCart(product.id)}>
            <ShoppingBag size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
