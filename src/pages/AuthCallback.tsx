import { useEffect, useState, useRef, useMemo, memo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Crown, Shield, Sword, Leaf, Cat, Bird, Star, Heart, Sparkles, Loader2 } from 'lucide-react';
import { setAuthToken, useAuth, getReturnUrl, clearReturnUrl } from '../contexts/AuthContext';
import type { User } from '../contexts/AuthContext';

import moogleWizard from '../assets/moogles/wizard moogle.webp';

type CallbackStatus = 'processing' | 'success' | 'error';

// ─────────────────────────────────────────────────────────────────────────────
// RANK THEMES
// ─────────────────────────────────────────────────────────────────────────────

interface RankTheme {
  gradient: string;
  glow: string;
  bg: string;
  icon: typeof Crown;
  accent: string;
}

const rankThemes: Record<string, RankTheme> = {
  'Moogle Guardian': {
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
    glow: 'rgba(251, 191, 36, 0.4)',
    bg: 'bg-amber-500/15',
    icon: Crown,
    accent: 'text-amber-500',
  },
  'Moogle Knight': {
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    glow: 'rgba(167, 139, 250, 0.4)',
    bg: 'bg-violet-500/15',
    icon: Shield,
    accent: 'text-violet-500',
  },
  'Paissa Trainer': {
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-400',
    glow: 'rgba(251, 113, 133, 0.4)',
    bg: 'bg-rose-500/15',
    icon: Heart,
    accent: 'text-rose-500',
  },
  'Coeurl Hunter': {
    gradient: 'from-purple-300 via-violet-400 to-indigo-400',
    glow: 'rgba(196, 181, 253, 0.4)',
    bg: 'bg-purple-400/15',
    icon: Cat,
    accent: 'text-purple-400',
  },
  'Mandragora': {
    gradient: 'from-orange-300 via-amber-400 to-rose-400',
    glow: 'rgba(253, 186, 116, 0.4)',
    bg: 'bg-orange-400/15',
    icon: Leaf,
    accent: 'text-orange-400',
  },
  'Apkallu Seeker': {
    gradient: 'from-pink-300 via-rose-400 to-red-400',
    glow: 'rgba(249, 168, 212, 0.4)',
    bg: 'bg-pink-400/15',
    icon: Bird,
    accent: 'text-pink-400',
  },
  'Kupo Shelf': {
    gradient: 'from-violet-300 via-purple-400 to-fuchsia-400',
    glow: 'rgba(196, 181, 253, 0.35)',
    bg: 'bg-violet-400/15',
    icon: Star,
    accent: 'text-violet-400',
  },
  'Bom Boko': {
    gradient: 'from-stone-300 via-stone-400 to-slate-400',
    glow: 'rgba(168, 162, 158, 0.3)',
    bg: 'bg-stone-400/15',
    icon: Sparkles,
    accent: 'text-stone-400',
  },
};

const defaultTheme: RankTheme = {
  gradient: 'from-[var(--bento-primary)] via-[var(--bento-secondary)] to-[var(--bento-accent)]',
  glow: 'rgba(199, 91, 122, 0.35)',
  bg: 'bg-[var(--bento-primary)]/15',
  icon: Sword,
  accent: 'text-[var(--bento-primary)]',
};

function getTheme(rank: string | undefined): RankTheme {
  return rank ? (rankThemes[rank] ?? defaultTheme) : defaultTheme;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#E54B4B', '#9683B8', '#F28B8B', '#FFD700', '#FF69B4', '#87CEEB'];
const CONFETTI_COUNT = 40;

const Confetti = memo(function Confetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1.5,
        rotation: Math.random() * 540 - 270,
        size: 5 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
          }}
          initial={{ y: -10, rotate: 0, opacity: 1 }}
          animate={{ y: '100vh', rotate: p.rotation, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
});


// ─────────────────────────────────────────────────────────────────────────────
// STATUS SCREENS
// ─────────────────────────────────────────────────────────────────────────────

function ProcessingScreen() {
  return (
    <div className="text-center py-4">
      <motion.div
        className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-[var(--bento-primary)]/20 to-[var(--bento-secondary)]/20 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-7 h-7 text-[var(--bento-primary)]" />
      </motion.div>
      <h2 className="font-display text-xl font-bold text-[var(--bento-text)] mb-2">
        Logging you in, kupo~!
      </h2>
      <p className="text-[var(--bento-text-muted)] font-soft text-sm">
        Completing Discord authentication...
      </p>
    </div>
  );
}

