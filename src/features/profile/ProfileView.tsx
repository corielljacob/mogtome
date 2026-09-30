import { Fragment } from "react";
import { MembershipCard } from "@/shared/ui/MembershipCard";
import { ProfileHero } from "@/features/profile/ProfileHero";
import { ProfileBio } from "@/features/profile/ProfileBio";
import type {
  ProfileData,
  ProfileViewer,
  BiographySubmission,
} from "@/shared/types";
import "./profile-screen.css";

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
    <div className="profile-screen">
      <ProfileHero profile={profile} />

      {/* on large screens the bio sits beside the membership card so the wide
          page is used; stacks back to one column below lg. */}
      <div className="profile-layout">
        <div className="profile-sections">
          {sections.map((s) => (
            <Fragment key={s.key}>{s.render()}</Fragment>
          ))}
        </div>

        {/* The patch supplies its own fabric surface and stitched edge. */}
        <section className="profile-membership" aria-label="Membership card">
          <MembershipCard
            name={profile.name}
            rank={profile.rank}
            avatarUrl={profile.avatarUrl}
            characterId={profile.characterId}
            memberSince={profile.memberSince}
          />
        </section>
      </div>
    </div>
  );
}
