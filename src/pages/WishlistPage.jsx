import React from 'react';
import { HeartOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS_DATA } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage = () => {
  const { wishlist, navigateTo } = useStore();
  const list = PRODUCTS_DATA.filter(p => wishlist.includes(p.id));

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>My Saved Wishlist ({list.length})</h1>
      {list.length > 0 ? (
        <div className="products-grid">
          {list.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#FFFFFF', borderRadius: 'var(--radius-lg)' }}>
          <HeartOff style={{ width: 48, height: 48, color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Save items you love by tapping the heart icon on product cards.</p>
          <button className="btn btn-primary" onClick={() => navigateTo('products')}>Explore Products</button>
        </div>
      )}
    </div>
  );
};
