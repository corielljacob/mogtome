import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Send, 
  Check, 
  AlertCircle, 
  Loader2,
  Calendar,
  Clock,
  Pencil,
  XCircle,
  Shield,
  Globe,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { biographyApi } from '../api/biography';
import { membersApi } from '../api/members';
import { MembershipCard, MobileSheet, DiscordIcon } from '../components';
import { getRankColor } from '../constants';
import { useIsMobile } from '../hooks';

const MAX_BIO_LENGTH = 300;

import type { BiographySubmission } from '../types';

/**
 * ProfileHeader - The main profile display section showing the user's identity
 * Now includes inline biography editing for better UX
 * Mobile: Uses bottom sheet for editing, larger touch targets
 * 
 * PERFORMANCE: Memoized to prevent re-renders when parent state changes
 */
const ProfileHeader = memo(function ProfileHeader({
  name,
  rank,
  avatarUrl,
  biography,
  memberSince,
  characterId,
  isEditing,
  onEditClick,
  onBiographyChange,
  canSetDirectly,
  pendingSubmission,
  onSubmissionUpdate,
  isLoadingSubmission,
  isLoadingBiography,
}: {
  name: string;
  rank: string;
  avatarUrl: string;
  biography: string;
  memberSince?: Date;
  characterId?: string;
  isEditing: boolean;
  onEditClick: () => void;
  onBiographyChange: (bio: string) => void;
  canSetDirectly: boolean;
  pendingSubmission?: BiographySubmission | null;
  onSubmissionUpdate: () => void;
  isLoadingSubmission: boolean;
  isLoadingBiography: boolean;
}) {
  const isMobile = useIsMobile();
  const rankColor = getRankColor(rank);
  const lodestoneUrl = characterId
    ? `https://na.finalfantasyxiv.com/lodestone/character/${characterId}`
    : null;

  const formattedDate = memberSince
    ? memberSince.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;
  
  // Shorter date format for mobile
  const formattedDateShort = memberSince
    ? memberSince.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <>
      <div className="relative">
        {/* Profile card */}
        <div className="border border-[var(--border)] rounded-lg bg-[var(--card)] overflow-hidden">
          {/* Rank accent bar */}
          <div className="h-1" style={{ backgroundColor: rankColor.hex }} />

          <div className="p-4 sm:p-6">
            <div className="flex gap-4 sm:gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt=""
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-[var(--border)]"
                />
                {lodestoneUrl && (
                  <a
                    href={lodestoneUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center w-7 h-7 rounded-full bg-[var(--card)] border border-[var(--border)] hover:text-[var(--primary)] transition-colors"
                    aria-label="View Lodestone profile"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Name, rank, date */}
              <div className="min-w-0 flex-1">
                <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--text)] mb-1.5">
                  {name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-soft font-medium ${rankColor.bg} ${rankColor.text}`}>
                    <Shield className="w-3 h-3" />
                    {rank}
                  </span>
                  
                  {formattedDate && (
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <Calendar className="w-3 h-3" />
                      <span className="sm:hidden">Since {formattedDateShort}</span>
                      <span className="hidden sm:inline">Since {formattedDate}</span>
                    </span>
                  )}
                </div>

                {/* Biography */}
                {isLoadingBiography ? (
                  <p className="text-sm text-[var(--text-muted)]">Loading biography…</p>
                ) : biography ? (
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed italic">
                    "{biography}"
                  </p>
                ) : (
                  <p className="text-sm text-[var(--text-subtle)] italic">
                    No biography yet.
                  </p>
                )}

                {/* Edit button */}
                {!isLoadingBiography && (
                  <button
                    onClick={onEditClick}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-soft text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none rounded"
                  >
                    <Pencil className="w-3 h-3" />
                    {biography ? 'Edit' : 'Add biography'}
                  </button>
                )}
              </div>
            </div>

            {/* Desktop inline editor */}
            {isEditing && !isMobile && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                {isLoadingSubmission ? (
                  <p className="text-sm text-[var(--text-muted)]">Loading…</p>
                ) : (
                  <BiographyEditor 
                    canSetDirectly={canSetDirectly}
                    onBiographyChange={onBiographyChange}
                    initialBiography={biography}
                    pendingSubmission={pendingSubmission}
                    onSubmissionUpdate={onSubmissionUpdate}
                    onCancel={onEditClick}
                    compact
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet for bio editing */}
      <MobileSheet
        isOpen={isEditing && isMobile}
        onClose={onEditClick}
        title={biography ? 'Edit Biography' : 'Add Biography'}
      >
        {isLoadingSubmission ? (
          <p className="text-sm text-[var(--text-muted)] py-4">Loading…</p>
        ) : (
          <BiographyEditor 
            canSetDirectly={canSetDirectly}
            onBiographyChange={onBiographyChange}
            initialBiography={biography}
            pendingSubmission={pendingSubmission}
            onSubmissionUpdate={onSubmissionUpdate}
            onCancel={onEditClick}
            compact={false}
            isMobile
          />
        )}
      </MobileSheet>
    </>
  );
});

/**
 * BiographyEditor - Form for editing/submitting biography
 * Supports both standalone and compact inline modes
 * Mobile mode: Larger inputs, better touch targets, optimized for keyboard
 * 
 * PERFORMANCE: Memoized to prevent re-renders
 */
const BiographyEditor = memo(function BiographyEditor({ 
  canSetDirectly, 
  onBiographyChange,
  initialBiography,
  pendingSubmission,
  onSubmissionUpdate,
  onCancel,
  compact = false,
  isMobile = false,
}: { 
  canSetDirectly: boolean;
  onBiographyChange: (biography: string) => void;
  initialBiography: string;
  pendingSubmission?: BiographySubmission | null;
  onSubmissionUpdate?: () => void;
  onCancel?: () => void;
  compact?: boolean;
  isMobile?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus textarea on mobile when sheet opens
  useEffect(() => {
    if (isMobile && textareaRef.current) {
      // Small delay to ensure the sheet animation has started
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);
  const queryClient = useQueryClient();
  const [biography, setBiography] = useState(initialBiography || '');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hasPendingSubmission = pendingSubmission?.status === 'Pending';
  const hasRejectedSubmission = pendingSubmission?.status === 'Rejected';

  // Sync with initial biography or pending submission ONLY on mount or when pending submission changes
  // We use a ref to track if this is the initial mount to avoid overwriting user edits
  useEffect(() => {
    if (hasPendingSubmission && pendingSubmission?.biography) {
      setBiography(pendingSubmission.biography);
    } else {
      setBiography(initialBiography);
    }
    // Only run when the editor opens (initialBiography changes from parent) or pending submission changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPendingSubmission, pendingSubmission?.biography]);

  // Mutation for Knights setting biography directly
  const setBiographyMutation = useMutation({
    mutationFn: (bio: string) => biographyApi.setBiography(bio),
    onSuccess: () => {
      setSuccessMessage('Biography updated!');
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      // Auto-close after success in compact mode
      if (compact && onCancel) {
        setTimeout(() => onCancel(), 1500);
      } else {
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    },
  });

  // Mutation for Paissa submitting biography for approval
  const submitBiographyMutation = useMutation({
    mutationFn: (bio: string) => biographyApi.submitBiography(bio),
    onSuccess: () => {
      setSuccessMessage('Submitted for review!');
      onSubmissionUpdate?.();
      if (compact && onCancel) {
        setTimeout(() => onCancel(), 1500);
      } else {
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    },
  });

  // Mutation for editing a pending submission
  const editSubmissionMutation = useMutation({
    mutationFn: (bio: string) => 
      biographyApi.editSubmission(pendingSubmission!.submissionId, bio),
    onSuccess: () => {
      setSuccessMessage('Submission updated!');
      onSubmissionUpdate?.();
      if (compact && onCancel) {
        setTimeout(() => onCancel(), 1500);
      } else {
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    },
  });

  // Determine which mutation to use
  const getActiveMutation = () => {
    if (canSetDirectly) return setBiographyMutation;
    if (hasPendingSubmission) return editSubmissionMutation;
    return submitBiographyMutation;
  };

  const activeMutation = getActiveMutation();
  const isSubmitting = activeMutation.isPending;
  const error = activeMutation.error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biography.trim() || isSubmitting) return;
    activeMutation.mutate(biography.trim());
  };

  const handleBiographyChange = (value: string) => {
    setBiography(value);
    onBiographyChange(value);
  };

  const charactersRemaining = MAX_BIO_LENGTH - biography.length;
  const isOverLimit = charactersRemaining < 0;

  // Determine button text
  const getButtonText = () => {
    if (canSetDirectly) return compact ? 'Save' : 'Update Biography';
    if (hasPendingSubmission) return compact ? 'Update' : 'Update Pending Submission';
    return compact ? 'Submit' : 'Submit for Approval';
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-3' : 'space-y-4'}>
      {/* Status banners - more compact in inline mode */}
      {hasPendingSubmission && (
        <div className={`flex items-center gap-2 ${compact ? 'p-2' : 'p-3'} rounded-lg bg-amber-500/10 border border-amber-500/20`}>
          <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" aria-hidden="true" />
          <p className="text-xs font-soft text-amber-600 dark:text-amber-400">
            {compact ? 'Pending review - you can still edit' : 'You have a biography awaiting approval. You can edit it below until it\'s reviewed.'}
          </p>
        </div>
      )}

      {hasRejectedSubmission && (
        <div className={`flex items-center gap-2 ${compact ? 'p-2' : 'p-3'} rounded-lg bg-red-500/10 border border-red-500/20`}>
          <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" aria-hidden="true" />
          <p className="text-xs font-soft text-red-600 dark:text-red-400">
            {compact ? 'Not approved - please revise' : 'Your previous biography submission was not approved. Please revise and resubmit below.'}
          </p>
        </div>
      )}

      {/* Biography textarea */}
      <div>
        <textarea
          ref={textareaRef}
          id="biography"
          value={biography}
          onChange={(e) => handleBiographyChange(e.target.value)}
          placeholder="Tell us about yourself, kupo~ What brings you to Kupo Life? What do you enjoy doing in Eorzea?"
          rows={isMobile ? 6 : compact ? 4 : 6}
          maxLength={MAX_BIO_LENGTH + 50}
          disabled={isSubmitting}
          autoFocus={compact && !isMobile}
          className={`
            w-full px-4 py-4 sm:py-3
            bg-[var(--bg)] border-2 rounded-lg sm:rounded-xl
            font-soft text-base leading-relaxed text-[var(--text)]
            placeholder:text-[var(--text-muted)]/60
            focus:outline-none focus:border-[var(--primary)]
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            transition-all duration-200
            ${isOverLimit 
              ? 'border-red-500' 
              : 'border-[var(--border)] sm:hover:border-[var(--primary)]/50'
            }
          `}
          style={{ fontSize: '16px' }} // Prevents iOS zoom on focus
        />
        
        {/* Character count and info */}
        <div className="flex justify-between items-center mt-3 sm:mt-2 px-1">
          {!canSetDirectly && !hasPendingSubmission && !hasRejectedSubmission ? (
            <p className="text-xs text-[var(--text-subtle)]">
              Will be reviewed by a Knight
            </p>
          ) : (
            <div />
          )}
          <span className={`text-sm sm:text-xs font-soft font-medium ${
            isOverLimit 
              ? 'text-red-500' 
              : charactersRemaining < 50 
                ? 'text-amber-500' 
                : 'text-[var(--text-muted)]'
          }`}>
            {charactersRemaining} / {MAX_BIO_LENGTH}
          </span>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" aria-hidden="true" />
          <p className="text-xs text-green-600 dark:text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" aria-hidden="true" />
          <p className="text-xs text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className={`flex gap-2 ${compact && !isMobile ? '' : 'flex-col sm:flex-row'}`}>
        {onCancel && !isMobile && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-3 py-1.5 rounded-lg font-soft text-sm text-[var(--text-muted)] hover:bg-[var(--bg)] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!biography.trim() || isOverLimit || isSubmitting}
          className="
            flex items-center justify-center gap-1.5
            px-4 py-2 rounded-lg
            font-soft font-medium text-sm
            bg-[var(--primary)] text-white cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:brightness-110 transition-all
            focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:outline-none
          "
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <>
              {hasPendingSubmission ? (
                <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {getButtonText()}
            </>
          )}
        </button>
      </div>
    </form>
  );
});

/**
 * Profile Page - Your personal FC profile and membership card
 * 
 * Currently focused on viewing your card and updating your bio.
 * In the future, this will become a full public profile page that others can view.
 */
export function Profile() {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const queryClient = useQueryClient();
  const [previewBiography, setPreviewBiography] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Only permanent knights can set biography directly - temp knights still submit for approval
  const canSetBiographyDirectly = user?.hasKnighthood === true;
  
  // Memoize callback for biography change
  const handleBiographyChange = useCallback((bio: string) => setPreviewBiography(bio), []);

  // Fetch staff list to find user's existing bio
  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: ['staff'],
    queryFn: () => membersApi.getStaff(),
    enabled: isAuthenticated && !!user?.memberName,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch user's current submission (pending or most recent approved)
  const { 
    data: userSubmission, 
    refetch: refetchSubmission,
    isLoading: isLoadingSubmission,
  } = useQuery({
    queryKey: ['user-submission', user?.discordId],
    queryFn: () => biographyApi.getSubmission(user!.discordId),
    enabled: isAuthenticated && !!user?.discordId && !canSetBiographyDirectly,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Callback to refetch submission after updates
  const handleSubmissionUpdate = useCallback(() => {
    refetchSubmission();
    queryClient.invalidateQueries({ queryKey: ['user-submission'] });
  }, [refetchSubmission, queryClient]);

  // Find the current user in the staff list to get their existing biography and character ID
  const currentUserStaff = staffData?.staff.find(
    (member) => member.name === user?.memberName
  );
  const existingBiography = currentUserStaff?.biography || '';
  const characterId = currentUserStaff?.characterId;

  // Memoize callback for edit button - resets preview when cancelling
  const handleEditClick = useCallback(() => {
    setIsEditingBio(prev => {
      if (prev) {
        // Closing editor (cancel) - reset preview to existing biography
        setPreviewBiography(existingBiography);
      }
      return !prev;
    });
  }, [existingBiography]);

  // Update preview biography when existing bio loads
  useEffect(() => {
    if (existingBiography && !previewBiography) {
      setPreviewBiography(existingBiography);
    }
  }, [existingBiography, previewBiography]);

  // Show login prompt if not authenticated
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 px-4">
        <div className="text-center max-w-xs">
          <h1 className="font-display font-bold text-lg text-[var(--text)] mb-2">Your Profile</h1>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Sign in with Discord to view your membership card and manage your biography.
          </p>
          <button
            onClick={login}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] text-white font-soft font-medium text-sm cursor-pointer hover:bg-[#4752C4] transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <DiscordIcon className="w-4 h-4" />
            Sign in with Discord
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <p className="text-sm text-[var(--text-muted)]">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pt-[calc(4rem+env(safe-area-inset-top)+1.5rem)] sm:pt-[calc(4rem+env(safe-area-inset-top)+2rem)] md:pt-8 pb-[calc(5rem+env(safe-area-inset-bottom)+1.5rem)] sm:pb-[calc(5rem+env(safe-area-inset-bottom)+2rem)] md:pb-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="font-display font-bold text-lg text-[var(--text)]">My Profile</h1>

        {/* Profile Header */}
        <ProfileHeader
          name={user?.memberName || ''}
          rank={user?.memberRank || ''}
          avatarUrl={user?.memberPortraitUrl || ''}
          biography={previewBiography || existingBiography}
          memberSince={user?.firstLoginDate ? new Date(user.firstLoginDate) : undefined}
          characterId={characterId}
          isEditing={isEditingBio}
          onEditClick={handleEditClick}
          onBiographyChange={handleBiographyChange}
          canSetDirectly={canSetBiographyDirectly}
          pendingSubmission={userSubmission}
          onSubmissionUpdate={handleSubmissionUpdate}
          isLoadingSubmission={isLoadingSubmission}
          isLoadingBiography={isLoadingStaff}
        />

        {/* Membership Card */}
        <section>
          <h2 className="font-display font-semibold text-sm text-[var(--text)] mb-3">Membership Card</h2>
          <MembershipCard
            name={user?.memberName || ''}
            rank={user?.memberRank || ''}
            avatarUrl={user?.memberPortraitUrl || ''}
            characterId={characterId}
            memberSince={user?.firstLoginDate ? new Date(user.firstLoginDate) : undefined}
          />
        </section>
      </div>
    </div>
  );
}
