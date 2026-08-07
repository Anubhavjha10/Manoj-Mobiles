import React, { useState } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS_DATA } from '../data/products';

export const CartPage = () => {
  const { cart, updateCartQty, removeFromCart, appliedCoupon, applyCoupon, navigateTo, formatINR } = useStore();
  const [couponInput, setCouponInput] = useState('');

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '3rem', maxWidth: '500px', margin: '0 auto', border: '1px solid var(--border-light)' }}>
          <ShoppingCart style={{ width: 64, height: 64, color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h2>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore top smartphones and tech deals to fill your cart!</p>
          <button className="btn btn-primary" onClick={() => navigateTo('products')}>Start Shopping Now</button>
        </div>
      </div>
    );
  }

  let subtotal = 0;
  cart.forEach(item => {
    const p = PRODUCTS_DATA.find(prod => prod.id === item.productId);
    if (p) subtotal += p.price * item.qty;
  });

  const discount = appliedCoupon ? (subtotal * 0.10) : 0;
  const total = subtotal - discount;

  return (
    <div className="container">
      <h1 className="section-title" style={{ margin: '2rem 0 1rem' }}>Shopping Cart ({cart.length} items)</h1>
      <div className="cart-layout">
        <div className="cart-items-box">
          {cart.map((item, idx) => {
            const p = PRODUCTS_DATA.find(prod => prod.id === item.productId);
            if (!p) return null;
            const itemTotal = p.price * item.qty;

            return (
              <div key={idx} className="cart-item-row">
                <img src={p.image} className="cart-item-img" alt={p.name} />
                
                <div className="cart-item-info">
                  <div className="cart-item-title-row">
                    <h4 className="cart-item-title">{p.name}</h4>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(idx)}>Remove</button>
                  </div>
                  
                  <span className="cart-item-variant">Variant: {item.color} | {item.storage}</span>
                  
                  <div className="cart-item-bottom-row">
                    <div>
                      <div className="cart-item-price">{formatINR(p.price)}</div>
                      {item.qty > 1 && <span className="cart-item-subtotal">Subtotal: {formatINR(itemTotal)}</span>}
                    </div>

                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateCartQty(idx, -1)}>-</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateCartQty(idx, 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="order-summary-box">
          <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Order Summary</h3>
          <div className="summary-row"><span>Subtotal:</span> <span>{formatINR(subtotal)}</span></div>
          <div className="summary-row"><span>Discount:</span> <span style={{ color: '#10B981' }}>-{formatINR(discount)}</span></div>
          <div className="summary-row"><span>Delivery Fee:</span> <span style={{ color: '#10B981' }}>FREE</span></div>

          <div className="summary-total summary-row">
            <span>Total Payable:</span> <span>{formatINR(total)}</span>
          </div>

          <div style={{ margin: '1.25rem 0' }}>
            <input 
              type="text" 
              placeholder="Coupon Code (MANOJ10)" 
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)', width: '65%', marginRight: '0.5rem' }} 
            />
            <button className="btn btn-outline btn-sm" onClick={() => applyCoupon(couponInput)}>Apply</button>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => navigateTo('checkout')}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
