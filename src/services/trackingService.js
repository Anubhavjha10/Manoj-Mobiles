import { Client } from '@stomp/stompjs';
import { getToken } from './api';

let stompClient = null;
let currentSubscription = null;

/**
 * Connect to the WebSocket server for live order tracking.
 * Uses STOMP over native WebSocket with JWT authentication via the Authorization header.
 * 
 * Note: We use native WebSocket instead of SockJS to avoid the
 * "global is not defined" issue in Vite environments.
 */
export const connectTracking = (onLocationUpdate, onError) => {
  const token = getToken();
  if (!token) {
    onError?.('No auth token available');
    return;
  }

  // Disconnect existing connection if any
  disconnectTracking();

  // Determine WebSocket URL from current location
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws-delivery/websocket`;

  stompClient = new Client({
    brokerURL: wsUrl,
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      // Subscribe to the user-specific tracking queue
      currentSubscription = stompClient.subscribe(
        '/user/queue/order-tracking',
        (message) => {
          try {
            const location = JSON.parse(message.body);
            onLocationUpdate?.(location);
          } catch (e) {
            console.error('Failed to parse tracking message:', e);
          }
        }
      );
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      onError?.('Tracking connection error');
    },
    onWebSocketError: (event) => {
      console.error('WebSocket error:', event);
      onError?.('WebSocket connection failed');
    }
  });

  stompClient.activate();
};

/**
 * Disconnect from the WebSocket server.
 */
export const disconnectTracking = () => {
  if (currentSubscription) {
    currentSubscription.unsubscribe();
    currentSubscription = null;
  }
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};
