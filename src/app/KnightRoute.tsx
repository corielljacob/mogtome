import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";
import { InkIcon } from "@/shared/ui/icons/InkIcon";
import wizardMoogle from "@/assets/moogles/wizard moogle.webp";
import "./knight-access.css";

interface KnightRouteProps {
  children: ReactNode;
}

function KnightPortrait({ src }: { src: string }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  return (
    <span className="knight-access-portrait" aria-hidden="true">
      <InkIcon name="user" size={25} />
      {src && failedSrc !== src && (
        <img src={src} alt="" onError={() => setFailedSrc(src)} />
      )}
    </span>
  );
}

// Gates the dashboard behind permanent or temporary knighthood.
export function KnightRoute({ children }: KnightRouteProps) {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const hasKnighthood = user?.hasKnighthood || user?.hasTemporaryKnighthood;

  if (isLoading) {
    return (
      <div className="knight-access">
        <div className="knight-access-loading" role="status">
          <span className="knight-access-loading-mark" aria-hidden="true">
            <InkIcon name="shield" size={28} />
          </span>
          <h1>Checking your access</h1>
          <p>One moment while we check your knighthood.</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && hasKnighthood) return <>{children}</>;

  return (
    <section className="knight-access" aria-labelledby="knight-access-title">
      <div className="knight-access-topline">
        <p className="knight-access-eyebrow">
          <InkIcon name="shield" size={18} /> Kupo Life · Knight dashboard
        </p>
        <Link to="/" className="knight-access-home">
          <InkIcon name="arrow-left" size={16} /> Back to home
        </Link>
      </div>

      <div className="knight-access-body">
        <div className="knight-access-copy">
          <h1 id="knight-access-title">
            {isAuthenticated ? "Knighthood needed" : "Knights only"}
          </h1>
          <p className="knight-access-description">
            {isAuthenticated
              ? "You’re signed in, but this account doesn’t have Knight access. This dashboard is for Moogle Knights and members with temporary knighthood."
              : "Sign in with Discord to open the Knight dashboard. You’ll need permanent or temporary knighthood."}
          </p>

          {isAuthenticated ? (
            <>
              {user && (
                <div className="knight-access-identity">
                  <KnightPortrait src={user.memberPortraitUrl} />
                  <div>
                    <span>Signed in as</span>
                    <h2>{user.memberName || "FC member"}</h2>
                    <p>{user.memberRank || "Rank not available"}</p>
                  </div>
                </div>
              )}
              <div className="knight-access-actions">
                <Link to="/profile" className="knight-access-button">
                  <InkIcon name="user" size={20} />
                  View my profile
                  <InkIcon name="arrow-right" size={18} />
                </Link>
              </div>
              <p className="knight-access-help">
                Already a Knight? Ask the crew to check your linked character
                and rank.
                <Link to="/about">
                  Meet the crew <InkIcon name="arrow-right" size={15} />
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="knight-access-actions">
                <button
                  type="button"
                  onClick={login}
                  className="knight-access-button"
                >
                  <DiscordIcon width={22} height={22} focusable="false" />
                  Sign in with Discord
                  <InkIcon name="arrow-right" size={18} />
                </button>
              </div>
              <p className="knight-access-eligibility">
                <InkIcon name="check" size={16} />
                Moogle Knights and members with temporary knighthood can use
                this page.
              </p>
            </>
          )}
        </div>

        <figure className="knight-access-keepsake">
          <span className="knight-access-tape" aria-hidden="true" />
          <div className="knight-access-art">
            <InkIcon
              name="sparkle"
              size={26}
              className="knight-access-sparkle"
            />
            <img src={wizardMoogle} alt="A moogle wizard guarding the page" />
          </div>
          <span className="knight-access-seal" aria-hidden="true">
            <InkIcon name="shield" size={25} />
          </span>
        </figure>
      </div>

      <footer className="knight-access-footer">
        <InkIcon name="album" size={19} />
        <span>Looking for everyone?</span>
        <Link to="/members">
          Browse Members <InkIcon name="arrow-right" size={16} />
        </Link>
      </footer>
    </section>
  );
}
