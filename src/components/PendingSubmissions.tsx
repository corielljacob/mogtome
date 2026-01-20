import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
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
} from 'lucide-react';
import { biographyApi } from '../api/biography';
import { membersApi } from '../api/members';
import type { BiographySubmission, StaffMember } from '../types';
import { ContentCard } from './ContentCard';

interface SubmissionCardProps {
  submission: BiographySubmission;
  submitter?: StaffMember;
  onApprove: (submissionId: string) => void;
  onReject: (submissionId: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

function SubmissionCard({ submission, submitter, onApprove, onReject, isApproving, isRejecting }: SubmissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format the submission date
  const submittedDate = new Date(submission.submittedAt);
  const formattedDate = submittedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = submittedDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const biographyPreview = submission.biography.length > 100 
    ? `${submission.biography.slice(0, 100)}...` 
    : submission.biography;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="
        bg-[var(--bento-bg)]/50 
        border border-[var(--bento-border)] 
        rounded-2xl sm:rounded-xl p-4 sm:p-4
        sm:hover:border-[var(--bento-primary)]/20
        transition-colors touch-manipulation
      "
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-3">
        <div className="flex items-center gap-3 sm:gap-2.5 min-w-0">
          {submitter ? (
            <img 
              src={submitter.avatarLink} 
              alt="" 
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl sm:rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl sm:rounded-lg bg-[var(--bento-secondary)]/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 sm:w-4 sm:h-4 text-[var(--bento-secondary)]" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
              {submitter?.name || `Discord ID: ${submission.submittedByDiscordId}`}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--bento-text-muted)]">
              {submitter && (
                <>
                  <span className="text-[var(--bento-primary)]">{submitter.freeCompanyRank}</span>
                  <span>•</span>
                </>
              )}
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span>{formattedDate} at {formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <span className={`
          flex-shrink-0 px-2.5 py-1 sm:px-2 sm:py-0.5 rounded-full text-xs font-soft font-medium
          ${submission.status === 'Pending' 
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
            : 'bg-[var(--bento-text-muted)]/10 text-[var(--bento-text-muted)]'
          }
        `}>
          {submission.status}
        </span>
      </div>

      {/* Biography content */}
      <div className="mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-lg p-2 -m-2"
        >
          <p className="text-sm text-[var(--bento-text)] leading-relaxed whitespace-pre-wrap">
            {isExpanded ? submission.biography : biographyPreview}
          </p>
          {submission.biography.length > 100 && (
            <span className="text-sm sm:text-xs text-[var(--bento-primary)] mt-2 inline-block font-medium">
              {isExpanded ? 'Show less' : 'Show more'}
            </span>
          )}
        </button>
      </div>

      {/* Action buttons - larger touch targets on mobile */}
      <div className="flex items-center gap-3 sm:gap-2">
        <button
          onClick={() => onApprove(submission.submissionId)}
          disabled={isApproving || isRejecting}
          className="
            flex-1 flex items-center justify-center gap-2
            px-4 py-3.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg
            bg-green-500 active:bg-green-600 sm:hover:bg-green-600 
            text-white font-soft font-semibold text-sm
            transition-colors cursor-pointer touch-manipulation
            active:scale-[0.97] sm:active:scale-100
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:outline-none
          "
        >
          {isApproving ? (
            <>
              <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 animate-spin" aria-hidden="true" />
              <span className="sm:inline">Approving...</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5 sm:w-4 sm:h-4" aria-hidden="true" />
              Approve
            </>
          )}
        </button>
        <button
          onClick={() => onReject(submission.submissionId)}
          disabled={isApproving || isRejecting}
          className="
            flex-1 flex items-center justify-center gap-2
            px-4 py-3.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-lg
            bg-red-500 active:bg-red-600 sm:hover:bg-red-600 
            text-white font-soft font-semibold text-sm
            transition-colors cursor-pointer touch-manipulation
            active:scale-[0.97] sm:active:scale-100
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none
          "
        >
          {isRejecting ? (
            <>
              <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 animate-spin" aria-hidden="true" />
              <span className="sm:inline">Rejecting...</span>
            </>
          ) : (
            <>
              <X className="w-5 h-5 sm:w-4 sm:h-4" aria-hidden="true" />
              Reject
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/**
 * PendingSubmissions - Knight Dashboard component for reviewing biography submissions
 * 
 * Fetches pending submissions and allows Knights to approve them.
 */
export function PendingSubmissions() {
  const queryClient = useQueryClient();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Fetch pending submissions
  const { 
    data: submissions = [], 
    isLoading: isLoadingSubmissions, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['biography-submissions'],
    queryFn: () => biographyApi.getPendingSubmissions(),
    staleTime: 1000 * 30, // 30 seconds
  });

  // Fetch staff to look up submitter info by Discord ID
  const { data: staffData } = useQuery({
    queryKey: ['staff'],
    queryFn: () => membersApi.getStaff(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create a lookup map from Discord ID to staff member
  const staffByDiscordId = new Map(
    (staffData?.staff || [])
      .filter((m) => m.discordId)
      .map((m) => [m.discordId!, m])
  );

  // Filter to only show pending submissions
  const pendingSubmissions = submissions.filter(s => s.status === 'Pending');
  
  const isLoading = isLoadingSubmissions;

  // Mutation for approving submissions
  const approveMutation = useMutation({
    mutationFn: (submissionId: string) => biographyApi.approveSubmission(submissionId),
    onMutate: (submissionId) => {
      setApprovingId(submissionId);
    },
    onSuccess: () => {
      // Invalidate and refetch submissions
      queryClient.invalidateQueries({ queryKey: ['biography-submissions'] });
      // Also invalidate staff data since approved bios appear there
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
    onSettled: () => {
      setApprovingId(null);
    },
  });

  // Mutation for rejecting submissions
  const rejectMutation = useMutation({
    mutationFn: (submissionId: string) => biographyApi.rejectSubmission(submissionId),
    onMutate: (submissionId) => {
      setRejectingId(submissionId);
    },
    onSuccess: () => {
      // Invalidate and refetch submissions
      queryClient.invalidateQueries({ queryKey: ['biography-submissions'] });
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
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-base sm:text-lg text-[var(--bento-text)]">
              Pending Biography Submissions
            </h2>
            <p className="text-xs sm:text-sm text-[var(--bento-text-muted)] mt-0.5">
              Review and approve member biographies
            </p>
          </div>
        </div>

        {/* Refresh button - larger on mobile */}
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="
            p-3 sm:p-2 rounded-xl sm:rounded-lg
            bg-[var(--bento-bg)] active:bg-[var(--bento-primary)]/10 sm:hover:bg-[var(--bento-primary)]/10
            text-[var(--bento-text-muted)] active:text-[var(--bento-primary)] sm:hover:text-[var(--bento-primary)]
            transition-colors cursor-pointer touch-manipulation
            disabled:opacity-50
            focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
          "
          aria-label="Refresh submissions"
        >
          <RefreshCw className={`w-5 h-5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <Loader2 className="w-8 h-8 text-[var(--bento-primary)] animate-spin mb-3" />
          <p className="text-sm text-[var(--bento-text-muted)] font-soft">
            Loading submissions...
          </p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
          <p className="text-sm text-[var(--bento-text)] font-soft font-semibold mb-1">
            Failed to load submissions
          </p>
          <p className="text-xs text-[var(--bento-text-muted)] mb-4">
            Something went wrong, kupo...
          </p>
          <button
            onClick={() => refetch()}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-[var(--bento-primary)] text-white
              font-soft font-semibold text-sm
              cursor-pointer
              focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none
            "
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      ) : pendingSubmissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bento-secondary)]/10 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-[var(--bento-secondary)]" />
          </div>
          <p className="text-sm text-[var(--bento-text)] font-soft font-semibold mb-1">
            All caught up!
          </p>
          <p className="text-xs text-[var(--bento-text-muted)]">
            No pending biography submissions to review, kupo~
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Count badge */}
          <div className="flex items-center gap-2 mb-4 flex-shrink-0">
            <span className="px-2.5 py-1 rounded-full text-xs font-soft font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {pendingSubmissions.length} pending
            </span>
          </div>

          {/* Scrollable submission cards container */}
          <div className="overflow-y-auto max-h-[400px] sm:max-h-[500px] pr-1 -mr-1 space-y-3 scrollbar-thin scrollbar-thumb-[var(--bento-border)] scrollbar-track-transparent">
            <AnimatePresence mode="popLayout">
              {pendingSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission.submissionId}
                  submission={submission}
                  submitter={staffByDiscordId.get(submission.submittedByDiscordId)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isApproving={approvingId === submission.submissionId}
                  isRejecting={rejectingId === submission.submissionId}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Error message - outside scroll area so it's always visible */}
          {(approveMutation.isError || rejectMutation.isError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mt-3 flex-shrink-0"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                Failed to {approveMutation.isError ? 'approve' : 'reject'} submission. Please try again.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </ContentCard>
  );
}
