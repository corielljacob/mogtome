import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Stars } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../contexts/AuthContext';

import wavingMoogle from '../assets/moogles/4478593_moogle-moogle-ff-hd-png-download.webp';

const FAREWELL_MESSAGES = [
  "May your adventures be grand, kupo~!",
  "Until we meet again, kupo!",
  "Safe travels, adventurer~!",
  "The moogles will miss you, kupo!",
  "Farewell for now, dear friend~!",
];

function getRandomFarewell(): string {
  return FAREWELL_MESSAGES[Math.floor(Math.random() * FAREWELL_MESSAGES.length)];
}

export function Logout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [farewell] = useState(getRandomFarewell);
  const [phase, setPhase] = useState<'showing' | 'fading'>('showing');
  
  // Capture user info before logout clears it
  const userRef = useRef<User | null>(null);
  if (userRef.current === null && user) {
    userRef.current = user;
  }
  const displayUser = userRef.current;

  useEffect(() => {
    // Perform logout
    logout();
    
    // Start fade after showing the message
    const fadeTimer = setTimeout(() => {
      setPhase('fading');
    }, 2000);

    // Redirect home after animation
    const redirectTimer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [logout, navigate]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 relative overflow-hidden">

      {/* Floating stars background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: phase === 'fading' ? 0 : [0.2, 0.5, 0.2],
              scale: phase === 'fading' ? 0 : 1,
            }}
            transition={{
              opacity: { duration: 2, repeat: Infinity, delay: i * 0.3 },
              scale: { duration: 0.5, delay: i * 0.1 },
            }}
          >
            <Stars className="w-4 h-4 text-[var(--bento-secondary)]" />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ 
          opacity: phase === 'fading' ? 0 : 1, 
          y: phase === 'fading' ? -20 : 0,
          scale: phase === 'fading' ? 0.95 : 1,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-[var(--bento-card)] rounded-2xl p-6 shadow-xl border border-[var(--bento-border)] text-center relative overflow-hidden">
          {/* Waving moogle */}
          <motion.div
            className="w-24 h-24 mx-auto mb-4"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.img
              src={wavingMoogle}
              alt="Moogle waving goodbye"
              className="w-full h-full object-contain"
              animate={{ rotate: [0, 5, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
          </motion.div>

          {/* Goodbye message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-xl font-bold text-[var(--bento-text)] mb-2">
              Goodbye{displayUser ? `, ${displayUser.memberName.split(' ')[0]}` : ''}!
            </h2>
            <p className="text-[var(--bento-text-muted)] font-soft text-sm mb-4">
              {farewell}
            </p>
          </motion.div>


          {/* Redirect notice */}
          <motion.div
            className="flex items-center justify-center gap-1.5 text-xs text-[var(--bento-text-subtle)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-soft">Returning to home...</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
