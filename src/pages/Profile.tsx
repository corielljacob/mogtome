import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { 
  User, 
  Sparkles, 
  FileText, 
  Send, 
  Check, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { biographyApi } from '../api/biography';
import { membersApi } from '../api/members';
import { ContentCard } from '../components';

const MAX_BIO_LENGTH = 300;

/**
 * ProfilePreviewCard - Shows how the user will appear on the About page
 */
function ProfilePreviewCard({ 
  name, 
  rank, 
  avatarUrl, 
  biography 
}: { 
  name: string; 
  rank: string; 
  avatarUrl: string;
  biography: string;
}) {
  return (
    <div className="relative p-4 sm:p-5 bg-[var(--bento-bg)]/50 rounded-xl border border-[var(--bento-border)]">
      {/* Preview label */}
      <div className="absolute -top-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bento-card)] border border-[var(--bento-border)] text-xs font-soft font-medium text-[var(--bento-text-muted)]">
        <Eye className="w-3 h-3" />
        Preview
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        {/* Avatar */}
        <div className="flex-shrink-0 self-center sm:self-start">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-md ring-2 ring-[var(--bento-primary)]/10">
            <img
              src={avatarUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="font-display font-bold text-base sm:text-lg text-[var(--bento-text)] truncate">
            {name}
          </h3>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-soft font-semibold bg-[var(--bento-primary)]/10 text-[var(--bento-primary)] mt-1">
            {rank}
          </span>
          
          {/* Biography preview */}
          <p className="mt-3 text-sm text-[var(--bento-text-muted)] leading-relaxed">
            {biography || (
              <span className="italic opacity-75">Your biography will appear here...</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * BiographyEditor - Form for editing/submitting biography
 */
function BiographyEditor({ 
  canSetDirectly, 
  onBiographyChange,
  initialBiography,
}: { 
  canSetDirectly: boolean;
  onBiographyChange: (biography: string) => void;
  initialBiography: string;
}) {
  const queryClient = useQueryClient();
  const [biography, setBiography] = useState(initialBiography);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Update biography when initialBiography changes (e.g., after fetching from API)
  useEffect(() => {
    if (initialBiography && !hasInitialized) {
      setBiography(initialBiography);
      onBiographyChange(initialBiography);
      setHasInitialized(true);
    }
  }, [initialBiography, hasInitialized, onBiographyChange]);

  // Mutation for Knights setting biography directly
  const setBiographyMutation = useMutation({
    mutationFn: (biography: string) => biographyApi.setBiography(biography),
    onSuccess: () => {
      setSuccessMessage('Biography updated successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
      // Refetch staff data so the updated biography is reflected
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });

  // Mutation for Paissa submitting biography for approval
  const submitBiographyMutation = useMutation({
    mutationFn: (biography: string) => biographyApi.submitBiography(biography),
    onSuccess: () => {
      setSuccessMessage('Biography submitted for approval! A Moogle Knight will review it soon.');
      setBiography('');
      onBiographyChange('');
      setTimeout(() => setSuccessMessage(null), 5000);
    },
  });

  const activeMutation = canSetDirectly ? setBiographyMutation : submitBiographyMutation;
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Biography textarea */}
      <div>
        <label 
          htmlFor="biography" 
          className="block text-sm font-soft font-semibold text-[var(--bento-text)] mb-2"
        >
          {canSetDirectly ? 'Your Biography' : 'Submit Your Biography'}
        </label>
        <textarea
          id="biography"
          value={biography}
          onChange={(e) => handleBiographyChange(e.target.value)}
          placeholder="Tell us about yourself, kupo~ What brings you to Kupo Life? What do you enjoy doing in Eorzea?"
          rows={5}
          maxLength={MAX_BIO_LENGTH + 50}
          disabled={isSubmitting}
          className={`
            w-full px-3 sm:px-4 py-2.5 sm:py-3
            bg-[var(--bento-bg)] border rounded-xl
            font-soft text-sm sm:text-base text-[var(--bento-text)]
            placeholder:text-[var(--bento-text-muted)]
            focus:outline-none focus:ring-2 focus:ring-[var(--bento-primary)] focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            transition-colors
            ${isOverLimit ? 'border-red-500' : 'border-[var(--bento-border)]'}
          `}
        />
        
        {/* Character count */}
        <div className="flex justify-end mt-1.5">
          <span className={`text-xs font-soft ${
            isOverLimit 
              ? 'text-red-500' 
              : charactersRemaining < 50 
                ? 'text-amber-500' 
                : 'text-[var(--bento-text-muted)]'
          }`}>
            {charactersRemaining} characters remaining
          </span>
        </div>
      </div>

      {/* Info banner for Paissa */}
      {!canSetDirectly && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--bento-secondary)]/10 border border-[var(--bento-secondary)]/20">
          <AlertCircle className="w-4 h-4 text-[var(--bento-secondary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-[var(--bento-text-muted)]">
            Your biography will be reviewed by a Moogle Knight before appearing on the About page. 
            This usually happens within a day or two!
          </p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
        >
          <Check className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
            {successMessage}
          </p>
        </motion.div>
      )}

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
          </p>
        </motion.div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!biography.trim() || isOverLimit || isSubmitting}
        className={`
          w-full flex items-center justify-center gap-2
          px-4 py-2.5 sm:py-3 rounded-xl
          font-soft font-semibold text-sm sm:text-base
          transition-all cursor-pointer
          focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white 
          shadow-lg shadow-[var(--bento-primary)]/25 hover:shadow-xl
        `}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            {canSetDirectly ? 'Updating...' : 'Submitting...'}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            {canSetDirectly ? 'Update Biography' : 'Submit for Approval'}
          </>
        )}
      </button>
    </form>
  );
}

