import { useParams } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useProfile } from "@/features/profile/useProfile";
import { PageLayout, LoadingState, ErrorState } from "@/shared/ui/PageShell";
import { ProfileView } from "@/features/profile/ProfileView";
import { DiscordIcon } from "@/shared/ui/DiscordIcon";
import type { ProfileTarget } from "@/shared/types";
import mailMoogle from "@/assets/moogles/moogle mail.webp";
import "@/shared/styles/journal.css";

// Route and authentication logic stay separate from the profile presentation.
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

  if (target === "me" && !isLoading && !viewer.isAuthenticated) {
    return (
      <div className="journal-auth-gate">
        <div className="journal-auth-card">
          <span className="journal-auth-star" aria-hidden="true">
            ✦
          </span>
          <span className="journal-auth-tape" aria-hidden="true" />
          <div className="journal-auth-art profile-signin-art">
            <img src={mailMoogle} alt="A moogle carrying a letter" />
          </div>
          <h1>Your profile</h1>
          <p className="journal-auth-description">
            Sign in with Discord to see your membership card and edit your bio.
          </p>
          <button onClick={login} className="journal-discord-button">
            <DiscordIcon className="w-5 h-5" />
            Sign in with Discord
          </button>
        </div>
      </div>
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
          message="We couldn't load this profile."
          onRetry={() => window.location.reload()}
        />
      </PageLayout>
    );
  }
  return (
    <PageLayout>
      <div className="journal-page journal-profile">
        <ProfileView
          profile={profile}
          viewer={viewer}
          submission={submission}
          onSubmissionUpdate={refetchSubmission}
          isBioLoading={isBioLoading}
        />
      </div>
    </PageLayout>
  );
}
