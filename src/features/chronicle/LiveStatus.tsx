import { memo } from "react";
import type { ConnectionStatus } from "@/shared/realtime/useEventsHub";
import { ChronicleIcon } from "./ChronicleIcons";
import "./chronicle-entry.css";

const connectionLabels: Record<ConnectionStatus, string> = {
  connected: "Live updates connected",
  connecting: "Connecting…",
  reconnecting: "Reconnecting…",
  disconnected: "Live updates offline",
  error: "Live updates offline",
};

export const LiveStatus = memo(function LiveStatus({
  status,
  compact = false,
}: {
  status: ConnectionStatus;
  compact?: boolean;
}) {
  const label = connectionLabels[status];
  const isConnecting = status === "connecting" || status === "reconnecting";

  return (
    <span
      className="chronicle-live-status"
      data-connection={status}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={isConnecting ? `Live updates: ${label}` : label}
      title={label}
    >
      <span className="chronicle-live-icon" aria-hidden="true">
        <ChronicleIcon name={isConnecting ? "refresh" : "wifi"} size={16} />
      </span>
      <span>
        {compact && status === "connected" ? (
          <>
            Live<span className="sr-only"> updates connected</span>
          </>
        ) : (
          label
        )}
      </span>
    </span>
  );
});
