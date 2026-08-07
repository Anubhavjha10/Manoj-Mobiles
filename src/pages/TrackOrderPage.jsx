import React, { useState } from 'react';
import { PackageCheck, CheckCircle2, Clock, Truck, Home } from 'lucide-react';

export const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('#MM-89421');

  const steps = [
    { title: 'Order Placed', time: 'Aug 6, 10:00 AM', status: 'completed', icon: CheckCircle2 },
    { title: 'Packed at Store', time: 'Aug 6, 11:30 AM', status: 'completed', icon: PackageCheck },
    { title: 'Out for Delivery', time: 'Aug 6, 02:15 PM', status: 'completed', icon: Truck },
    { title: 'Delivered', time: 'Estimated by 08:00 PM', status: 'pending', icon: Home }
  ];

  return (
    <div className="container track-order-container">
      <div className="track-order-card">
        <h2 className="track-card-title">Track Your Order</h2>
        <p className="track-card-subtitle">Enter your Manoj Mobiles Order ID to get real-time delivery status</p>
        
        <form className="track-search-form" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            value={orderId} 
            onChange={(e) => setOrderId(e.target.value)} 
            placeholder="Enter Order ID (e.g. #MM-89421)" 
            className="track-input" 
          />
          <button type="submit" className="btn btn-primary track-submit-btn">Track Order</button>
        </form>

        <div className="track-status-summary">
          <span>Order Status:</span>
          <strong className="status-highlight">Dispatched & In Transit</strong>
        </div>

        {/* DESKTOP TIMELINE */}
        <div className="tracker-timeline desktop-only-timeline">
          <div className="tracker-line"><div className="tracker-line-progress" style={{ width: '75%' }}></div></div>
          <div className="tracker-node completed">✓</div>
          <div className="tracker-node completed">✓</div>
          <div className="tracker-node completed">✓</div>
          <div className="tracker-node">4</div>
        </div>

        <div className="tracker-labels-grid desktop-only-timeline">
          <div>Order Placed<br/><span style={{ fontWeight: 400 }}>Aug 6, 10:00 AM</span></div>
          <div>Packed at Store<br/><span style={{ fontWeight: 400 }}>Aug 6, 11:30 AM</span></div>
          <div>Out for Delivery<br/><span style={{ fontWeight: 400 }}>Aug 6, 02:15 PM</span></div>
          <div>Delivered<br/><span style={{ fontWeight: 400 }}>Pending</span></div>
        </div>

        {/* MOBILE VERTICAL TIMELINE */}
        <div className="mobile-vertical-timeline">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isLast = idx === steps.length - 1;

            return (
              <div key={idx} className={`vertical-timeline-item ${isCompleted ? 'completed' : 'pending'}`}>
                <div className="vertical-timeline-left">
                  <div className="vertical-node-badge">
                    <Icon size={16} />
                  </div>
                  {!isLast && <div className="vertical-timeline-line"></div>}
                </div>

                <div className="vertical-timeline-content">
                  <h4 className="vertical-timeline-title">{step.title}</h4>
                  <span className="vertical-timeline-time">{step.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
