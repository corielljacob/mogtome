import { useState } from "react";
import { Sparkles, Pencil, X } from "lucide-react";
import { MobileSheet } from "@/shared/ui/MobileSheet";
import { useIsMobile } from "@/shared/hooks/useMobile";
import { ProfileSection } from "@/features/profile/ProfileSection";
import { BioEditor } from "@/features/profile/BioEditor";
import type {
  ProfileData,
  ProfileViewer,
  BiographySubmission,
} from "@/shared/types";

interface ProfileBioProps {
  profile: ProfileData;
  viewer: ProfileViewer;
  submission: BiographySubmission | null;
  onSubmissionUpdate: () => void;
  /** bio comes from the staff list, still loading */
  isBioLoading: boolean;
}

// owner can edit (knights save directly, others submit for review). editing is
// inline on desktop, in a bottom sheet on mobile.
export function ProfileBio({
  profile,
  viewer,
  submission,
  onSubmissionUpdate,
  isBioLoading,
}: ProfileBioProps) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);

  const bio = profile.biography;
  const canEdit = viewer.canEditBio;
  const editingInline = isEditing && !isMobile;

  const editButton =
    canEdit && !isBioLoading ? (
      <button
        type="button"
        onClick={() => setIsEditing((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm font-soft text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer rounded-md focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
      >
        {editingInline ? (
          <>
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            Close
          </>
        ) : (
          <>
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            {bio ? "Edit" : "Add"}
          </>
        )}
      </button>
    ) : undefined;

  return (
    <ProfileSection
      icon={Sparkles}
      title="About"
      accent="var(--secondary)"
      tilt={0.4}
      action={editButton}
    >
      {editingInline ? (
        <BioEditor
          profile={profile}
          viewer={viewer}
          submission={submission}
          onSubmissionUpdate={onSubmissionUpdate}
          onCancel={() => setIsEditing(false)}
          compact
        />
      ) : isBioLoading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading bio…</p>
      ) : bio ? (
        <p className="font-soft italic text-[15px] leading-relaxed text-[var(--text-muted)]">
          “{bio}”
        </p>
      ) : viewer.isOwnProfile ? (
        <p className="text-sm text-[var(--text-subtle)]">
          Tell the FC a little about yourself.
        </p>
      ) : (
        <p className="text-sm text-[var(--text-subtle)]">No bio yet.</p>
      )}

      <MobileSheet
        isOpen={isEditing && isMobile}
        onClose={() => setIsEditing(false)}
        title={bio ? "Edit bio" : "Add bio"}
      >
        <BioEditor
          profile={profile}
          viewer={viewer}
          submission={submission}
          onSubmissionUpdate={onSubmissionUpdate}
          onCancel={() => setIsEditing(false)}
          isMobile
        />
      </MobileSheet>
    </ProfileSection>
  );
}
