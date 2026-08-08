import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { LiveTrackingMap } from '../components/user/LiveTrackingMap';
import { OrderTimeline } from '../components/user/OrderTimeline';
import { LayoutDashboard, ShoppingBag, MapPin, UserCircle, LogOut, Package, ChevronRight, Plus, Pencil, Trash2, Phone, Mail, Calendar, Shield } from 'lucide-react';

// ─── Tab Definitions ─────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'profile', label: 'Profile', icon: UserCircle },
];

// ─── Status Badge ─────────────────────────────
const StatusBadge = ({ status }) => {
  const colorMap = {
    PLACED: '#0056D2',
    CONFIRMED: '#0284C7',
    PACKED: '#7C3AED',
    SHIPPED: '#D97706',
    OUT_FOR_DELIVERY: '#EA580C',
    DELIVERED: '#10B981',
    CANCELLED: '#EF4444',
    RETURNED: '#64748B',
  };
  const color = colorMap[status] || '#64748B';
  const label = status?.replace(/_/g, ' ') || 'Unknown';
  return (
    <span className="ud-status-badge" style={{ background: color + '18', color, border: `1px solid ${color}40` }}>
      {label}
    </span>
  );
};

// ─── Empty State ──────────────────────────────
const EmptyState = ({ icon: IconComp, title, subtitle, action }) => (
  <div className="ud-empty-state">
    <div className="ud-empty-icon-wrap">
      <IconComp size={48} strokeWidth={1.2} />
    </div>
    <h3>{title}</h3>
    <p>{subtitle}</p>
    {action}
  </div>
);

