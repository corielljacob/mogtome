import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Check,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  Inbox,
  Clock,
  User,
} from "lucide-react";
import { biographyApi } from "@/api/biography";
import { membersApi } from "@/api/members";
import type { BiographySubmission, StaffMember } from "@/types";
import { ContentCard } from "@/shared/ui/ContentCard";
import { Tag } from "@/shared/ui/Tag";
import { Button, IconButton } from "@/shared/ui/Button";

interface SubmissionCardProps {
  submission: BiographySubmission;
  submitter?: StaffMember;
  onApprove: (submissionId: string) => void;
  onReject: (submissionId: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

function SubmissionCard({
  submission,
  submitter,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: SubmissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const submittedDate = new Date(submission.submittedAt);
  const formattedDate = submittedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = submittedDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const biographyPreview =
    submission.biography.length > 100
      ? `${submission.biography.slice(0, 100)}...`
      : submission.biography;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="surface p-4 touch-manipulation"
    >
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-3">
        <div className="flex items-center gap-3 sm:gap-2.5 min-w-0">
          {submitter ? (
            <img
              src={submitter.avatarLink}
              alt=""
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl sm:rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl sm:rounded-lg bg-[var(--secondary)]/10 flex items-center justify-center flex-shrink-0">
              <User
                className="w-5 h-5 sm:w-4 sm:h-4 text-[var(--secondary)]"
                aria-hidden="true"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-soft font-semibold text-sm text-[var(--text)] truncate">
              {submitter?.name ||
                `Discord ID: ${submission.submittedByDiscordId}`}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              {submitter && (
                <>
                  <span className="text-[var(--primary)]">
                    {submitter.freeCompanyRank}
                  </span>
                  <span>•</span>
                </>
              )}
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span>
                {formattedDate} at {formattedTime}
              </span>
            </div>
          </div>
        </div>

        <Tag
          color={submission.status === "Pending" ? "var(--warning)" : undefined}
          className="flex-shrink-0"
        >
          {submission.status}
        </Tag>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none rounded-lg p-2 -m-2"
        >
          <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
            {isExpanded ? submission.biography : biographyPreview}
          </p>
          {submission.biography.length > 100 && (
            <span className="text-sm sm:text-xs text-[var(--primary)] mt-2 inline-block font-medium">
              {isExpanded ? "Show less" : "Show more"}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="success"
          size="sm"
          isLoading={isApproving}
          disabled={isApproving || isRejecting}
          onClick={() => onApprove(submission.submissionId)}
          className="flex-1"
        >
          {!isApproving && <Check className="w-4 h-4" aria-hidden="true" />}
          {isApproving ? "Approving..." : "Approve"}
        </Button>
        <Button
          variant="danger"
          size="sm"
          isLoading={isRejecting}
          disabled={isApproving || isRejecting}
          onClick={() => onReject(submission.submissionId)}
          className="flex-1"
        >
          {!isRejecting && <X className="w-4 h-4" aria-hidden="true" />}
          {isRejecting ? "Rejecting..." : "Reject"}
        </Button>
      </div>
    </motion.div>
  );
}

export function PendingSubmissions() {
  const queryClient = useQueryClient();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const {
    data: submissions = [],
    isLoading: isLoadingSubmissions,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["biography-submissions"],
    queryFn: () => biographyApi.getPendingSubmissions(),
    staleTime: 1000 * 30, // 30s
  });

  // staff lookup resolves submitter info by Discord ID
  const { data: staffData } = useQuery({
    queryKey: ["staff"],
    queryFn: () => membersApi.getStaff(),
    staleTime: 1000 * 60 * 5, // 5min
  });

  const staffByDiscordId = new Map(
    (staffData?.staff || [])
      .filter((m) => m.discordId)
      .map((m) => [m.discordId!, m]),
  );

  const pendingSubmissions = submissions.filter((s) => s.status === "Pending");

  const isLoading = isLoadingSubmissions;

  const approveMutation = useMutation({
    mutationFn: (submissionId: string) =>
      biographyApi.approveSubmission(submissionId),
    onMutate: (submissionId) => {
      setApprovingId(submissionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biography-submissions"] });
      // approved bios surface in staff data too
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onSettled: () => {
      setApprovingId(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (submissionId: string) =>
      biographyApi.rejectSubmission(submissionId),
    onMutate: (submissionId) => {
      setRejectingId(submissionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biography-submissions"] });
    },
    onSettled: () => {
      setRejectingId(null);
    },
  });

  const handleApprove = (submissionId: string) => {
    approveMutation.mutate(submissionId);
  };

  const handleReject = (submissionId: string) => {
    rejectMutation.mutate(submissionId);
  };

  return (
    <ContentCard>
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <span className="icon-badge w-10 h-10 shrink-0 text-[var(--primary)]">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-[var(--text)]">
              Pending Biography Submissions
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
              Review and approve member biographies
            </p>
          </div>
        </div>

        <IconButton
          variant="ghost"
          size="md"
          icon={
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
          }
          aria-label="Refresh submissions"
          onClick={() => refetch()}
          disabled={isLoading}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin mb-3" />
          <p className="text-sm text-[var(--text-muted)] font-soft">
            Loading submissions...
          </p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-sm text-[var(--text)] font-soft font-semibold mb-1">
            Failed to load submissions
          </p>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Something went wrong, kupo...
          </p>
          <Button variant="primary" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      ) : pendingSubmissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <div className="icon-badge w-16 h-16 mb-4 text-[var(--secondary)]">
            <Inbox className="w-8 h-8" />
          </div>
          <p className="text-sm text-[var(--text)] font-soft font-semibold mb-1">
            All caught up!
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            No pending biography submissions to review, kupo~
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4 flex-shrink-0">
            <Tag color="var(--warning)">
              {pendingSubmissions.length} pending
            </Tag>
          </div>

          <div className="overflow-y-auto max-h-[400px] sm:max-h-[500px] pr-1 -mr-1 space-y-3 scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent">
            <AnimatePresence mode="popLayout">
              {pendingSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission.submissionId}
                  submission={submission}
                  submitter={staffByDiscordId.get(
                    submission.submittedByDiscordId,
                  )}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isApproving={approvingId === submission.submissionId}
                  isRejecting={rejectingId === submission.submissionId}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* kept outside the scroll area so it stays visible */}
          {(approveMutation.isError || rejectMutation.isError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mt-3 flex-shrink-0"
            >
              <AlertCircle
                className="w-4 h-4 text-red-500 flex-shrink-0"
                aria-hidden="true"
              />
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                Failed to {approveMutation.isError ? "approve" : "reject"}{" "}
                submission. Please try again.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </ContentCard>
  );
}
