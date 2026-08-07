import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationPage = () => {
  const { navigateTo } = useStore();

  return (
    <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '3rem', maxWidth: '600px', margin: '0 auto', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ width: '72px', height: '72px', background: '#D1FAE5', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
          <CheckCircle2 size={40} />
        </div>
        <h1 style={{ color: 'var(--secondary-blue)', fontWeight: 800 }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>Thank you for shopping with Manoj Mobiles. Your order reference ID is <strong>#MM-89421</strong>.</p>
        <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          <p>🚚 <strong>Estimated Delivery:</strong> Tomorrow by 5:00 PM</p>
          <p>📍 <strong>Deliver to:</strong> Dadar West, Mumbai - 400028</p>
        </div>
        <div className="confirmation-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigateTo('track-order')}>Track Order Status</button>
          <button className="btn btn-outline" onClick={() => navigateTo('home')}>Return to Home</button>
        </div>
      </div>
    </div>
  );
};
