import { LogIn, Shield, Swords } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";

import wizardMoogle from "@/assets/moogles/wizard moogle.webp";

interface KnightRouteProps {
  children: React.ReactNode;
}

// gates a route behind knighthood - permanent or temporary
export function KnightRoute({ children }: KnightRouteProps) {
  const { user, isAuthenticated, isLoading, login } = useAuth();

  const hasKnighthood = user?.hasKnighthood || user?.hasTemporaryKnighthood;

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center pt-[calc(1rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="w-10 h-10 rounded-full border-3 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] relative pt-[calc(1rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/[0.06] via-[var(--accent)]/[0.03] to-[var(--secondary)]/[0.05] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] px-4 py-8">
          <div className="max-w-md w-full animate-[fadeSlideIn_0.5s_ease-out]">
            <div className="bg-[var(--card)] rounded-lg p-8 md:p-10 border border-[var(--border)] shadow-sm text-center">
              <div className="relative mb-6 animate-[scaleIn_0.5s_ease-out_0.1s_both]">
                <img
                  src={wizardMoogle}
                  alt="A moogle wizard guarding the page"
                  className="relative w-32 md:w-40 mx-auto drop-shadow-lg animate-float-gentle"
                />
              </div>

              <div className="flex justify-center mb-4 animate-[popIn_0.4s_ease-out_0.2s_both]">
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                  <Swords className="w-6 h-6 text-[var(--primary)]" />
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--text)] mb-2 animate-[fadeIn_0.4s_ease-out_0.3s_both]">
                Knights Only, Kupo!
              </h1>

              <p className="text-[var(--text-muted)] font-soft mb-6 animate-[fadeIn_0.4s_ease-out_0.4s_both]">
                This page is reserved for Moogle Knights. Sign in with Discord
                to verify your knighthood.
              </p>

              <button
                onClick={login}
                className="
                  group w-full flex items-center justify-center gap-3
                  px-6 py-4 rounded-lg
                  bg-[#5865F2] text-white
                  font-soft font-semibold text-lg
                  shadow-[2px_2px_0_rgba(88,101,242,0.35)]
                  hover:bg-[#4752C4] hover:shadow-[3px_3px_0_rgba(88,101,242,0.4)]
                  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5865F2] focus-visible:outline-none
                  transition-all duration-150 cursor-pointer
                  hover:-translate-y-px hover:scale-[1.01] active:scale-[0.98]
                  animate-[fadeSlideIn_0.4s_ease-out_0.5s_both]
                "
              >
                <DiscordIcon className="w-6 h-6" />
                <span>Login with Discord</span>
                <LogIn className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            <p className="text-center mt-6 text-sm text-[var(--text-muted)] font-accent animate-[fadeIn_0.4s_ease-out_0.7s_both]">
              ~ The moogle will let you pass once verified ~
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasKnighthood) {
    return (
      <div className="min-h-[100dvh] relative pt-[calc(1rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/[0.06] via-[var(--accent)]/[0.03] to-[var(--secondary)]/[0.05] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] px-4 py-8">
          <div className="max-w-md w-full animate-[fadeSlideIn_0.5s_ease-out]">
            <div className="bg-[var(--card)] rounded-lg p-8 md:p-10 border border-[var(--border)] shadow-sm text-center">
              <div className="relative mb-6 animate-[scaleIn_0.5s_ease-out_0.1s_both]">
                <img
                  src={wizardMoogle}
                  alt="A moogle wizard guarding the page"
                  className="relative w-32 md:w-40 mx-auto drop-shadow-lg animate-float-gentle"
                />
              </div>

              <div className="flex justify-center mb-4 animate-[popIn_0.4s_ease-out_0.2s_both]">
                <div className="w-12 h-12 rounded-2xl bg-[var(--warning)]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[var(--warning)]" />
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--text)] mb-2 animate-[fadeIn_0.4s_ease-out_0.3s_both]">
                Knighthood Required
              </h1>

              <p className="text-[var(--text-muted)] font-soft mb-4 animate-[fadeIn_0.4s_ease-out_0.4s_both]">
                This dashboard is only available to Moogle Knights and those
                with temporary knighthood, kupo!
              </p>

              {user && (
                <div className="bg-[var(--bg)]/50 rounded-lg p-4 mb-4 animate-[fadeIn_0.4s_ease-out_0.5s_both]">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.memberPortraitUrl}
                      alt={user.memberName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="text-left">
                      <p className="font-soft font-semibold text-[var(--text)]">
                        {user.memberName}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        {user.memberRank}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-sm text-[var(--text-subtle)] font-soft animate-[fadeIn_0.4s_ease-out_0.6s_both]">
                If you believe this is an error, please contact an officer.
              </p>
            </div>

            <p className="text-center mt-6 text-sm text-[var(--text-muted)] font-accent animate-[fadeIn_0.4s_ease-out_0.7s_both]">
              ~ Keep striving for knighthood! ~
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
