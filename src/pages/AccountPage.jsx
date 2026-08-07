import React from 'react';
import { useStore } from '../context/StoreContext';

export const AccountPage = () => {
  const { user, setUser, showToast } = useStore();

  const handleLogin = (e) => {
    e.preventDefault();
    setUser(u => ({ ...u, loggedIn: true }));
    showToast('Logged in successfully!');
  };

  const handleLogout = () => {
    setUser(u => ({ ...u, loggedIn: false }));
    showToast('Logged out');
  };

  if (!user.loggedIn) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto', background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '2.5rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
          <h2 style={{ fontWeight: 800, color: 'var(--secondary-blue)', textAlign: 'center', marginBottom: '1.5rem' }}>Login / Sign Up</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Mobile Number or Email</label>
              <input type="text" required defaultValue="anubhab@manojmobiles.com" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Password</label>
              <input type="password" required defaultValue="••••••••" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dark)' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login to Account</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <div>
            <h1 style={{ fontWeight: 800 }}>My Account</h1>
            <p style={{ color: 'var(--text-muted)' }}>{user.name} ({user.email})</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
        </div>

        <h3 style={{ fontWeight: 800, margin: '1.5rem 0 1rem' }}>Order History</h3>
        <div style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', background: 'var(--bg-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Order #MM-89421</span>
            <span style={{ color: '#10B981' }}>Dispatched</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>iPhone 15 Pro Max • ₹1,48,900</p>
        </div>
      </div>
    </div>
  );
};
