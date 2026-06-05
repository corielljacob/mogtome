import { memo, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Check, AlertCircle, Clock, XCircle, Pencil } from "lucide-react";
import { biographyApi } from "@/api/biography";
import { Textarea } from "@/components/Input";
import { Button } from "@/components/Button";
import type {
  ProfileData,
  ProfileViewer,
  BiographySubmission,
} from "@/types";

const MAX_BIO_LENGTH = 300;

interface BioEditorProps {
  profile: ProfileData;
  viewer: ProfileViewer;
  submission: BiographySubmission | null;
  onSubmissionUpdate: () => void;
  onCancel?: () => void;
  /** Tighter spacing for the desktop inline editor */
  compact?: boolean;
  /** Rendered inside the mobile bottom sheet (auto-focus, no inline cancel) */
  isMobile?: boolean;
}

// knights save directly; everyone else submits for review (and can keep editing
// a pending submission until approved). mutations invalidate the same ["staff"] /
// ["user-submission"] keys the rest of the app reads, so edits propagate.
export const BioEditor = memo(function BioEditor({
  profile,
  viewer,
  submission,
  onSubmissionUpdate,
  onCancel,
  compact = false,
  isMobile = false,
}: BioEditorProps) {
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [biography, setBiography] = useState(profile.biography || "");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canSetDirectly = viewer.canSetBioDirectly;
  const hasPendingSubmission = submission?.status === "Pending";
  const hasRejectedSubmission = submission?.status === "Rejected";

  // auto-focus only in the mobile sheet
  useEffect(() => {
    if (!isMobile) return;
    const timer = setTimeout(() => textareaRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // seed from the pending submission if there is one, else the saved bio
  useEffect(() => {
    setBiography(
      hasPendingSubmission && submission?.biography
        ? submission.biography
        : profile.biography || "",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPendingSubmission, submission?.biography]);

  const onMutationSuccess = (message: string) => {
    setSuccessMessage(message);
    if (compact && onCancel) {
      setTimeout(() => onCancel(), 1500);
    } else {
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const setBiographyMutation = useMutation({
    mutationFn: (bio: string) => biographyApi.setBiography(bio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      onMutationSuccess("Biography updated!");
    },
  });

  const submitBiographyMutation = useMutation({
    mutationFn: (bio: string) => biographyApi.submitBiography(bio),
    onSuccess: () => {
      onSubmissionUpdate();
      onMutationSuccess("Submitted for review!");
    },
  });

  const editSubmissionMutation = useMutation({
    mutationFn: (bio: string) =>
      biographyApi.editSubmission(submission!.submissionId, bio),
    onSuccess: () => {
      onSubmissionUpdate();
      onMutationSuccess("Submission updated!");
    },
  });

  const activeMutation = canSetDirectly
    ? setBiographyMutation
    : hasPendingSubmission
      ? editSubmissionMutation
      : submitBiographyMutation;

  const isSubmitting = activeMutation.isPending;
  const error = activeMutation.error;

  const charactersRemaining = MAX_BIO_LENGTH - biography.length;
  const isOverLimit = charactersRemaining < 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biography.trim() || isOverLimit || isSubmitting) return;
    activeMutation.mutate(biography.trim());
  };

  const buttonLabel = canSetDirectly
    ? "Save biography"
    : hasPendingSubmission
      ? "Update submission"
      : "Submit for review";

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "space-y-3" : "space-y-4"}
    >
      {hasPendingSubmission && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
          <Clock
            className="w-4 h-4 text-amber-500 shrink-0"
            aria-hidden="true"
          />
          <p className="text-xs font-soft text-amber-600 dark:text-amber-400">
            Awaiting a Knight's review - you can keep editing until then.
          </p>
        </div>
      )}
      {hasRejectedSubmission && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25">
          <XCircle
            className="w-4 h-4 text-red-500 shrink-0"
            aria-hidden="true"
          />
          <p className="text-xs font-soft text-red-600 dark:text-red-400">
            Your last submission wasn't approved. Tweak it and resubmit, kupo~
          </p>
        </div>
      )}

      <div>
        <Textarea
          ref={textareaRef}
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
          placeholder="Tell us about yourself, kupo~ What brings you to Kupo Life? What do you love doing in Eorzea?"
          rows={isMobile ? 6 : compact ? 4 : 6}
          maxLength={MAX_BIO_LENGTH + 50}
          disabled={isSubmitting}
          error={isOverLimit ? "A touch long - trim it to 300." : undefined}
          style={{ fontSize: "16px" }}
        />

        <div className="flex justify-between items-center mt-2 px-1">
          {!canSetDirectly &&
          !hasPendingSubmission &&
          !hasRejectedSubmission ? (
            <p className="text-xs text-[var(--text-subtle)]">
              A Knight will review this before it appears.
            </p>
          ) : (
            <span />
          )}
          <span
            className={`text-xs font-soft font-medium ${
              isOverLimit
                ? "text-red-500"
                : charactersRemaining < 50
                  ? "text-amber-500"
                  : "text-[var(--text-muted)]"
            }`}
          >
            {charactersRemaining} / {MAX_BIO_LENGTH}
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-green-500/10 border border-green-500/25">
          <Check
            className="w-4 h-4 text-green-500 shrink-0"
            aria-hidden="true"
          />
          <p className="text-xs text-green-600 dark:text-green-400">
            {successMessage}
          </p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/25">
          <AlertCircle
            className="w-4 h-4 text-red-500 shrink-0"
            aria-hidden="true"
          />
          <p className="text-xs text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
        </div>
      )}

      <div className={`flex gap-2 ${isMobile ? "flex-col" : "justify-end"}`}>
        {onCancel && !isMobile && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          isLoading={isSubmitting}
          disabled={!biography.trim() || isOverLimit}
        >
          {!isSubmitting &&
            (hasPendingSubmission ? (
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
            ))}
          {buttonLabel}
        </Button>
      </div>
    </form>
  );
});
