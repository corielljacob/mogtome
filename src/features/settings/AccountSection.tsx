import { type CSSProperties } from "react";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { SettingsCard } from "@/features/settings/SettingsControls";

export function AccountSection() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();

  return (
    <SettingsCard
      icon={User}
      title="Account"
      accent="var(--primary)"
      pinColor="var(--secondary)"
      tilt={0.5}
    >
      {isLoading ? (
        <p className="font-soft text-sm text-[var(--text-muted)]">Loading…</p>
      ) : !isAuthenticated || !user ? (
        <p className="font-soft text-sm text-[var(--text-muted)]">
          Sign in with Discord using the button in the navigation bar, kupo~
        </p>
      ) : (
        <>
          <div className="flex items-center gap-3.5 mb-4">
            <div className="paper shrink-0 -rotate-3">
              <div className="surface p-1.5">
                <img
                  src={user.memberPortraitUrl}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover"
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-base text-[var(--text)] truncate">
                {user.memberName}
              </p>
              <p className="font-soft text-sm text-[var(--text-muted)]">
                {user.memberRank}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="gel hover-bounce inline-flex items-center gap-2 px-4 py-2 font-display font-bold text-sm text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation"
            style={{ "--gel-color": "#e8607a" } as CSSProperties}
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Sign Out
          </button>
        </>
      )}
    </SettingsCard>
  );
}
