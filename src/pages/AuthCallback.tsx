import { useEffect, useState, useRef, useMemo, memo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { setAuthToken, useAuth, getReturnUrl, clearReturnUrl } from '../contexts/AuthContext';
import type { User } from '../contexts/AuthContext';
import { MembershipCard, getTheme } from '../components/MembershipCard';

import moogleWizard from '../assets/moogles/wizard moogle.webp';

type CallbackStatus = 'processing' | 'success' | 'error';

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Premium sparkle burst that emanates from the card
const CelebrationSparkles = memo(function CelebrationSparkles({ 
  isActive 
}: { 
  isActive: boolean 
}) {
  // Create particles that burst outward from center
  const particles = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => {
        const angle = (i / 32) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const distance = 80 + Math.random() * 120;
        const size = 2 + Math.random() * 4;
        const colors = ['var(--bento-primary)', 'var(--bento-secondary)', '#FFD700', '#FF69B4', '#87CEEB'];
        return {
          id: i,
          // Start near center
          startX: 50 + (Math.random() - 0.5) * 20,
          startY: 50 + (Math.random() - 0.5) * 20,
          // Burst outward
          endX: 50 + Math.cos(angle) * distance,
          endY: 50 + Math.sin(angle) * distance * 0.6, // Flatten vertically
          delay: 0.02 * i + Math.random() * 0.15,
          duration: 0.8 + Math.random() * 0.4,
          size,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
        };
      }),
    []
  );

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: 0,
            y: 0,
            rotate: 0,
          }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0.5],
            x: `${p.endX - p.startX}%`,
            y: `${p.endY - p.startY}%`,
            rotate: p.rotation,
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay, 
            ease: [0.16, 1, 0.3, 1], // Custom "pop" easing
          }}
        >
          {/* Star shape for some particles */}
          {p.id % 3 === 0 ? (
            <svg viewBox="0 0 24 24" className="w-full h-full" fill={p.color}>
              <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
            </svg>
          ) : (
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
});

// Ambient floating particles (subtle, always visible during reveal)
const AmbientGlow = memo(function AmbientGlow({ isActive }: { isActive: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 60,
        delay: i * 0.1,
        size: 4 + Math.random() * 6,
        duration: 2 + Math.random() * 1.5,
        color: i % 2 === 0 ? 'var(--bento-primary)' : 'var(--bento-secondary)',
      })),
    []
  );

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0.4, 0],
            scale: [0, 1, 1.2, 0],
            y: [0, -30 - Math.random() * 20],
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay,
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
});

