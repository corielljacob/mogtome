import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Heart, PartyPopper, ArrowRight } from 'lucide-react';
import { Button } from './Button';

import mailMoogle from '../assets/moogles/moogle mail.webp';

const STORAGE_KEY = 'mogtome-welcome-seen';

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Check if user has seen welcome dialog before
    const hasSeenWelcome = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenWelcome) {
      // Small delay to let the page load first
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Focus the dialog when it opens
      closeButtonRef.current?.focus();
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const steps = [
    {
      title: "Welcome to MogTome!",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-[var(--bento-secondary)]">
            <PartyPopper className="w-5 h-5" />
            <span className="font-accent text-xl">Grand Opening, kupo!</span>
            <PartyPopper className="w-5 h-5 scale-x-[-1]" />
          </div>
          <p className="text-[var(--bento-text)] leading-relaxed">
            We're so excited you're here! MogTome is the cozy digital home for our Free Company, 
            <span className="font-semibold text-[var(--bento-primary)]"> Kupo Life!</span>
          </p>
          <p className="text-[var(--bento-text-muted)] leading-relaxed">
            This is a place where our moogle family can gather, share adventures, 
            and keep up with everything happening in our little corner of Eorzea.
          </p>
        </div>
      ),
    },
    {
      title: "A Message From Us",
      content: (
        <div className="space-y-5">
          {/* Joint message card */}
          <div className="p-5 rounded-2xl bg-[var(--bento-bg)]/60 border border-[var(--bento-primary)]/10">
            <p className="text-[var(--bento-text)] leading-relaxed mb-4">
              We've been working hard to build this cozy little corner of the internet for our FC family. 
              It's been a labor of love, and we're so excited to finally share it with you!
            </p>
            <p className="text-[var(--bento-text)] leading-relaxed mb-4">
              Whether you're here to check out our members, catch up on FC happenings, or just hang out — 
              we hope MogTome feels like home.
            </p>
            <p className="text-[var(--bento-text)] leading-relaxed mb-4">
              This is just the beginning! We have a lot more planned for MogTome, so stay tuned~
            </p>
            <p className="text-[var(--bento-text-muted)] leading-relaxed">
              Thank you for being part of Kupo Life. We couldn't do this without you, kupo~
            </p>
          </div>

          {/* Signature - handwritten style */}
          <div className="text-center pt-2">
            <p className="font-accent text-2xl text-[var(--bento-primary)]">
              — Plane & Agility
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Ready to Explore?",
      content: (
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-12 h-12 text-[var(--bento-primary)] fill-[var(--bento-primary)]/30" />
            </motion.div>
          </div>
          <p className="text-[var(--bento-text)] leading-relaxed">
            Browse our <span className="font-semibold text-[var(--bento-primary)]">Members</span> page to see our FC family, 
            check out the <span className="font-semibold text-[var(--bento-secondary)]">Chronicle</span> for updates, 
            or just enjoy the vibes!
          </p>
          <p className="text-[var(--bento-text-muted)] font-accent text-lg">
            Thank you for being part of Kupo Life! ✧
          </p>
        </div>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            className="relative w-full max-w-lg bg-[var(--bento-card)] rounded-3xl shadow-2xl shadow-[var(--bento-primary)]/20 border border-[var(--bento-primary)]/10 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Decorative header gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--bento-primary)]/10 via-[var(--bento-accent)]/5 to-transparent pointer-events-none" />

            {/* Floating sparkles decoration */}
            <div className="absolute top-4 left-6 opacity-60">
              <motion.div
                animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-[var(--bento-secondary)]" />
              </motion.div>
            </div>
            <div className="absolute top-20 right-16 opacity-60 pointer-events-none">
              <motion.div
                animate={{ rotate: [0, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="w-4 h-4 text-[var(--bento-primary)]" />
              </motion.div>
            </div>

            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-[var(--bento-bg)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none"
              aria-label="Close welcome dialog"
            >
              <X className="w-5 h-5 text-[var(--bento-text-muted)]" />
            </button>

            {/* Content */}
            <div className="relative p-6 pt-8 sm:p-8 sm:pt-10">
              {/* Moogle mascot */}
              <div className="flex justify-center mb-4">
                <motion.img
                  src={mailMoogle}
                  alt="A moogle delivering a welcome message"
                  className="w-24 sm:w-28 drop-shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                />
              </div>

              {/* Step content */}
              <div>
                <h2
                  id="welcome-title"
                  className="text-2xl sm:text-3xl font-display font-bold text-center text-[var(--bento-text)] mb-5"
                >
                  {steps[step].title}
                </h2>
                {steps[step].content}
              </div>

              {/* Step indicators */}
              <div className="flex justify-center gap-2 mt-6 mb-4">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === step
                        ? 'bg-[var(--bento-primary)] scale-110'
                        : 'bg-[var(--bento-border)] hover:bg-[var(--bento-text-muted)]/30'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                    aria-current={i === step ? 'step' : undefined}
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-3 mt-4">
                {step > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setStep(step - 1)}
                    className="px-6"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="px-8 gap-2 group"
                >
                  {step === steps.length - 1 ? (
                    <>
                      Let's Go!
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
              </div>

              {/* Skip link */}
              {step < steps.length - 1 && (
                <button
                  onClick={handleClose}
                  className="block mx-auto mt-4 text-sm text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] transition-colors underline-offset-4 hover:underline"
                >
                  Skip for now
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
