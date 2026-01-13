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
  const isMountedRef = useRef(true);
  const isConnectingRef = useRef(false);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [realtimeEvents, setRealtimeEvents] = useState<ChronicleEvent[]>([]);

  const startConnection = useCallback(async (isManualReconnect = false) => {
    // Prevent concurrent connection attempts
    if (isConnectingRef.current && !isManualReconnect) {
      return;
    }

    // Cleanup existing connection if any
    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
      connectionRef.current = null;
    }

    // Don't start if unmounted (React Strict Mode cleanup)
    if (!isMountedRef.current) {
      return;
    }

    isConnectingRef.current = true;
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
      if (isMountedRef.current) {
        setStatus('reconnecting');
      }
    });

    connection.onreconnected(() => {
      if (isMountedRef.current) {
        setStatus('connected');
      }
    });

    connection.onclose((error) => {
      if (isMountedRef.current) {
        // Only set error if it's a real error, not a manual disconnect
        setStatus(error ? 'error' : 'disconnected');
      }
    });

    // Listen for new events from the hub
    // The hub method name may vary - common patterns are "ReceiveEvent", "NewEvent", "EventReceived"
    connection.on('ReceiveEvent', (event: ChronicleEvent) => {
      if (isMountedRef.current) {
        setRealtimeEvents((prev) => [event, ...prev]);
      }
    });

    // Also listen for alternative method names the backend might use
    connection.on('NewEvent', (event: ChronicleEvent) => {
      if (isMountedRef.current) {
        setRealtimeEvents((prev) => [event, ...prev]);
      }
    });

    connection.on('EventCreated', (event: ChronicleEvent) => {
      if (isMountedRef.current) {
        setRealtimeEvents((prev) => [event, ...prev]);
      }
    });

    connectionRef.current = connection;

    try {
      await connection.start();
      isConnectingRef.current = false;
      if (isMountedRef.current) {
        setStatus('connected');
      }
    } catch (err) {
      isConnectingRef.current = false;
      // Only log and set error if this wasn't an abort from unmount
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        // Don't treat abort during negotiation as an error (happens in Strict Mode)
        if (!errorMessage.includes('stopped during negotiation')) {
          console.error('SignalR connection failed:', err);
          setStatus('error');
        } else {
          setStatus('disconnected');
        }
      }
    }
  }, []);

  const reconnect = useCallback(() => {
    startConnection(true);
  }, [startConnection]);

  const clearRealtimeEvents = useCallback(() => {
    setRealtimeEvents([]);
  }, []);

  // Start connection on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    // Small delay to let React Strict Mode's double-mount settle
    // This prevents the "stopped during negotiation" error
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        startConnection();
      }
    }, 100);

    return () => {
      isMountedRef.current = false;
      isConnectingRef.current = false;
      clearTimeout(timeoutId);
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
