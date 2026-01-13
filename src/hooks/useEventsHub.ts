import { useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import type { ChronicleEvent } from '../types';

// Base URL for the SignalR hub
// In development, use the Vite proxy to avoid CORS issues
// In production, connect directly to the API
const EVENTS_HUB_URL = import.meta.env.DEV
  ? '/eventsHub'
  : (import.meta.env.VITE_API_BASE_URL
      ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/eventsHub`
      : 'https://mogtome-api-egate2htgze6anhd.westcentralus-01.azurewebsites.net/eventsHub');

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';

interface UseEventsHubResult {
  /** Current connection status */
  status: ConnectionStatus;
  /** New events received via SignalR (most recent first) */
  realtimeEvents: ChronicleEvent[];
  /** Manually reconnect if disconnected */
  reconnect: () => void;
  /** Clear all realtime events */
  clearRealtimeEvents: () => void;
}

/**
 * Hook to subscribe to real-time FC events via SignalR.
 * Returns live events as they arrive and connection status.
 */
export function useEventsHub(): UseEventsHubResult {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [realtimeEvents, setRealtimeEvents] = useState<ChronicleEvent[]>([]);

  const startConnection = useCallback(async () => {
    // Cleanup existing connection if any
    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
    }

    setStatus('connecting');

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(EVENTS_HUB_URL)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 0s, 2s, 4s, 8s, 16s, then cap at 30s
          if (retryContext.previousRetryCount >= 10) {
            return null; // Stop retrying after 10 attempts
          }
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        },
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // Handle connection state changes
    connection.onreconnecting(() => {
      setStatus('reconnecting');
    });

    connection.onreconnected(() => {
      setStatus('connected');
    });

    connection.onclose((error) => {
      setStatus(error ? 'error' : 'disconnected');
    });

    // Listen for new events from the hub
    // The hub method name may vary - common patterns are "ReceiveEvent", "NewEvent", "EventReceived"
    connection.on('ReceiveEvent', (event: ChronicleEvent) => {
      setRealtimeEvents((prev) => [event, ...prev]);
    });

    // Also listen for alternative method names the backend might use
    connection.on('NewEvent', (event: ChronicleEvent) => {
      setRealtimeEvents((prev) => [event, ...prev]);
    });

    connection.on('EventCreated', (event: ChronicleEvent) => {
      setRealtimeEvents((prev) => [event, ...prev]);
    });

    connectionRef.current = connection;

    try {
      await connection.start();
      setStatus('connected');
    } catch (err) {
      console.error('SignalR connection failed:', err);
      setStatus('error');
    }
  }, []);

  const reconnect = useCallback(() => {
    startConnection();
  }, [startConnection]);

  const clearRealtimeEvents = useCallback(() => {
    setRealtimeEvents([]);
  }, []);

  // Start connection on mount
  useEffect(() => {
    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop().catch(() => {
          // Ignore cleanup errors
        });
      }
    };
  }, [startConnection]);

  return {
    status,
    realtimeEvents,
    reconnect,
    clearRealtimeEvents,
  };
}
