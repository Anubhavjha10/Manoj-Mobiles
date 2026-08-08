import React from 'react';
import { Package, CheckCircle, Truck, MapPin, XCircle, RotateCcw } from 'lucide-react';

const STATUS_CONFIG = {
  PLACED: { label: 'Order Placed', icon: Package, color: '#0056D2' },
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle, color: '#0284C7' },
  PACKED: { label: 'Packed', icon: Package, color: '#7C3AED' },
  SHIPPED: { label: 'Shipped', icon: Truck, color: '#D97706' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: MapPin, color: '#EA580C' },
  DELIVERED: { label: 'Delivered', icon: CheckCircle, color: '#10B981' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: '#EF4444' },
  RETURNED: { label: 'Returned', icon: RotateCcw, color: '#64748B' },
};

const STATUS_ORDER = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

/**
 * OrderTimeline - Visual timeline of order progress.
 * 
 * Props:
 *   currentStatus - The current OrderStatus string (e.g., 'SHIPPED')
 */
export const OrderTimeline = ({ currentStatus }) => {
  if (!currentStatus) return null;

  const isCancelled = currentStatus === 'CANCELLED';
  const isReturned = currentStatus === 'RETURNED';

  // For cancelled/returned, show a simplified timeline
  if (isCancelled || isReturned) {
    const config = STATUS_CONFIG[currentStatus];
    const IconComp = config.icon;
    return (
      <div className="ud-timeline">
        <div className="ud-timeline-step ud-timeline-active">
          <div className="ud-timeline-icon" style={{ background: config.color }}>
            <IconComp size={16} color="#fff" />
          </div>
          <div className="ud-timeline-info">
            <span className="ud-timeline-label">{config.label}</span>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="ud-timeline">
      {STATUS_ORDER.map((status, index) => {
        const config = STATUS_CONFIG[status];
        const IconComp = config.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={status}
            className={`ud-timeline-step ${isCompleted ? 'ud-timeline-completed' : ''} ${isCurrent ? 'ud-timeline-active' : ''}`}
          >
            <div className="ud-timeline-connector-wrap">
              {index > 0 && (
                <div
                  className="ud-timeline-connector"
                  style={{ background: isCompleted ? config.color : 'var(--border-light)' }}
                />
              )}
              <div
                className="ud-timeline-icon"
                style={{
                  background: isCompleted ? config.color : 'var(--bg-subtle)',
                  border: isCompleted ? 'none' : '2px solid var(--border-light)'
                }}
              >
                <IconComp size={14} color={isCompleted ? '#fff' : 'var(--text-muted)'} />
              </div>
            </div>
            <div className="ud-timeline-info">
              <span className="ud-timeline-label" style={{ color: isCompleted ? 'var(--text-dark)' : 'var(--text-muted)', fontWeight: isCurrent ? 700 : 500 }}>
                {config.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
