import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider, useAccessibility } from './contexts/AccessibilityContext';

// Lazy load pages for code splitting - reduces initial bundle size
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Members = lazy(() => import('./pages/Members').then(m => ({ default: m.Members })));
const Chronicle = lazy(() => import('./pages/Chronicle').then(m => ({ default: m.Chronicle })));
const AuthCallback = lazy(() => import('./pages/AuthCallback').then(m => ({ default: m.AuthCallback })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// Minimal loading fallback - keeps layout stable during lazy load
function PageLoader() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-3 border-[var(--bento-primary)]/20 border-t-[var(--bento-primary)] animate-spin" />
    </div>
  );
}

// Inner app content that has access to accessibility context
function AppContent() {
  const { settings } = useAccessibility();
  
  return (
    <MotionConfig 
      reducedMotion={settings.reducedMotion ? 'always' : 'never'}
      // Set global transition duration to 0 when reduced motion is on
      transition={settings.reducedMotion ? { duration: 0 } : undefined}
    >
      <div className="min-h-screen bg-[var(--bento-bg)] bento-bg-mesh transition-colors duration-300">
        {/* Skip to main content link for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="pb-[calc(70px+var(--safe-area-inset-bottom))] md:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/members" element={<Members />} />
              <Route path="/chronicle" element={<Chronicle />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </MotionConfig>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AccessibilityProvider>
            <AppContent />
          </AccessibilityProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
