import type { CSSProperties } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { PageLayout, LoadingState, ErrorState } from "@/components/PageShell";
import { ProfileView } from "@/components/profile/ProfileView";
import { DiscordIcon } from "@/components/DiscordIcon";
import type { ProfileTarget } from "@/types";

import mailMoogle from "@/assets/moogles/moogle mail.webp";
import illustratedMoogle from "@/assets/moogles/illustrated moogle.webp";

// thin by design: reads the route (optional `:characterId`, absent → own
// profile), hands the target to useProfile, renders the source-agnostic
// ProfileView. public profiles later = register `/profile/:characterId` + link.
export function Profile() {
  const { characterId } = useParams<{ characterId?: string }>();
  const target: ProfileTarget = characterId ? { characterId } : "me";

  const { login } = useAuth();
  const {
    profile,
    viewer,
    submission,
    isLoading,
    isBioLoading,
    error,
    refetchSubmission,
  } = useProfile(target);

  // Signed out, viewing your own profile → invite a Discord sign-in.
  if (target === "me" && !isLoading && !viewer.isAuthenticated) {
    return (
      <PageLayout maxWidth="max-w-md">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="surface paper -rotate-1 p-7 sm:p-9 text-center max-w-xs">
            <h1 className="font-display font-bold text-xl text-[var(--text)] mb-2">
              Your profile
            </h1>
            <p className="text-sm text-[var(--text-muted)] mb-5">
              Sign in with Discord to see your membership card and write your
              bio, kupo~
            </p>
            <button
              onClick={login}
              className="gel hover-bounce inline-flex items-center gap-2 px-5 py-2.5 font-display font-bold text-sm text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation"
              style={{ "--gel-color": "#5865f2" } as CSSProperties}
            >
              <DiscordIcon className="w-4 h-4" />
              Sign in with Discord
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout maxWidth="max-w-2xl">
        <LoadingState message="Loading your profile…" />
      </PageLayout>
    );
  }

  if (error || !profile) {
    return (
      <PageLayout maxWidth="max-w-2xl">
        <ErrorState
          message="We couldn't load this profile, kupo…"
          onRetry={() => window.location.reload()}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      maxWidth="max-w-2xl"
      moogles={{ primary: mailMoogle, secondary: illustratedMoogle }}
    >
      <ProfileView
        profile={profile}
        viewer={viewer}
        submission={submission}
        onSubmissionUpdate={refetchSubmission}
        isBioLoading={isBioLoading}
      />
    </PageLayout>
  );
}
