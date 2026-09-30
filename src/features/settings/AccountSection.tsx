import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";
import { SettingsCard } from "./SettingsControls";
import { SettingsIcon } from "./SettingsIcons";
import "./settings-comfort.css";

function AccountPortrait({ src }: { src: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return (
    <div className="settings-account-portrait" aria-hidden="true">
      {src && failedSource !== src ? (
        <img src={src} alt="" onError={() => setFailedSource(src)} />
      ) : (
        <span className="settings-account-portrait-fallback">
          <SettingsIcon name="user" size={34} />
        </span>
      )}
      <span className="settings-account-photo-caption">Kupo Life</span>
    </div>
  );
}

export function AccountSection() {
  const { user, login, logout, isLoading, isAuthenticated } = useAuth();
  const signInButton = useRef<HTMLButtonElement>(null);
  const pendingSignOut = useRef<HTMLButtonElement | null>(null);
  const signedIn = Boolean(isAuthenticated && user);

  useEffect(() => {
    if (isLoading || signedIn || !pendingSignOut.current) return;
    const trigger = pendingSignOut.current;
    pendingSignOut.current = null;
    if (
      document.activeElement === trigger ||
      (!trigger.isConnected && document.activeElement === document.body)
    ) {
      signInButton.current?.focus();
    }
  }, [isLoading, signedIn]);

  return (
    <SettingsCard
      icon="user"
      title="Account"
      description="Your account and membership."
    >
      {isLoading ? (
        <p className="settings-account-loading" role="status">
          <SettingsIcon name="user" size={21} /> Checking your sign-in…
        </p>
      ) : !isAuthenticated || !user ? (
        <div className="settings-account-signed-out">
          <div className="settings-account-discord-mark" aria-hidden="true">
            <DiscordIcon />
          </div>
          <div>
            <h3>You're signed out.</h3>
            <p className="settings-description">
              Sign in with Discord to open your profile and edit your bio.
            </p>
          </div>
          <button
            ref={signInButton}
            className="settings-button settings-account-login"
            type="button"
            onClick={login}
          >
            <DiscordIcon /> Sign in with Discord
          </button>
        </div>
      ) : (
        <>
          <div className="settings-account-identity">
            <AccountPortrait src={user.memberPortraitUrl} />
            <div className="settings-account-details">
              <p className="settings-account-connection">
                <DiscordIcon /> Signed in with Discord
              </p>
              <h3>{user.memberName || "FC member"}</h3>
              {user.memberRank && (
                <p className="settings-account-rank">{user.memberRank}</p>
              )}
            </div>
          </div>
          <div className="settings-account-actions">
            <Link className="settings-button" to="/profile">
              View my profile <SettingsIcon name="arrow-right" size={17} />
            </Link>
            <button
              className="settings-button settings-account-logout"
              type="button"
              onClick={(event) => {
                pendingSignOut.current = event.currentTarget;
                logout();
              }}
            >
              <SettingsIcon name="logout" size={17} /> Sign out
            </button>
          </div>
        </>
      )}
    </SettingsCard>
  );
}
