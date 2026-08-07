import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock } from 'lucide-react';
import { authService } from '../../services/authService';

export const AdminLoginPage = () => {
  const { navigateAdminTo, setAdminUser, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call staffLogin with email and password as separate arguments
      const response = await authService.staffLogin(email, password);
      
      setAdminUser({
        loggedIn: true,
        name: response?.user?.name || 'System Admin',
        email: email,
        role: response?.user?.role || 'ADMIN'
      });
      
      showToast('Admin Login Successful');
      navigateAdminTo('dashboard');
    } catch (error) {
      showToast('Login Failed. Check credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9' }}>
      <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#E0F2FE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#0284C7' }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Admin Secure Login</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.5rem' }}>Manoj Mobiles Control Panel</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '1rem' }} 
              placeholder="admin@manojmobiles.com"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', paddingLeft: '2.5rem', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontSize: '1rem' }} 
                placeholder="••••••••"
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', padding: '0.875rem', backgroundColor: '#0284C7', color: 'white', 
              border: 'none', borderRadius: '0.375rem', fontSize: '1rem', fontWeight: 600, 
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem' 
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
