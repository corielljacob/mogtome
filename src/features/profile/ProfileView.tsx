import { Fragment } from "react";
import type { CSSProperties } from "react";
import { MembershipCard } from "@/shared/ui/MembershipCard";
import { KawaiiHeart } from "@/shared/ui/kawaiiMotifs";
import { ProfileHero } from "@/features/profile/ProfileHero";
import { ProfileBio } from "@/features/profile/ProfileBio";
import lilGuyMoogle from "@/assets/moogles/lil guy moogle.webp";
import type {
  ProfileData,
  ProfileViewer,
  BiographySubmission,
} from "@/shared/types";

interface ProfileViewProps {
  profile: ProfileData;
  viewer: ProfileViewer;
  submission: BiographySubmission | null;
  onSubmissionUpdate: () => void;
  isBioLoading: boolean;
}

// Presentational shell, pure: renders from { profile, viewer }, no routes/auth,
// so it serves both your own profile and any member's later. Sections come from
// a registry (order is data, not JSX) - adding one is a single entry, and each
// must render null when it has nothing to show (no "coming soon" placeholders).
export function ProfileView({
  profile,
  viewer,
  submission,
  onSubmissionUpdate,
  isBioLoading,
}: ProfileViewProps) {
  const sections = [
    {
      key: "bio",
      render: () => (
        <ProfileBio
          profile={profile}
          viewer={viewer}
          submission={submission}
          onSubmissionUpdate={onSubmissionUpdate}
          isBioLoading={isBioLoading}
        />
      ),
    },
    // future slots - build the component, then add its entry here. each must
    // return null when empty (no FOMO placeholders), e.g.:
    // { key: "achievements",    render: () => <ProfileAchievements profile={profile} /> },
    // { key: "activity",        render: () => <ProfileActivity profile={profile} /> },
    // { key: "personalization", render: () => <ProfilePersonalization profile={profile} viewer={viewer} /> },
  ];

  return (
    <div className="corkboard relative px-3.5 py-7 sm:px-6 sm:py-9 md:px-8 md:py-10">
      <span
        className="pushpin absolute top-3 left-3 sm:top-4 sm:left-4 z-20"
        aria-hidden="true"
      />
      <span
        className="pushpin absolute top-3 right-3 sm:top-4 sm:right-4 z-20"
        style={{ "--pin": "var(--secondary)" } as CSSProperties}
        aria-hidden="true"
      />
      <span
        className="pushpin absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20"
        style={{ "--pin": "var(--accent)" } as CSSProperties}
        aria-hidden="true"
      />
      <span
        className="pushpin absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20"
        style={{ "--pin": "var(--secondary)" } as CSSProperties}
        aria-hidden="true"
      />

      <img
        src={lilGuyMoogle}
        alt=""
        aria-hidden="true"
        className="hidden lg:block absolute -top-7 -right-4 w-20 rotate-[10deg] animate-[float-gentle_4s_ease-in-out_infinite] pointer-events-none select-none z-20"
      />

      <ProfileHero profile={profile} />

      <div className="space-y-7 sm:space-y-9 mt-8 sm:mt-10">
        {sections.map((s) => (
          <Fragment key={s.key}>{s.render()}</Fragment>
        ))}

        {/* brings its own chrome - pinned but not re-wrapped in a surface */}
        <section className="paper relative">
          <span
            className="pushpin absolute -top-2 left-8 z-10"
            style={{ "--pin": "var(--primary)" } as CSSProperties}
            aria-hidden="true"
          />
          <MembershipCard
            name={profile.name}
            rank={profile.rank}
            avatarUrl={profile.avatarUrl}
            characterId={profile.characterId}
            memberSince={profile.memberSince}
          />
        </section>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center font-soft text-xs text-[var(--text-subtle)] mt-9">
        <KawaiiHeart className="w-3.5 h-3.5 text-[var(--primary)]" />
        {viewer.isOwnProfile
          ? "This is your corner of Kupo Life, kupo~"
          : "A fellow member of Kupo Life, kupo~"}
      </p>
    </div>
  );
}
