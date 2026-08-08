import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { connectTracking, disconnectTracking } from '../../services/trackingService';
import { userService } from '../../services/userService';

// Fix for default marker icons in Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Component that smoothly pans the map to the delivery agent
const MapPanner = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.panTo(position, { animate: true, duration: 1 });
    }
  }, [position, map]);
  return null;
};

/**
 * LiveTrackingMap - Reusable component for displaying live delivery tracking.
 * 
 * Props:
 *   orderId - UUID of the order to track
 *   deliveryAddress - { addressLine, city, state, pincode } (optional, for destination marker)
 */
export const LiveTrackingMap = ({ orderId, deliveryAddress }) => {
  const [agentPosition, setAgentPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    // First, fetch the current/last known location via REST
    const fetchInitialLocation = async () => {
      try {
        const location = await userService.trackOrderLocation(orderId);
        if (location?.lat && location?.lng) {
          setAgentPosition([location.lat, location.lng]);
        }
      } catch (err) {
        // Not critical - WebSocket will provide updates
        console.warn('Could not fetch initial location:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialLocation();

    // Then, subscribe to real-time WebSocket updates
    connectTracking(
      (location) => {
        if (location?.orderId === orderId && location?.lat && location?.lng) {
          setAgentPosition([location.lat, location.lng]);
          setLoading(false);
        }
      },
      (errMsg) => {
        setError(errMsg);
        setLoading(false);
      }
    );

    return () => {
      disconnectTracking();
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="ud-tracking-map-loading">
        <div className="ud-tracking-pulse"></div>
        <p>Connecting to live tracking...</p>
      </div>
    );
  }

  if (error && !agentPosition) {
    return (
      <div className="ud-tracking-map-error">
        <span className="ud-tracking-error-icon">📡</span>
        <p>Unable to connect to live tracking</p>
        <small>The delivery agent's location will appear here once available</small>
      </div>
    );
  }

  const center = agentPosition || [28.6139, 77.2090]; // Default to Delhi

  return (
    <div className="ud-tracking-map-container">
      <div className="ud-tracking-map-header">
        <span className="ud-tracking-live-dot"></span>
        <span>Live Tracking</span>
      </div>
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '320px', width: '100%', borderRadius: '0 0 12px 12px' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {agentPosition && (
          <>
            <Marker position={agentPosition} icon={deliveryIcon}>
              <Popup>Delivery Agent is here</Popup>
            </Marker>
            <MapPanner position={agentPosition} />
          </>
        )}
      </MapContainer>
    </div>
  );
};
