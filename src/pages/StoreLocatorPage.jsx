import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { STORES_DATA } from '../data/products';

export const StoreLocatorPage = () => {
  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div className="section-heading">
        <div>
          <h1 className="section-title"><MapPin color="#0056D2" /> Manoj Mobiles Store Locator</h1>
          <p className="section-subtitle">Visit any of our 50+ flagship stores for hands-on experience & instant repairs</p>
        </div>
      </div>

      <div className="store-grid">
        {STORES_DATA.map(s => (
          <div key={s.id} className="store-card">
            <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>{s.tag}</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary-blue)' }}>{s.name}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', margin: '0.5rem 0' }}>📍 {s.address}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Landmark: {s.landmark}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📞 Phone: {s.phone}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>⏰ Hours: {s.hours}</p>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(s.mapQuery)}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              <Navigation size={16} /> Get Directions on Google Maps
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