function SuccessScreen({ user, theme }: { user: User; theme: RankTheme }) {
  const RankIcon = theme.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-2"
    >
      {/* Avatar Section */}
      <div className="relative w-28 h-28 mx-auto mb-5">
        {/* Soft static glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 40px 12px ${theme.glow}` }}
        />

        {/* Avatar */}
        <motion.div
          className="relative w-full h-full rounded-full overflow-hidden ring-[3px] ring-white/30 shadow-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
        >
          <img
            src={user.memberPortraitUrl}
            alt={`${user.memberName}'s portrait`}
            className="w-full h-full object-cover"
          />
          {/* One-time shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Rank badge */}
        <motion.div
          className={`absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-md ring-2 ring-[var(--bento-card)]`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.35 }}
        >
          <RankIcon className="w-4 h-4 text-white" />
        </motion.div>
      </div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <p className="text-[var(--bento-text-muted)] font-soft text-sm mb-1">
          Welcome back, kupo!
        </p>
        <h2
          className={`font-display text-2xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent mb-3`}
        >
          {user.memberName}
        </h2>
      </motion.div>

      {/* Rank pill */}
      <motion.div
        className="flex justify-center mb-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-soft font-semibold ${theme.bg} ${theme.accent}`}
        >
          <RankIcon className="w-3.5 h-3.5" />
          {user.memberRank}
        </span>
      </motion.div>

      {/* Redirect indicator */}
      <motion.div
        className="flex items-center justify-center gap-1.5 text-xs text-[var(--bento-text-subtle)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--bento-success)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--bento-success)]" />
        </span>
        <span className="font-soft">Redirecting shortly...</span>
      </motion.div>
    </motion.div>
  );
}

function ErrorScreen({ error, onReturnHome }: { error: string; onReturnHome: () => void }) {
  return (
    <div className="text-center py-4">
      <motion.div
        className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <AlertCircle className="w-8 h-8 text-red-500" />
      </motion.div>
      <h2 className="font-display text-xl font-bold text-[var(--bento-text)] mb-2">
        Oh no, kupo!
      </h2>
      <p className="text-[var(--bento-text-muted)] font-soft text-sm mb-5">{error}</p>
      <button
        onClick={onReturnHome}
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white font-soft font-semibold text-sm shadow-lg shadow-[var(--bento-primary)]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Return Home
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const [status, setStatus] = useState<CallbackStatus>('processing');
  const [error, setError] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Capture return URL on first render (before effects)
  const returnUrlRef = useRef<string | null>(null);
  if (returnUrlRef.current === null) {
    returnUrlRef.current = getReturnUrl() || '/';
    clearReturnUrl();
  }

  const theme = getTheme(user?.memberRank);

  useEffect(() => {
    async function handleCallback() {
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setStatus('error');
        setError(errorDescription || 'Authentication was cancelled or failed');
        return;
      }

      const token = searchParams.get('token');

      if (token) {
        setAuthToken(token);
        await refreshUser();
        setStatus('success');
        setShowConfetti(true);

        setTimeout(() => {
          navigate(returnUrlRef.current!, { replace: true });
        }, 3000);
        return;
      }

      setStatus('error');
      setError('No authentication token received. Please try logging in again.');
    }

    handleCallback();
  }, [searchParams, navigate, refreshUser]);

  const handleReturnHome = () => navigate('/', { replace: true });

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 relative overflow-hidden">
      {/* Background decoration */}
      <motion.img
        src={moogleWizard}
        alt=""
        aria-hidden="true"
        className="absolute bottom-24 right-6 md:right-20 w-20 md:w-28 object-contain opacity-[0.08]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Confetti */}
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-[var(--bento-card)] rounded-2xl p-6 shadow-xl border border-[var(--bento-border)] relative overflow-hidden">
          {status === 'processing' && <ProcessingScreen />}
          {status === 'success' && user && <SuccessScreen user={user} theme={theme} />}
          {status === 'error' && <ErrorScreen error={error} onReturnHome={handleReturnHome} />}
        </div>
      </motion.div>
    </div>
  );
}
