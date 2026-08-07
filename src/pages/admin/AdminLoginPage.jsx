import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export const AdminLoginPage = () => {
  const { setAdminUser, showToast } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.staffLogin(email, password);
      setAdminUser({
        loggedIn: true,
        name: response?.user?.name || 'System Admin',
        email: email,
        role: response?.user?.role || 'ADMIN'
      });
      showToast('Admin Login Successful');
      navigate('/admin/dashboard');
    } catch (error) {
      showToast('Login Failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon-wrap">
          <ShieldCheck size={32} />
        </div>
        <h1 className="admin-login-title">Admin Secure Login</h1>
        <p className="admin-login-subtitle">Manoj Mobiles Control Panel</p>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-login-field">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="admin@manojmobiles.com" style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>
          
          <div className="admin-login-field">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" />
              <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary admin-login-btn">
            {loading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
};
