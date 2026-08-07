import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CheckoutPage = () => {
  const { cart, user, navigateTo, formatINR, products } = useStore();

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    navigateTo('order-confirmation');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Checkout</h1>
      <div className="cart-layout">
        <div className="cart-items-box">
          <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>1. Shipping & Contact Info</h3>
          <form onSubmit={handlePlaceOrder}>
            <div className="checkout-form-grid" style={{ marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Full Name</label>
                <input type="text" required defaultValue={user.name} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Mobile Number</label>
                <input type="tel" required defaultValue={user.phone} style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Delivery Address</label>
              <textarea required rows={3} defaultValue="102, Blue Horizon Towers, FC Road, Dadar West, Mumbai - 400028" style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-dark)' }}></textarea>
            </div>

            <h3 style={{ fontWeight: 800, margin: '1.5rem 0 1rem' }}>2. Select Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-dark)', padding: '0.8rem', borderRadius: 'var(--radius-md)' }}>
                <input type="radio" name="payment" defaultChecked /> 📱 UPI / Google Pay / PhonePe (Instant Cashback)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-dark)', padding: '0.8rem', borderRadius: 'var(--radius-md)' }}>
                <input type="radio" name="payment" /> 💳 Credit / Debit Card (No Cost EMI)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-dark)', padding: '0.8rem', borderRadius: 'var(--radius-md)' }}>
                <input type="radio" name="payment" /> 💵 Cash on Delivery (COD)
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem' }}>
              Place Order & Pay <CheckCircle size={18} />
            </button>
          </form>
        </div>

        <div className="order-summary-box">
          <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>Order Items</h3>
          {cart.map((item, idx) => {
            const p = products.find(prod => prod.id === item.productId || prod.id === Number(item.productId));
            if (!p) return null;
            return (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span>{item.qty}x {p.name}</span>
                <strong>{formatINR(p.price * item.qty)}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