/**
 * Profile Page - Dedicated page for managing your public profile
 */
export function Profile() {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const [previewBiography, setPreviewBiography] = useState('');

  // Only permanent knights can set biography directly - temp knights still submit for approval
  const canSetBiographyDirectly = user?.hasKnighthood === true;

  // Fetch staff list to find user's existing bio
  const { data: staffData } = useQuery({
    queryKey: ['staff'],
    queryFn: () => membersApi.getStaff(),
    enabled: isAuthenticated && !!user?.memberName,
    staleTime: 1000 * 60 * 5,
  });

  // Find the current user in the staff list to get their existing biography
  const existingBiography = staffData?.staff.find(
    (member) => member.name === user?.memberName
  )?.biography || '';

  // Show login prompt if not authenticated
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
        
        <div className="relative z-10 container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="max-w-lg mx-auto">
            <ContentCard className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-[var(--bento-primary)]" />
              </div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-[var(--bento-text)] mb-2">
                Your Profile
              </h1>
              <p className="text-sm text-[var(--bento-text-muted)] mb-6">
                Sign in with Discord to manage your profile and biography.
              </p>
              <button
                onClick={login}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5865F2] text-white font-soft font-semibold cursor-pointer shadow-lg shadow-[#5865F2]/25 hover:bg-[#4752C4] transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Login with Discord
              </button>
            </ContentCard>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="w-10 h-10 rounded-full border-3 border-[var(--bento-primary)]/20 border-t-[var(--bento-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)] flex items-center justify-center shadow-lg shadow-[var(--bento-primary)]/25">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-[var(--bento-text)]">
                  Your Profile
                </h1>
                <p className="text-xs sm:text-sm text-[var(--bento-text-muted)]">
                  Share your story with the FC
                </p>
              </div>
            </div>
            
            {/* Decorative divider */}
            <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--bento-secondary)]" aria-hidden="true" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />
            </div>
          </motion.div>

          {/* Profile Content */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Preview Card */}
            <ContentCard>
              <div className="flex items-start gap-2.5 sm:gap-3 mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)]" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-base sm:text-lg text-[var(--bento-text)]">
                    About Page Preview
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--bento-text-muted)] mt-0.5">
                    How you'll appear to other members
                  </p>
                </div>
              </div>

              <ProfilePreviewCard
                name={user?.memberName || ''}
                rank={user?.memberRank || ''}
                avatarUrl={user?.memberPortraitUrl || ''}
                biography={previewBiography}
              />

              {/* Lodestone link */}
              <div className="mt-4 text-center">
                <a
                  href="https://na.finalfantasyxiv.com/lodestone/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Avatar from Lodestone
                </a>
              </div>
            </ContentCard>

            {/* Biography Editor */}
            <ContentCard>
              <div className="flex items-start gap-2.5 sm:gap-3 mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)]" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-base sm:text-lg text-[var(--bento-text)]">
                    Write Your Story
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--bento-text-muted)] mt-0.5">
                    {canSetBiographyDirectly 
                      ? "Your biography will appear on the About page immediately"
                      : "Your biography will be reviewed before appearing on the About page"
                    }
                  </p>
                </div>
              </div>

              <BiographyEditor 
                canSetDirectly={canSetBiographyDirectly}
                onBiographyChange={setPreviewBiography}
                initialBiography={existingBiography}
              />
            </ContentCard>
          </motion.div>

          {/* Footer note */}
          <motion.p
            className="text-center text-[10px] sm:text-xs text-[var(--bento-text-subtle)] mt-6 sm:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your biography appears on the About page alongside other FC members
          </motion.p>
        </div>
      </div>
    </div>
  );
}