// Premium shine sweep with multiple waves
function CardShine({ delay = 0, intensity = 'normal' }: { delay?: number; intensity?: 'subtle' | 'normal' | 'bright' }) {
  const opacityMap = { subtle: 0.2, normal: 0.4, bright: 0.6 };
  const opacity = opacityMap[intensity];

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      {/* Primary shine wave */}
      <motion.div
        className="absolute inset-y-0 w-[250%] -left-[150%]"
        style={{
          background: `linear-gradient(
            105deg, 
            transparent 0%, 
            transparent 35%,
            rgba(255,255,255,${opacity * 0.3}) 42%,
            rgba(255,255,255,${opacity}) 50%, 
            rgba(255,255,255,${opacity * 0.3}) 58%,
            transparent 65%, 
            transparent 100%
          )`,
        }}
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        transition={{
          delay: delay,
          duration: 1.0,
          ease: [0.25, 0.46, 0.45, 0.94], // Smooth deceleration
        }}
      />
      {/* Secondary subtle shine (offset) */}
      <motion.div
        className="absolute inset-y-0 w-[200%] -left-full"
        style={{
          background: `linear-gradient(
            95deg, 
            transparent 0%, 
            transparent 40%,
            rgba(255,255,255,${opacity * 0.15}) 48%,
            rgba(255,255,255,${opacity * 0.25}) 52%, 
            rgba(255,255,255,${opacity * 0.15}) 56%,
            transparent 64%, 
            transparent 100%
          )`,
        }}
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        transition={{
          delay: delay + 0.15,
          duration: 0.9,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
    </motion.div>
  );
}


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

// Check if this is a first-time user
function isFirstTimeUser(user: User): boolean {
  // Check local storage for previous logins
  const hasLoggedInBefore = localStorage.getItem('mogtome_has_logged_in');
  if (hasLoggedInBefore) {
    return false;
  }
  
  // No local storage means they haven't logged in on this device before
  // Check if their account was created today (if date is available)
  if (user.createdAt) {
    const createdDate = new Date(user.createdAt);
    const today = new Date();
    const isToday = createdDate.toDateString() === today.toDateString();
    if (isToday) {
      return true;
    }
  } else {
    // No createdAt date available AND no local storage = treat as first time
    return true;
  }
  
  return false;
}

// Mark that user has logged in before
function markUserAsReturning() {
  localStorage.setItem('mogtome_has_logged_in', 'true');
}

// ─────────────────────────────────────────────────────────────────────────────
// FIRST-TIME WELCOME - Premium card reveal with buttery smooth animations
// ─────────────────────────────────────────────────────────────────────────────

function FirstTimeWelcome({ 
  user, 
  onComplete 
}: { 
  user: User; 
  onComplete: () => void;
}) {
  const theme = getTheme(user.memberRank);
  // Continuous animation timeline using a single progress value
  const [animationState, setAnimationState] = useState<
    'entering' | 'card-reveal' | 'celebrating' | 'complete'
  >('entering');
  
  // Mark as returning user
  useEffect(() => {
    markUserAsReturning();
  }, []);

  // Smooth orchestrated timeline - each stage flows into the next
  useEffect(() => {
    const timers = [
      // Brief pause for anticipation, then reveal card
      setTimeout(() => setAnimationState('card-reveal'), 400),
      // Celebration burst after card settles
      setTimeout(() => setAnimationState('celebrating'), 1200),
      // Show button and complete state
      setTimeout(() => setAnimationState('complete'), 1900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleContinue = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const firstName = user.memberName?.split(' ')[0] || 'Adventurer';
  
  // Derived state for cleaner JSX
  const showCard = animationState !== 'entering';
  const showCelebration = animationState === 'celebrating' || animationState === 'complete';
  const showButton = animationState === 'complete';

  return (
    <motion.div
      className="text-center py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 0.95,
        filter: 'blur(8px)',
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Welcome header - elegant staggered entrance */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p 
          className="text-[var(--bento-text-muted)] font-soft text-sm mb-2"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1], // Smooth deceleration
          }}
        >
          Welcome to the family, {firstName}
        </motion.p>
        <motion.p
          className="font-accent text-2xl bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ 
            duration: 0.7, 
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Your card is ready
        </motion.p>
      </motion.div>

      {/* Card container with layered effects */}
      <div className="relative mb-6 text-left">
        {/* Deep ambient glow - builds up smoothly */}
        <motion.div
          className="absolute -inset-16 rounded-[3rem] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 65%)`,
            filter: 'blur(50px)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: showCard ? 0.4 : 0,
            scale: showCard ? 1 : 0.5,
          }}
          transition={{ 
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
        
        {/* Pulsing glow layer (only after card is revealed) */}
        <motion.div
          className="absolute -inset-10 rounded-[2.5rem] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 70%)`,
            filter: 'blur(35px)',
          }}
          initial={{ opacity: 0 }}
          animate={showCard ? { 
            opacity: [0.25, 0.45, 0.25],
            scale: [0.95, 1.02, 0.95],
          } : { opacity: 0 }}
          transition={{ 
            duration: 3,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />

        {/* The membership card with cinematic entrance */}
        <motion.div
          className="relative"
          initial={{ 
            opacity: 0, 
            y: 80, 
            scale: 0.75,
            rotateX: 35,
          }}
          animate={showCard ? { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotateX: 0,
          } : undefined}
          transition={{ 
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1], // Smooth spring-like curve
          }}
          style={{ 
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Blur wrapper - separates blur animation for smoother rendering */}
          <motion.div
            initial={{ filter: 'blur(12px)' }}
            animate={showCard ? { filter: 'blur(0px)' } : undefined}
            transition={{ 
              duration: 0.6, 
              delay: 0.15,
              ease: 'easeOut',
            }}
          >
            <MembershipCard
              name={user.memberName || 'Adventurer'}
              rank={user.memberRank || 'Member'}
              avatarUrl={user.memberPortraitUrl || ''}
              characterId={user.memberId}
              memberSince={user.createdAt}
              compact
            />
          </motion.div>
          
          {/* Shine sweep overlay - triggers after card lands */}
          {showCard && <CardShine delay={0.5} intensity="bright" />}
        </motion.div>
        
        {/* Celebration effects */}
        <CelebrationSparkles isActive={showCelebration} />
        <AmbientGlow isActive={showCelebration} />
      </div>

      {/* Bottom section - message and button with smooth stagger */}
      <div className="min-h-[5.5rem] flex flex-col items-center justify-center gap-4">
        <AnimatePresence mode="wait">
          {showCelebration && (
            <motion.p
              key="celebration-text"
              className="font-accent text-base text-[var(--bento-secondary)]"
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              ✨ You're officially one of us, kupo! ✨
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.button
              key="continue-button"
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ 
                scale: 1.04, 
                y: -3,
                boxShadow: '0 25px 50px -12px rgba(199, 91, 122, 0.5)',
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ 
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
              onClick={handleContinue}
              className="
                px-8 py-3 rounded-2xl
                bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]
                text-white font-soft font-semibold text-sm
                shadow-xl shadow-[var(--bento-primary)]/30
                cursor-pointer
                focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bento-primary)] focus-visible:outline-none
              "
            >
              Let's go, kupo! →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RETURNING USER - Quick welcome back
// ─────────────────────────────────────────────────────────────────────────────

function ReturningUserWelcome({ 
  user, 
  onComplete 
}: { 
  user: User; 
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<'enter' | 'display' | 'exit'>('enter');

  useEffect(() => {
    const displayTimer = setTimeout(() => setPhase('display'), 400);
    const exitTimer = setTimeout(() => setPhase('exit'), 2400);
    const completeTimer = setTimeout(() => onComplete(), 2900);

    return () => {
      clearTimeout(displayTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: phase === 'exit' ? 0.4 : 0.3 }}
      className="text-center py-2"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <p className="text-[var(--bento-text-muted)] font-soft text-sm mb-1">
          Welcome back, kupo!
        </p>
        <motion.p
          className="font-accent text-lg text-[var(--bento-primary)]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          Good to see you again~
        </motion.p>
      </motion.div>

      <motion.div
        className="mb-5 text-left"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 22, delay: 0.1 }}
      >
        <MembershipCard
          name={user.memberName || 'Adventurer'}
          rank={user.memberRank || 'Member'}
          avatarUrl={user.memberPortraitUrl || ''}
          characterId={user.memberId}
          memberSince={user.createdAt}
          compact
        />
      </motion.div>

      <motion.div 
        className="flex items-center justify-center gap-1.5 text-xs text-[var(--bento-text-subtle)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--bento-success)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--bento-success)]" />
        </span>
        <span className="font-soft">Taking you home...</span>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS SCREEN - Routes to appropriate experience
// ─────────────────────────────────────────────────────────────────────────────

function SuccessScreen({ user, onComplete }: { user: User; onComplete: () => void }) {
  const isFirstTime = useMemo(() => isFirstTimeUser(user), [user]);

  if (isFirstTime) {
    return <FirstTimeWelcome user={user} onComplete={onComplete} />;
  }

  return <ReturningUserWelcome user={user} onComplete={onComplete} />;
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

  // Capture return URL on first render (before effects)
  const returnUrlRef = useRef<string | null>(null);
  if (returnUrlRef.current === null) {
    returnUrlRef.current = getReturnUrl() || '/';
    clearReturnUrl();
  }

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
        // Navigation is now handled by the SuccessScreen's onCardStored callback
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

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-lg relative z-10"
      >
        <div className={`bg-[var(--bento-card)] rounded-2xl p-6 shadow-xl border border-[var(--bento-border)] relative overflow-hidden transition-all duration-300 ${status === 'success' ? 'max-w-lg' : 'max-w-sm'}`}>
          {status === 'processing' && <ProcessingScreen />}
          {status === 'success' && user && (
            <SuccessScreen 
              user={user} 
              onComplete={() => navigate(returnUrlRef.current!, { replace: true })}
            />
          )}
          {status === 'error' && <ErrorScreen error={error} onReturnHome={handleReturnHome} />}
        </div>
      </motion.div>
    </div>
  );
}