// ─── Overview Tab ─────────────────────────────
const OverviewTab = ({ profile, orders, onViewOrder }) => {
  const recentOrder = orders?.content?.[0];

  return (
    <div className="ud-overview">
      {/* Welcome Banner */}
      <div className="ud-welcome-banner">
        <div className="ud-welcome-avatar">
          {(profile?.name || 'C').charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>Welcome back, {profile?.name || 'Customer'}!</h2>
          <p>Here's a quick look at your account activity</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="ud-stats-grid">
        <div className="ud-stat-card">
          <div className="ud-stat-icon" style={{ background: '#EBF3FF', color: '#0056D2' }}><ShoppingBag size={22} /></div>
          <div>
            <div className="ud-stat-value">{orders?.totalElements || 0}</div>
            <div className="ud-stat-label">Total Orders</div>
          </div>
        </div>
        <div className="ud-stat-card">
          <div className="ud-stat-icon" style={{ background: '#ECFDF5', color: '#10B981' }}><Package size={22} /></div>
          <div>
            <div className="ud-stat-value">
              {orders?.content?.filter(o => o.orderStatus === 'DELIVERED').length || 0}
            </div>
            <div className="ud-stat-label">Delivered</div>
          </div>
        </div>
        <div className="ud-stat-card">
          <div className="ud-stat-icon" style={{ background: '#FFF7ED', color: '#EA580C' }}><MapPin size={22} /></div>
          <div>
            <div className="ud-stat-value">
              {orders?.content?.filter(o => !['DELIVERED', 'CANCELLED', 'RETURNED'].includes(o.orderStatus)).length || 0}
            </div>
            <div className="ud-stat-label">Active</div>
          </div>
        </div>
      </div>

      {/* Recent Order / Live Tracking */}
      <div className="ud-section-header">
        <h3>Recent Order</h3>
      </div>

      {!recentOrder ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          subtitle="Start shopping to see your orders here!"
          action={<a href="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Browse Products</a>}
        />
      ) : (
        <div className="ud-recent-order-card" onClick={() => onViewOrder(recentOrder.id)}>
          <div className="ud-recent-order-top">
            <div>
              <span className="ud-order-number">#{recentOrder.orderNumber}</span>
              <StatusBadge status={recentOrder.orderStatus} />
            </div>
            <ChevronRight size={20} className="ud-chevron" />
          </div>

          {recentOrder.orderItems?.length > 0 && (
            <div className="ud-recent-order-items">
              {recentOrder.orderItems.slice(0, 2).map(item => (
                <div key={item.id} className="ud-recent-item">
                  {item.primaryImageUrl ? (
                    <img src={item.primaryImageUrl} alt={item.productName} className="ud-recent-item-img" />
                  ) : (
                    <div className="ud-recent-item-placeholder"><Package size={20} /></div>
                  )}
                  <div>
                    <span className="ud-recent-item-name">{item.productName}</span>
                    <span className="ud-recent-item-variant">{item.variantName} × {item.qty}</span>
                  </div>
                </div>
              ))}
              {recentOrder.orderItems.length > 2 && (
                <span className="ud-more-items">+{recentOrder.orderItems.length - 2} more</span>
              )}
            </div>
          )}

          <div className="ud-recent-order-footer">
            <span>₹{Number(recentOrder.totalAmount).toLocaleString('en-IN')}</span>
            {recentOrder.placedAt && (
              <span className="ud-order-date">{new Date(recentOrder.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            )}
          </div>

          {/* Live Tracking or Timeline */}
          {recentOrder.orderStatus === 'OUT_FOR_DELIVERY' ? (
            <div onClick={(e) => e.stopPropagation()}>
              <LiveTrackingMap orderId={recentOrder.id} deliveryAddress={recentOrder.address} />
            </div>
          ) : (
            <OrderTimeline currentStatus={recentOrder.orderStatus} />
          )}
        </div>
      )}
    </div>
  );
};

// ─── Orders Tab ──────────────────────────────
const OrdersTab = ({ orders, onViewOrder }) => {
  if (!orders?.content?.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders yet"
        subtitle="When you place an order, it will appear here"
        action={<a href="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</a>}
      />
    );
  }

  return (
    <div className="ud-orders-list">
      {orders.content.map(order => (
        <div key={order.id} className="ud-order-card" onClick={() => onViewOrder(order.id)}>
          <div className="ud-order-card-top">
            <div>
              <span className="ud-order-number">#{order.orderNumber}</span>
              <StatusBadge status={order.orderStatus} />
            </div>
            <ChevronRight size={18} className="ud-chevron" />
          </div>
          <div className="ud-order-card-items">
            {order.orderItems?.slice(0, 3).map(item => (
              <span key={item.id} className="ud-order-item-pill">{item.productName}</span>
            ))}
            {order.orderItems?.length > 3 && (
              <span className="ud-order-item-pill ud-order-item-more">+{order.orderItems.length - 3}</span>
            )}
          </div>
          <div className="ud-order-card-footer">
            <span className="ud-order-total">₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
            {order.placedAt && (
              <span className="ud-order-date">{new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Order Detail View ───────────────────────
const OrderDetailView = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await userService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="ud-loading">Loading order details...</div>;
  if (!order) return <div className="ud-loading">Order not found</div>;

  return (
    <div className="ud-order-detail">
      <button className="ud-back-btn" onClick={onBack}>← Back to Orders</button>

      <div className="ud-detail-header">
        <div>
          <h2>Order #{order.orderNumber}</h2>
          <StatusBadge status={order.orderStatus} />
        </div>
        {order.placedAt && (
          <span className="ud-order-date">
            Placed on {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Live Tracking Map for OUT_FOR_DELIVERY */}
      {order.orderStatus === 'OUT_FOR_DELIVERY' && (
        <LiveTrackingMap orderId={order.id} deliveryAddress={order.address} />
      )}

      {/* Timeline for other statuses */}
      {order.orderStatus !== 'OUT_FOR_DELIVERY' && (
        <div className="ud-detail-section">
          <h3>Order Progress</h3>
          <OrderTimeline currentStatus={order.orderStatus} />
        </div>
      )}

      {/* Items */}
      <div className="ud-detail-section">
        <h3>Items ({order.orderItems?.length || 0})</h3>
        <div className="ud-detail-items">
          {order.orderItems?.map(item => (
            <div key={item.id} className="ud-detail-item">
              {item.primaryImageUrl ? (
                <img src={item.primaryImageUrl} alt={item.productName} className="ud-detail-item-img" />
              ) : (
                <div className="ud-detail-item-placeholder"><Package size={24} /></div>
              )}
              <div className="ud-detail-item-info">
                <span className="ud-detail-item-name">{item.productName}</span>
                <span className="ud-detail-item-variant">{item.variantName}</span>
                <span className="ud-detail-item-qty">Qty: {item.qty} × ₹{Number(item.price).toLocaleString('en-IN')}</span>
              </div>
              <span className="ud-detail-item-subtotal">₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="ud-detail-section ud-price-breakdown">
        <h3>Payment Details</h3>
        <div className="ud-price-row"><span>Subtotal</span><span>₹{Number(order.totalAmount - (order.deliveryCharge || 0) - (order.gstAmount || 0) + (order.discountAmount || 0)).toLocaleString('en-IN')}</span></div>
        {order.discountAmount > 0 && <div className="ud-price-row ud-discount"><span>Discount</span><span>-₹{Number(order.discountAmount).toLocaleString('en-IN')}</span></div>}
        {order.deliveryCharge > 0 && <div className="ud-price-row"><span>Delivery</span><span>₹{Number(order.deliveryCharge).toLocaleString('en-IN')}</span></div>}
        {order.gstAmount > 0 && <div className="ud-price-row"><span>GST</span><span>₹{Number(order.gstAmount).toLocaleString('en-IN')}</span></div>}
        <div className="ud-price-row ud-price-total"><span>Total</span><span>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span></div>
        <div className="ud-payment-info">
          <span>Payment: {order.paymentMethod?.replace(/_/g, ' ')}</span>
          <StatusBadge status={order.paymentStatus} />
        </div>
      </div>

      {/* Delivery Address */}
      {order.address && (
        <div className="ud-detail-section">
          <h3>Delivery Address</h3>
          <div className="ud-address-card">
            {order.address.label && <span className="ud-address-label">{order.address.label}</span>}
            <p>{order.address.addressLine}</p>
            <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Addresses Tab ───────────────────────────
const AddressesTab = ({ showToast }) => {
  const [addresses, setAddresses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ label: '', addressLine: '', city: '', state: '', pincode: '', isDefault: false });

  const fetchAddresses = useCallback(async () => {
    try {
      const data = await userService.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await userService.updateAddress(editingId, formData);
        showToast('Address updated!');
      } else {
        await userService.createAddress(formData);
        showToast('Address added!');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ label: '', addressLine: '', city: '', state: '', pincode: '', isDefault: false });
      fetchAddresses();
    } catch (err) {
      showToast('Failed to save address');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      await userService.deleteAddress(id);
      showToast('Address deleted');
      fetchAddresses();
    } catch (err) {
      showToast('Failed to delete address');
    }
  };

  const startEdit = (addr) => {
    setEditingId(addr.id);
    setFormData({ label: addr.label || '', addressLine: addr.addressLine, city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
    setShowForm(true);
  };

  if (loading) return <div className="ud-loading">Loading addresses...</div>;

  return (
    <div className="ud-addresses">
      <div className="ud-section-header">
        <h3>Saved Addresses</h3>
        {!showForm && (
          <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ label: '', addressLine: '', city: '', state: '', pincode: '', isDefault: false }); }}>
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {showForm && (
        <form className="ud-address-form" onSubmit={handleSave}>
          <div className="ud-form-grid">
            <div className="ud-form-field">
              <label>Label (e.g., Home, Office)</label>
              <input type="text" value={formData.label} onChange={e => setFormData(f => ({ ...f, label: e.target.value }))} placeholder="Home" />
            </div>
            <div className="ud-form-field ud-form-full">
              <label>Address Line *</label>
              <input type="text" required value={formData.addressLine} onChange={e => setFormData(f => ({ ...f, addressLine: e.target.value }))} placeholder="Street, House No., Area" />
            </div>
            <div className="ud-form-field">
              <label>City *</label>
              <input type="text" required value={formData.city} onChange={e => setFormData(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div className="ud-form-field">
              <label>State *</label>
              <input type="text" required value={formData.state} onChange={e => setFormData(f => ({ ...f, state: e.target.value }))} />
            </div>
            <div className="ud-form-field">
              <label>Pincode *</label>
              <input type="text" required value={formData.pincode} onChange={e => setFormData(f => ({ ...f, pincode: e.target.value }))} />
            </div>
          </div>
          <label className="ud-checkbox-label">
            <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData(f => ({ ...f, isDefault: e.target.checked }))} />
            Set as default address
          </label>
          <div className="ud-form-actions">
            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Save'} Address</button>
            <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      )}

      {!addresses?.content?.length && !showForm ? (
        <EmptyState
          icon={MapPin}
          title="No addresses saved"
          subtitle="Add a delivery address to speed up your checkout"
        />
      ) : (
        <div className="ud-address-grid">
          {addresses?.content?.map(addr => (
            <div key={addr.id} className={`ud-address-card ${addr.isDefault ? 'ud-address-default' : ''}`}>
              <div className="ud-address-card-top">
                {addr.label && <span className="ud-address-label">{addr.label}</span>}
                {addr.isDefault && <span className="ud-default-badge">Default</span>}
              </div>
              <p>{addr.addressLine}</p>
              <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              <div className="ud-address-actions">
                <button onClick={() => startEdit(addr)} className="ud-icon-btn"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(addr.id)} className="ud-icon-btn ud-icon-btn-danger"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Profile Tab ─────────────────────────────
const ProfileTab = ({ profile, showToast }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (profile) {
      setFormData({ name: profile.name || '', email: profile.email || '' });
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(formData);
      showToast('Profile updated!');
      setEditing(false);
    } catch (err) {
      showToast('Failed to update profile');
    }
  };

  if (!profile) return <div className="ud-loading">Loading profile...</div>;

  return (
    <div className="ud-profile">
      <div className="ud-profile-header">
        <div className="ud-profile-avatar">
          {(profile.name || 'C').charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{profile.name || 'Customer'}</h2>
          <span className="ud-profile-role">{profile.role}</span>
        </div>
      </div>

      {!editing ? (
        <div className="ud-profile-details">
          <div className="ud-profile-field">
            <Phone size={18} />
            <div><label>Phone</label><span>{profile.phone || '—'}</span></div>
          </div>
          <div className="ud-profile-field">
            <Mail size={18} />
            <div><label>Email</label><span>{profile.email || '—'}</span></div>
          </div>
          <div className="ud-profile-field">
            <Calendar size={18} />
            <div><label>Member Since</label><span>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}</span></div>
          </div>
          <div className="ud-profile-field">
            <Shield size={18} />
            <div><label>Status</label><span>{profile.status || '—'}</span></div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form className="ud-profile-form" onSubmit={handleSave}>
          <div className="ud-form-field">
            <label>Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="ud-form-field">
            <label>Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="ud-form-actions">
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};


// ═══════════════════════════════════════════════
//  MAIN ACCOUNT PAGE COMPONENT
// ═══════════════════════════════════════════════
export const AccountPage = () => {
  const { user, setUser, showToast } = useStore();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [dashLoading, setDashLoading] = useState(true);

  // Fetch dashboard data when logged in
  useEffect(() => {
    if (!user.loggedIn) return;

    const loadDashboard = async () => {
      setDashLoading(true);
      try {
        const [profileData, ordersData] = await Promise.allSettled([
          userService.getProfile(),
          userService.getOrders(0, 20),
        ]);
        if (profileData.status === 'fulfilled') setProfile(profileData.value);
        if (ordersData.status === 'fulfilled') setOrders(ordersData.value);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setDashLoading(false);
      }
    };

    loadDashboard();
  }, [user.loggedIn]);

  // ─── Login Handlers ────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(phone)) {
      showToast('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    try {
      await authService.sendOtp(phone);
      setIsOtpSent(true);
      showToast('OTP sent successfully!');
    } catch (err) {
      showToast('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!otp) { showToast('Please enter the OTP'); return; }
    setLoading(true);
    try {
      const data = await authService.customerLogin(phone, otp);
      setUser(u => ({ ...u, loggedIn: true, name: data?.name || 'Customer', email: data?.email || phone }));
      showToast('Logged in successfully!');
    } catch (err) {
      showToast('Invalid OTP or Login Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(u => ({ ...u, loggedIn: false }));
    setProfile(null);
    setOrders(null);
    showToast('Logged out');
  };

  // ─── Login Screen ──────────────────────────
  if (!user.loggedIn) {
    return (
      <div className="ud-login-page">
        <div className="ud-login-card">
          <div className="ud-login-icon-wrap">
            <UserCircle size={48} strokeWidth={1.5} />
          </div>
          <h2>Login / Sign Up</h2>
          <p className="ud-login-subtitle">Enter your mobile number to continue</p>

          {!isOtpSent ? (
            <form onSubmit={handleSendOtp}>
              <div className="ud-form-field">
                <label>Mobile Number</label>
                <div className="ud-phone-input-wrap">
                  <span className="ud-phone-prefix">+91</span>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary ud-login-btn">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="ud-form-field">
                <label>Mobile Number</label>
                <div className="ud-phone-input-wrap ud-phone-disabled">
                  <span className="ud-phone-prefix">+91</span>
                  <input type="text" disabled value={phone} />
                </div>
              </div>
              <div className="ud-form-field">
                <label>Enter OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit OTP"
                  className="ud-otp-input"
                  maxLength={6}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary ud-login-btn">
                {loading ? 'Verifying...' : 'Login Securely'}
              </button>
              <button type="button" onClick={() => { setIsOtpSent(false); setOtp(''); }} className="ud-change-number-btn">
                Change Mobile Number
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ─── Dashboard Screen ──────────────────────
  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveTab('orders');
  };

  return (
    <div className="ud-dashboard">
      {/* Sidebar */}
      <aside className="ud-sidebar">
        <div className="ud-sidebar-profile">
          <div className="ud-sidebar-avatar">
            {(profile?.name || user.name || 'C').charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="ud-sidebar-name">{profile?.name || user.name || 'Customer'}</span>
            <span className="ud-sidebar-phone">{profile?.phone || ''}</span>
          </div>
        </div>

        <nav className="ud-sidebar-nav">
          {TABS.map(tab => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                className={`ud-nav-item ${activeTab === tab.id && !selectedOrderId ? 'ud-nav-active' : ''}`}
                onClick={() => { setActiveTab(tab.id); setSelectedOrderId(null); }}
              >
                <IconComp size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <button className="ud-nav-item ud-nav-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ud-main">
        {dashLoading ? (
          <div className="ud-loading">Loading your dashboard...</div>
        ) : selectedOrderId ? (
          <OrderDetailView orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
        ) : activeTab === 'overview' ? (
          <OverviewTab profile={profile} orders={orders} onViewOrder={handleViewOrder} />
        ) : activeTab === 'orders' ? (
          <OrdersTab orders={orders} onViewOrder={handleViewOrder} />
        ) : activeTab === 'addresses' ? (
          <AddressesTab showToast={showToast} />
        ) : activeTab === 'profile' ? (
          <ProfileTab profile={profile} showToast={showToast} />
        ) : null}
      </main>
    </div>
  );
};
