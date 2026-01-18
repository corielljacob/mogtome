import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Check, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Inbox,
  Clock,
  User,
} from 'lucide-react';
import { biographyApi } from '../api/biography';
import type { BiographySubmission } from '../types';
import { ContentCard } from './ContentCard';

interface SubmissionCardProps {
  submission: BiographySubmission;
  onApprove: (submissionId: string) => void;
  isApproving: boolean;
}

function SubmissionCard({ submission, onApprove, isApproving }: SubmissionCardProps) {
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

  const bioPreview = submission.biography.length > 100 
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
        rounded-xl p-3 sm:p-4
        hover:border-[var(--bento-primary)]/20
        transition-colors
      "
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--bento-secondary)]/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[var(--bento-secondary)]" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate">
              Discord: {submission.submittedByDiscordId}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[var(--bento-text-muted)]">
              <Clock className="w-3 h-3" aria-hidden="true" />
              <span>{formattedDate} at {formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <span className={`
          flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-soft font-medium
          ${submission.status === 'pending' 
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
          className="w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-lg"
        >
          <p className="text-sm text-[var(--bento-text)] leading-relaxed whitespace-pre-wrap">
            {isExpanded ? submission.biography : bioPreview}
          </p>
          {submission.biography.length > 100 && (
            <span className="text-xs text-[var(--bento-primary)] mt-1 inline-block hover:underline">
              {isExpanded ? 'Show less' : 'Show more'}
            </span>
          )}
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onApprove(submission.submissionId)}
          disabled={isApproving}
          className="
            flex-1 flex items-center justify-center gap-2
            px-3 py-2 rounded-lg
            bg-green-500 hover:bg-green-600 
            text-white font-soft font-semibold text-sm
            transition-colors cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:outline-none
          "
        >
          {isApproving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Approving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              Approve
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

  // Fetch pending submissions
  const { 
    data: submissions = [], 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['biography-submissions'],
    queryFn: () => biographyApi.getPendingSubmissions(),
    staleTime: 1000 * 30, // 30 seconds
  });

  // Filter to only show pending submissions
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

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

  const handleApprove = (submissionId: string) => {
    approveMutation.mutate(submissionId);
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
              Pending Bio Submissions
            </h2>
            <p className="text-xs sm:text-sm text-[var(--bento-text-muted)] mt-0.5">
              Review and approve member biographies
            </p>
          </div>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="
            p-2 rounded-lg
            bg-[var(--bento-bg)] hover:bg-[var(--bento-primary)]/10
            text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)]
            transition-colors cursor-pointer
            disabled:opacity-50
            focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
          "
          aria-label="Refresh submissions"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
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
        <div className="space-y-3">
          {/* Count badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-full text-xs font-soft font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              {pendingSubmissions.length} pending
            </span>
          </div>

          {/* Submission cards */}
          <AnimatePresence mode="popLayout">
            {pendingSubmissions.map((submission) => (
              <SubmissionCard
                key={submission.submissionId}
                submission={submission}
                onApprove={handleApprove}
                isApproving={approvingId === submission.submissionId}
              />
            ))}
          </AnimatePresence>

          {/* Error message */}
          {approveMutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
                Failed to approve submission. Please try again.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </ContentCard>
  );
}
