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
    // Skip on mobile devices
    const isMobile = window.innerWidth < 768;
    if (!hasSeenWelcome && !isMobile) {
      // Small delay to let the page load first
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

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
  }, [isOpen, handleClose]);

  const handleNext = () => {
    if (step < 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const steps = [
    {
      title: "Welcome to MogTome!",
      content: (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-2 text-[var(--secondary)]">
            <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-accent text-lg sm:text-xl">Grand Opening, kupo!</span>
            <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 scale-x-[-1]" />
          </div>
          <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed">
            We're so excited you're here! MogTome is the cozy digital home for our Free Company, 
            <span className="font-semibold text-[var(--primary)]"> Kupo Life!</span>
          </p>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            This is a place where our moogle family can gather, share adventures, 
            and keep up with everything happening in our little corner of Eorzea.
          </p>
        </div>
      ),
    },
    {
      title: "Ready to Explore?",
      content: (
        <div className="space-y-3 sm:space-y-4 text-center">
          <div className="flex justify-center">
            <div className="animate-float-gentle">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--primary)] fill-[var(--primary)]/30" />
            </div>
          </div>
          <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed">
            Browse our <span className="font-semibold text-[var(--primary)]">Members</span> page to see our FC family, 
            check out the <span className="font-semibold text-[var(--secondary)]">Chronicle</span> for updates, 
            or just enjoy the vibes!
          </p>
          <p className="text-[var(--text-muted)] font-accent text-base sm:text-lg">
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
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
            className="relative w-full max-w-lg max-h-[90vh] max-h-[90dvh] overflow-y-auto bg-[var(--card)] rounded-2xl shadow-sm border-2 border-[var(--border)]"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Decorative header border */}\n            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--primary)]/20 pointer-events-none" />

            {/* Floating sparkles decoration - hidden on very small screens */}
            <div className="absolute top-3 sm:top-4 left-4 sm:left-6 opacity-60 hidden xs:block">
              <div className="animate-[spin_6s_linear_infinite]">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--secondary)]" />
              </div>
            </div>
            <div className="absolute top-16 sm:top-20 right-12 sm:right-16 opacity-60 pointer-events-none hidden xs:block">
              <div className="animate-[spin_5s_linear_infinite_reverse]">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
              </div>
            </div>

            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 rounded-full hover:bg-[var(--bg)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
              aria-label="Close welcome dialog"
            >
              <X className="w-5 h-5 text-[var(--text-muted)]" />
            </button>

            {/* Content */}
            <div className="relative px-4 py-5 pt-6 sm:p-6 sm:pt-8 md:p-8 md:pt-10">
              {/* Moogle mascot */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <img
                  src={mailMoogle}
                  alt="A moogle delivering a welcome message"
                  className="w-20 sm:w-24 md:w-28 drop-shadow-lg animate-[fadeSlideIn_0.5s_ease-out_0.2s_both]"
                />
              </div>

              {/* Step content */}
              <div>
                <h2
                  id="welcome-title"
                  className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-center text-[var(--text)] mb-3 sm:mb-4 md:mb-5"
                >
                  {steps[step].title}
                </h2>
                {steps[step].content}
              </div>

              {/* Step indicators */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 mb-3 sm:mb-4">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                      i === step
                        ? 'bg-[var(--primary)] scale-110'
                        : 'bg-[var(--border)] hover:bg-[var(--text-muted)]/30'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                    aria-current={i === step ? 'step' : undefined}
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                {step > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => setStep(step - 1)}
                    className="px-4 sm:px-6 text-sm sm:text-base"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="px-6 sm:px-8 gap-2 group text-sm sm:text-base"
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
                  className="block mx-auto mt-3 sm:mt-4 text-xs sm:text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors underline-offset-4 hover:underline"
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
