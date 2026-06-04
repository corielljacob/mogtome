import { useState } from "react";
import { Sparkles, Pencil, X } from "lucide-react";
import { MobileSheet } from "../MobileSheet";
import { useIsMobile } from "../../hooks";
import { ProfileSection } from "./ProfileSection";
import { BioEditor } from "./BioEditor";
import type { ProfileData, ProfileViewer, BiographySubmission } from "../../types";

interface ProfileBioProps {
  profile: ProfileData;
  viewer: ProfileViewer;
  submission: BiographySubmission | null;
  onSubmissionUpdate: () => void;
  /** The biography (staff list) is still loading */
  isBioLoading: boolean;
}

/**
 * ProfileBio — the "About" section. Shows the biography as a handwritten note;
 * the owner can edit it (knights save directly, others submit for review).
 * Editing is self-contained: inline on desktop, in a bottom sheet on mobile.
 */
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
        <p className="text-sm text-[var(--text-muted)]">Loading biography…</p>
      ) : bio ? (
        <p className="font-soft italic text-[15px] leading-relaxed text-[var(--text-muted)]">
          “{bio}”
        </p>
      ) : viewer.isOwnProfile ? (
        <p className="text-sm text-[var(--text-subtle)]">
          You haven't written a bio yet — add a few words about yourself, kupo~
        </p>
      ) : (
        <p className="text-sm text-[var(--text-subtle)]">No biography yet.</p>
      )}

      {/* Mobile editor lives in a bottom sheet */}
      <MobileSheet
        isOpen={isEditing && isMobile}
        onClose={() => setIsEditing(false)}
        title={bio ? "Edit biography" : "Add biography"}
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
