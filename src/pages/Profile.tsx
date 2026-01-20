import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { 
  User, 
  Sparkles, 
  Send, 
  Check, 
  AlertCircle, 
  Loader2,
  Calendar,
  Clock,
  Pencil,
  XCircle,
  Shield,
  Quote,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { biographyApi } from '../api/biography';
import { membersApi } from '../api/members';
import { ContentCard, MembershipCard, StoryDivider, FloatingSparkles, MobileSheet } from '../components';
import { useIsMobile } from '../hooks';

const MAX_BIO_LENGTH = 300;

import type { BiographySubmission } from '../types';

// Rank color config for profile display
const rankColors: Record<string, { bg: string; text: string; hex: string }> = {
  'Moogle Guardian': { bg: 'bg-[#2FECE6]/10', text: 'text-[#2FECE6]', hex: '#2FECE6' },
  'Moogle Knight': { bg: 'bg-[#8E42CC]/10', text: 'text-[#8E42CC]', hex: '#8E42CC' },
  'Paissa Trainer': { bg: 'bg-[#068167]/10', text: 'text-[#068167]', hex: '#068167' },
  'Coeurl Hunter': { bg: 'bg-[#056D04]/10', text: 'text-[#056D04]', hex: '#056D04' },
  'Mandragora': { bg: 'bg-[#E67E22]/10', text: 'text-[#E67E22]', hex: '#E67E22' },
  'Apkallu Seeker': { bg: 'bg-[#4D88BB]/10', text: 'text-[#4D88BB]', hex: '#4D88BB' },
  'Kupo Shelf': { bg: 'bg-[#5ABE32]/10', text: 'text-[#5ABE32]', hex: '#5ABE32' },
  'Bom Boko': { bg: 'bg-stone-400/10', text: 'text-stone-400', hex: '#a8a29e' },
};

const defaultRankColor = { bg: 'bg-[var(--bento-primary)]/10', text: 'text-[var(--bento-primary)]', hex: '#c75b7a' };

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
  const rankColor = rankColors[rank] || defaultRankColor;
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Background gradient card */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--bento-card)] to-[var(--bento-bg)] border border-[var(--bento-border)] shadow-xl">
          {/* Decorative gradient overlay - simplified on mobile for performance */}
          <div 
            className="absolute inset-0 opacity-[0.03] hidden sm:block"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${rankColor.hex} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />
          
          {/* Rank accent bar - thicker on mobile for better visual impact */}
          <div 
            className="h-1.5 sm:h-1.5"
            style={{ backgroundColor: rankColor.hex }}
          />

          <div className="relative p-5 sm:p-6 md:p-8">
            {/* Top section: Avatar and basic info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              {/* Avatar - larger on mobile for better visual hierarchy */}
              <motion.div 
                className="relative group flex-shrink-0"
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute -inset-2 rounded-2xl blur-xl opacity-40 hidden sm:block"
                  style={{ backgroundColor: rankColor.hex }}
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative w-28 h-28 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white/10">
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                {lodestoneUrl && (
                  <motion.a
                    href={lodestoneUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute -bottom-2 -right-2 flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-[var(--bento-card)] border border-[var(--bento-border)] shadow-lg active:scale-95 sm:hover:scale-110 transition-transform"
                    aria-label="View Lodestone profile"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Globe className="w-5 h-5 sm:w-4 sm:h-4 text-[var(--bento-text-muted)]" />
                  </motion.a>
                )}
              </motion.div>

              {/* Name and details */}
              <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-[var(--bento-text)] mb-3 sm:mb-2">
                  {name}
                </h1>
                
                {/* Rank badge - stacked on mobile for better layout */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-start gap-2 mb-4 sm:mb-3">
                  <span className={`
                    inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-3 sm:py-1 rounded-full
                    text-sm sm:text-sm font-soft font-semibold
                    ${rankColor.bg} ${rankColor.text}
                  `}>
                    <Shield className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    {rank}
                  </span>
                  
                  {formattedDate && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-soft text-[var(--bento-text-muted)] bg-[var(--bento-bg)]">
                      <Calendar className="w-3 h-3" />
                      <span className="sm:hidden">Since {formattedDateShort}</span>
                      <span className="hidden sm:inline">Member since {formattedDate}</span>
                    </span>
                  )}
                </div>

                {/* Biography section - shows loading, display, or editor (desktop only) */}
                <div className="relative mt-4">
                  {isLoadingBiography ? (
                    // Loading state for biography
                    <div className="flex items-center justify-center sm:justify-start gap-2 py-3 sm:py-2">
                      <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 border-[var(--bento-primary)]/20 border-t-[var(--bento-primary)] animate-spin" />
                      <p className="text-sm text-[var(--bento-text-muted)] font-soft">
                        Loading biography...
                      </p>
                    </div>
                  ) : biography ? (
                    <div className="relative">
                      <Quote className="absolute -left-1 -top-1 w-6 h-6 text-[var(--bento-primary)]/20 hidden sm:block" />
                      <p className="text-base sm:text-base text-[var(--bento-text-muted)] leading-relaxed sm:pl-5 italic">
                        {biography}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--bento-text-subtle)] italic">
                      No biography yet. Tell the FC about yourself!
                    </p>
                  )}
                  
                  {/* Edit button - larger touch target on mobile */}
                  {!isLoadingBiography && (
                    <motion.button
                      onClick={onEditClick}
                      className="mt-4 sm:mt-3 inline-flex items-center justify-center sm:justify-start gap-2 px-5 py-3 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-lg text-sm font-soft font-semibold cursor-pointer transition-colors bg-[var(--bento-bg)] active:bg-[var(--bento-primary)]/20 sm:hover:bg-[var(--bento-primary)]/10 text-[var(--bento-text-muted)] active:text-[var(--bento-primary)] sm:hover:text-[var(--bento-primary)] w-full sm:w-auto"
                      whileTap={{ scale: 0.97 }}
                    >
                      <Pencil className="w-4 h-4 sm:w-3 sm:h-3" />
                      {biography ? 'Edit Biography' : 'Add Biography'}
                    </motion.button>
                  )}
                </div>

                {/* Desktop inline editor - only show on desktop when editing */}
                {isEditing && !isMobile && (
                  <div className="mt-4">
                    {isLoadingSubmission ? (
                      <div className="flex items-center gap-2 py-4">
                        <Loader2 className="w-4 h-4 text-[var(--bento-primary)] animate-spin" />
                        <p className="text-sm text-[var(--bento-text-muted)] font-soft">
                          Loading...
                        </p>
                      </div>
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
        </div>
      </motion.div>

      {/* Mobile bottom sheet for bio editing */}
      <MobileSheet
        isOpen={isEditing && isMobile}
        onClose={onEditClick}
        title={biography ? 'Edit Biography' : 'Add Biography'}
      >
        {isLoadingSubmission ? (
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="w-6 h-6 text-[var(--bento-primary)] animate-spin" />
            <p className="text-base text-[var(--bento-text-muted)] font-soft">
              Loading...
            </p>
          </div>
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
            bg-[var(--bento-bg)] border-2 rounded-2xl sm:rounded-xl
            font-soft text-base leading-relaxed text-[var(--bento-text)]
            placeholder:text-[var(--bento-text-muted)]/60
            focus:outline-none focus:border-[var(--bento-primary)]
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            transition-all duration-200
            ${isOverLimit 
              ? 'border-red-500' 
              : 'border-[var(--bento-border)] sm:hover:border-[var(--bento-primary)]/50'
            }
          `}
          style={{ fontSize: '16px' }} // Prevents iOS zoom on focus
        />
        
        {/* Character count and info */}
        <div className="flex justify-between items-center mt-3 sm:mt-2 px-1">
          {!canSetDirectly && !hasPendingSubmission && !hasRejectedSubmission ? (
            <p className="text-xs text-[var(--bento-text-subtle)]">
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
                : 'text-[var(--bento-text-muted)]'
          }`}>
            {charactersRemaining} / {MAX_BIO_LENGTH}
          </span>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20"
        >
          <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" aria-hidden="true" />
          <p className="text-xs text-green-600 dark:text-green-400">
            {successMessage}
          </p>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" aria-hidden="true" />
          <p className="text-xs text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
        </motion.div>
      )}

      {/* Action buttons - larger touch targets on mobile */}
      <div className={`flex gap-3 sm:gap-2 ${compact && !isMobile ? '' : 'flex-col sm:flex-row'}`}>
        {onCancel && !isMobile && (
          <motion.button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={`
              ${compact ? 'flex-1' : 'w-full sm:w-auto order-2 sm:order-1'}
              flex items-center justify-center gap-1.5
              px-4 py-2 rounded-lg
              font-soft font-medium text-sm
              transition-colors cursor-pointer
              bg-[var(--bento-bg)] hover:bg-[var(--bento-border)] text-[var(--bento-text-muted)]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>
        )}
        <motion.button
          type="submit"
          disabled={!biography.trim() || isOverLimit || isSubmitting}
          className={`
            ${compact && !isMobile ? 'flex-1' : 'w-full sm:flex-1 order-1 sm:order-2'}
            flex items-center justify-center gap-2 sm:gap-1.5
            px-5 py-4 sm:px-4 sm:py-2 ${compact && !isMobile ? '' : 'sm:py-2.5'} rounded-2xl sm:rounded-lg
            font-soft font-semibold text-base sm:text-sm
            transition-all cursor-pointer
            focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white 
            shadow-md shadow-[var(--bento-primary)]/20 active:shadow-sm sm:hover:shadow-lg
          `}
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 sm:w-3.5 sm:h-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <>
              {hasPendingSubmission ? (
                <Pencil className="w-5 h-5 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
              ) : (
                <Send className="w-5 h-5 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
              )}
              {getButtonText()}
            </>
          )}
        </motion.button>
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
      <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
        <FloatingSparkles minimal />
        
        <div className="relative z-10 container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ContentCard className="text-center py-10 sm:py-12">
                <motion.div 
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)] flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[var(--bento-primary)]/25"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <User className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-[var(--bento-text)] mb-3">
                  Your Profile
                </h1>
                <p className="text-sm sm:text-base text-[var(--bento-text-muted)] mb-6 max-w-xs mx-auto">
                  Sign in with Discord to view your membership card and manage your biography.
                </p>
                <motion.button
                  onClick={login}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#5865F2] text-white font-soft font-semibold cursor-pointer shadow-lg shadow-[#5865F2]/25 hover:bg-[#4752C4] transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Sign in with Discord
                </motion.button>
              </ContentCard>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-12 h-12 rounded-full border-3 border-[var(--bento-primary)]/20 border-t-[var(--bento-primary)] animate-spin" />
          <p className="font-accent text-lg text-[var(--bento-text-muted)]">Loading your profile, kupo~</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Background decorations */}
      <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      <FloatingSparkles minimal />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-4 py-5 sm:py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Mobile scroll indicator - subtle hint that there's more content */}
          <motion.div 
            className="flex justify-center mb-3 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-[var(--bento-text-subtle)]/50" />
            </motion.div>
          </motion.div>

          {/* Page Header - more compact on mobile */}
          <motion.header
            className="text-center mb-5 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.p
              className="font-accent text-lg sm:text-lg text-[var(--bento-secondary)] mb-1 sm:mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              ~ Your adventure awaits ~
            </motion.p>
            
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-display font-bold mb-1 sm:mb-2">
              <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
                My Profile
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-[var(--bento-text-muted)] font-soft hidden sm:block">
              View your membership card and share your story
            </p>

            <StoryDivider className="mx-auto mt-3 sm:mt-4" size="sm" />
          </motion.header>

          {/* Main Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Profile Header - Main identity section with inline bio editing */}
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

            {/* Membership Card Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-4">
                <Sparkles className="w-4 h-4 text-[var(--bento-primary)]" />
                <h2 className="text-sm font-soft font-semibold text-[var(--bento-primary)]">
                  Membership Card
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--bento-primary)]/30 to-transparent" />
              </div>
              
              {/* Card wrapper with tap feedback on mobile */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
                className="touch-manipulation"
              >
                <MembershipCard
                  name={user?.memberName || ''}
                  rank={user?.memberRank || ''}
                  avatarUrl={user?.memberPortraitUrl || ''}
                  characterId={characterId}
                  memberSince={user?.firstLoginDate ? new Date(user.firstLoginDate) : undefined}
                />
              </motion.div>
              
              <p className="text-center text-xs text-[var(--bento-text-subtle)] mt-3 sm:mt-2 font-soft">
                <span className="hidden sm:inline">Hover or tilt your device to see the holographic effect</span>
                <span className="sm:hidden">Tilt your device to see the holographic effect</span>
              </p>
            </motion.section>

            {/* Future Features Teaser - hidden on mobile to reduce clutter */}
            <motion.div
              className="text-center py-4 sm:py-8 hidden sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <StoryDivider className="mx-auto mb-4" size="sm" />
              <p className="font-accent text-sm sm:text-base text-[var(--bento-text-subtle)]">
                More profile features coming soon, kupo~
              </p>
            </motion.div>
            
            {/* Mobile bottom spacer for comfortable scrolling */}
            <div className="h-4 sm:hidden" />
          </div>
        </div>
      </div>
    </div>
  );
}
