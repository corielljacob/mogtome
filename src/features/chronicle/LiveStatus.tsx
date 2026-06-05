import { memo } from "react";
import type { ConnectionStatus } from "@/shared/realtime/useEventsHub";

export const LiveStatus = memo(function LiveStatus({
  status,
}: {
  status: ConnectionStatus;
}) {
  const config: Record<
    ConnectionStatus,
    { tone: string; label: string; pulse: boolean }
  > = {
    connected: { tone: "var(--primary)", label: "live", pulse: true },
    connecting: { tone: "var(--accent)", label: "connecting", pulse: true },
    reconnecting: { tone: "var(--accent)", label: "reconnecting", pulse: true },
    disconnected: {
      tone: "var(--text-subtle)",
      label: "offline",
      pulse: false,
    },
    error: { tone: "var(--text-subtle)", label: "offline", pulse: false },
  };
  const { tone, label, pulse } = config[status];

  return (
    <span
      className="inline-flex items-center gap-2 text-xs font-soft text-[var(--text-muted)]"
      role="status"
      aria-live="polite"
      aria-label={`Live updates: ${label}`}
    >
      <span className="relative flex w-2 h-2" aria-hidden="true">
        {pulse && (
          <span
            className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping"
            style={{ background: tone }}
          />
        )}
        <span
          className="relative inline-flex w-2 h-2 rounded-full"
          style={{ background: tone }}
        />
      </span>
      {label}
    </span>
  );
});
