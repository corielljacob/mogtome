import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * InstallPrompt - Shows a native-feeling prompt to install the PWA.
 * 
 * Only appears when:
 * - Browser supports PWA installation
 * - User hasn't dismissed it recently
 * - App isn't already installed
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    
    if (isStandalone) return;
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      // Don't show for 7 days after dismissal
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after a short delay so user sees some content first
      setTimeout(() => setIsVisible(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  return (
    <AnimatePresence>
      {isVisible && deferredPrompt && (
        <motion.div
          className="
            fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm
            z-50
          "
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ 
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4rem)',
          }}
        >
          <div className="
            relative bg-[var(--bento-card)] 
            border border-[var(--bento-primary)]/20
            rounded-2xl p-4 
            shadow-2xl shadow-[var(--bento-primary)]/20
          ">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] rounded-t-2xl" />
            
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="
                flex-shrink-0 w-12 h-12 rounded-xl
                bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)]
                flex items-center justify-center
                shadow-lg shadow-[var(--bento-primary)]/25
              ">
                <Download className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-[var(--bento-text)] text-base mb-0.5 flex items-center gap-2">
                  Add to Home Screen
                  <Sparkles className="w-4 h-4 text-[var(--bento-secondary)]" />
                </h3>
                <p className="text-sm text-[var(--bento-text-muted)] font-soft leading-snug">
                  Install MogTome for a faster, native app experience, kupo!
                </p>
              </div>
              
              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="
                  flex-shrink-0 w-8 h-8 rounded-lg
                  flex items-center justify-center
                  text-[var(--bento-text-muted)] hover:text-[var(--bento-text)]
                  hover:bg-[var(--bento-bg)]
                  transition-colors cursor-pointer
                "
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleDismiss}
                className="
                  flex-1 px-4 py-2.5 rounded-xl
                  text-sm font-soft font-semibold
                  text-[var(--bento-text-muted)]
                  bg-[var(--bento-bg)] 
                  hover:bg-[var(--bento-primary)]/5
                  transition-colors cursor-pointer
                "
              >
                Maybe Later
              </button>
              <motion.button
                onClick={handleInstall}
                disabled={isInstalling}
                className="
                  flex-1 px-4 py-2.5 rounded-xl
                  text-sm font-soft font-semibold text-white
                  bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]
                  shadow-lg shadow-[var(--bento-primary)]/25
                  hover:shadow-xl hover:shadow-[var(--bento-primary)]/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all cursor-pointer
                  flex items-center justify-center gap-2
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isInstalling ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Install
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
