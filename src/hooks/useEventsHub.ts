import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import type { ChronicleEvent } from "../types";

// dev goes through the Vite proxy to dodge CORS; prod hits the API directly
const EVENTS_HUB_URL = import.meta.env.DEV
  ? "/eventsHub"
  : `${import.meta.env.VITE_API_BASE_URL || "https://api.mogtome.com"}/eventsHub`;

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

interface UseEventsHubResult {
  /** Current connection status */
  status: ConnectionStatus;
  /** All events received via SignalR (most recent first) */
  realtimeEvents: ChronicleEvent[];
  /** Number of events that haven't been marked as seen */
  unseenCount: number;
  /** Manually reconnect if disconnected */
  reconnect: () => void;
  /** Mark all current events as seen (removes "new" styling but keeps events visible) */
  markAllAsSeen: () => void;
  /** Clear all realtime events (use when refetching from API) */
  clearEvents: () => void;
}

/**
 * Hook to subscribe to real-time FC events via SignalR.
 * Returns live events as they arrive and connection status.
 */
export function useEventsHub(): UseEventsHubResult {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const isMountedRef = useRef(true);
  const isConnectingRef = useRef(false);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [realtimeEvents, setRealtimeEvents] = useState<ChronicleEvent[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);

  const startConnection = useCallback(async (isManualReconnect = false) => {
    if (isConnectingRef.current && !isManualReconnect) {
      return;
    }

    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
      } catch {
        // ignore stop errors
      }
      connectionRef.current = null;
    }

    // bail if Strict Mode already unmounted us
    if (!isMountedRef.current) {
      return;
    }

    isConnectingRef.current = true;
    setStatus("connecting");

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(EVENTS_HUB_URL)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // exponential backoff capped at 30s; give up after 10 attempts
          if (retryContext.previousRetryCount >= 10) {
            return null;
          }
          return Math.min(
            1000 * Math.pow(2, retryContext.previousRetryCount),
            30000,
          );
        },
      })
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connection.onreconnecting(() => {
      if (isMountedRef.current) {
        setStatus("reconnecting");
      }
    });

    connection.onreconnected(() => {
      if (isMountedRef.current) {
        setStatus("connected");
      }
    });

    connection.onclose((error) => {
      if (isMountedRef.current) {
        // a manual disconnect has no error; only flag real failures
        setStatus(error ? "error" : "disconnected");
      }
    });

    connection.on("informclient", (data: ChronicleEvent | ChronicleEvent[]) => {
      if (isMountedRef.current) {
        const events = Array.isArray(data) ? data : [data];
        setRealtimeEvents((prev) => [...events, ...prev]);
        setUnseenCount((prev) => prev + events.length);
      }
    });

    connectionRef.current = connection;

    try {
      await connection.start();
      isConnectingRef.current = false;
      if (isMountedRef.current) {
        setStatus("connected");
      }
    } catch (err) {
      isConnectingRef.current = false;
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        // Strict Mode aborts negotiation on the throwaway mount; not a real error
        if (errorMessage.includes("stopped during negotiation")) {
          setStatus("disconnected");
        } else {
          // dev-only warn; backend may just be down, don't spam the console
          if (import.meta.env.DEV) {
            console.warn(
              "[EventsHub] Connection unavailable - will retry on reconnect",
            );
          }
          setStatus("error");
        }
      }
    }
  }, []);

  const reconnect = useCallback(() => {
    startConnection(true);
  }, [startConnection]);

  const markAllAsSeen = useCallback(() => {
    setUnseenCount(0);
  }, []);

  const clearEvents = useCallback(() => {
    setRealtimeEvents([]);
    setUnseenCount(0);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // let Strict Mode's double-mount settle first; avoids "stopped during negotiation"
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
    unseenCount,
    reconnect,
    markAllAsSeen,
    clearEvents,
  };
}
