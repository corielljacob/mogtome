import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { setAuthToken, useAuth } from '../contexts/AuthContext';

type CallbackStatus = 'processing' | 'success' | 'error';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<CallbackStatus>('processing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Check for error from Discord or backend
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setStatus('error');
        setError(errorDescription || 'Authentication was cancelled or failed');
        return;
      }

      // Check if we received a token directly from the backend redirect
      const token = searchParams.get('token');
      
      if (token) {
        // Backend redirected with token - store it and refresh user
        setAuthToken(token);
        await refreshUser();
        setStatus('success');
        
        // Redirect to home after a brief delay to show success
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
        return;
      }

      // If no token and no error, something went wrong
      setStatus('error');
      setError('No authentication token received. Please try logging in again.');
    };

    handleCallback();
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-[var(--bento-card)] rounded-3xl p-8 shadow-xl border border-[var(--bento-primary)]/10 text-center">
          {status === 'processing' && (
            <>
              <motion.div
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--bento-primary)]/20 to-[var(--bento-secondary)]/20 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-8 h-8 text-[var(--bento-primary)]" />
              </motion.div>
              <h2 className="font-display text-xl font-bold text-[var(--bento-text)] mb-2">
                Logging you in, kupo~!
              </h2>
              <p className="text-[var(--bento-text-muted)] font-soft">
                Just a moment while we complete your Discord authentication...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <motion.div
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <CheckCircle className="w-8 h-8 text-green-500" />
              </motion.div>
              <h2 className="font-display text-xl font-bold text-[var(--bento-text)] mb-2">
                Welcome back, kupo!
              </h2>
              <p className="text-[var(--bento-text-muted)] font-soft">
                Authentication successful! Redirecting you now...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <motion.div
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <AlertCircle className="w-8 h-8 text-red-500" />
              </motion.div>
              <h2 className="font-display text-xl font-bold text-[var(--bento-text)] mb-2">
                Oh no, kupo!
              </h2>
              <p className="text-[var(--bento-text-muted)] font-soft mb-6">
                {error}
              </p>
              <button
                onClick={() => navigate('/', { replace: true })}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)] text-white font-soft font-semibold shadow-lg shadow-[var(--bento-primary)]/25 hover:shadow-xl hover:scale-105 transition-all"
              >
                Return Home
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
