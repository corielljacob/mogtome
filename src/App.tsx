import { lazy, Suspense, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { Navbar, Sidebar, ProtectedRoute, KnightRoute, WelcomeDialog, MissingUserDataDialog } from './components';
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider, useAccessibility } from './contexts/AccessibilityContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Error boundary to catch chunk loading failures after deployments
class ChunkErrorBoundary extends Component<{ children: ReactNode }> {
  static getDerivedStateFromError(error: Error): null {
    // Check if this is a chunk loading error (dynamic import failure)
    if (
      error.name === 'ChunkLoadError' ||
      error.message?.includes('Failed to fetch dynamically imported module') ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Loading CSS chunk')
    ) {
      // Auto-refresh the page to get the latest assets
      window.location.reload();
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
    console.error('Chunk loading error:', error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

// Lazy load pages for code splitting - reduces initial bundle size
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Members = lazy(() => import('./pages/Members').then(m => ({ default: m.Members })));
const Chronicle = lazy(() => import('./pages/Chronicle').then(m => ({ default: m.Chronicle })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const AuthCallback = lazy(() => import('./pages/AuthCallback').then(m => ({ default: m.AuthCallback })));
const Logout = lazy(() => import('./pages/Logout').then(m => ({ default: m.Logout })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const KnightDashboard = lazy(() => import('./pages/KnightDashboard').then(m => ({ default: m.KnightDashboard })));
const Debug = lazy(() => import('./pages/Debug').then(m => ({ default: m.Debug })));

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
    <div className="min-h-[100dvh] flex items-center justify-center pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
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
      <div className="min-h-[100dvh] bg-[var(--bento-bg)] bento-bg-mesh transition-colors duration-300 overflow-x-hidden flex">
        
        {/* First-visit welcome dialog */}
        <WelcomeDialog />
        
        {/* Missing user data warning dialog */}
        <MissingUserDataDialog />
        
        {/* Skip to main content link for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        {/* Desktop sidebar navigation */}
        <Sidebar />
        
        {/* Main content area */}
        <div className="flex-1 min-w-0 overflow-x-hidden">
          {/* Mobile top bar + desktop user controls */}
          <Navbar />
          
          <main id="main-content" tabIndex={-1}>
            <ChunkErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/chronicle" element={<ProtectedRoute><Chronicle /></ProtectedRoute>} />
                  <Route path="/about" element={<About />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/auth/logout" element={<Logout />} />
                  <Route path="/dashboard" element={<KnightRoute><KnightDashboard /></KnightRoute>} />
                  <Route path="/debug" element={<Debug />} />
                </Routes>
              </Suspense>
            </ChunkErrorBoundary>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AccessibilityProvider>
              <AppContent />
            </AccessibilityProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
