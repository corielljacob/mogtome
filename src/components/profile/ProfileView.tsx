import { Fragment } from "react";
import type { CSSProperties } from "react";
import { MembershipCard } from "../MembershipCard";
import { KawaiiHeart } from "../kawaiiMotifs";
import { ProfileHero } from "./ProfileHero";
import { ProfileBio } from "./ProfileBio";
import lilGuyMoogle from "../../assets/moogles/lil guy moogle.webp";
import type { ProfileData, ProfileViewer, BiographySubmission } from "../../types";

interface ProfileViewProps {
  profile: ProfileData;
  viewer: ProfileViewer;
  submission: BiographySubmission | null;
  onSubmissionUpdate: () => void;
  isBioLoading: boolean;
}

/**
 * ProfileView — the presentational shell. Pure: it renders an identity from
 * `{ profile, viewer }` and knows nothing about routes or auth, so the same
 * component serves your own profile today and any member's profile later.
 *
 * Sections are driven by a registry (order is data, not JSX): adding a future
 * section is one entry once its component exists. Each section must render
 * nothing when it has nothing to show — no "coming soon" placeholders.
 */
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
    // FUTURE SLOTS — build the component, then add its entry here. Each section
    // must return null when it has nothing to show (no FOMO placeholders), e.g.:
    // { key: "achievements",    render: () => <ProfileAchievements profile={profile} /> },
    // { key: "activity",        render: () => <ProfileActivity profile={profile} /> },
    // { key: "personalization", render: () => <ProfilePersonalization profile={profile} viewer={viewer} /> },
  ];

  return (
    <div className="corkboard relative px-3.5 py-7 sm:px-6 sm:py-9 md:px-8 md:py-10">
      {/* Corner pins */}
      <span className="pushpin absolute top-3 left-3 sm:top-4 sm:left-4 z-20" aria-hidden="true" />
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

      {/* Corner-peek moogle */}
      <img
        src={lilGuyMoogle}
        alt=""
        aria-hidden="true"
        className="hidden lg:block absolute -top-7 -right-4 w-20 rotate-[10deg] animate-[float-gentle_4s_ease-in-out_infinite] pointer-events-none select-none z-20"
      />

      <ProfileHero profile={profile} />

      {/* Sections */}
      <div className="space-y-7 sm:space-y-9 mt-8 sm:mt-10">
        {sections.map((s) => (
          <Fragment key={s.key}>{s.render()}</Fragment>
        ))}

        {/* Membership card — its own chrome, so it's pinned but not re-wrapped in a surface */}
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

      {/* Footer note */}
      <p className="flex items-center justify-center gap-1.5 text-center font-soft text-xs text-[var(--text-subtle)] mt-9">
        <KawaiiHeart className="w-3.5 h-3.5 text-[var(--primary)]" />
        {viewer.isOwnProfile
          ? "This is your corner of Kupo Life, kupo~"
          : "A fellow member of Kupo Life, kupo~"}
      </p>
    </div>
  );
}
