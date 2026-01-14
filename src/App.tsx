import { lazy, Suspense, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { InstallPrompt } from './components/InstallPrompt';
import { PullToRefresh } from './components/PullToRefresh';
import { useElasticScroll } from './hooks';

// Lazy load pages for code splitting - reduces initial bundle size
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Members = lazy(() => import('./pages/Members').then(m => ({ default: m.Members })));
const Chronicle = lazy(() => import('./pages/Chronicle').then(m => ({ default: m.Chronicle })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// Minimal loading fallback - native-style skeleton
function PageLoader() {
  return (
    <motion.div 
      className="min-h-[100dvh] md:min-h-[calc(100dvh-4.5rem)] flex flex-col items-center justify-center pb-mobile-nav md:pb-0 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* iOS-style spinner */}
      <motion.div 
        className="w-8 h-8 rounded-full border-[2.5px] border-[var(--bento-primary)]/15 border-t-[var(--bento-primary)] mb-3"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.p 
        className="text-sm font-soft text-[var(--bento-text-muted)]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const qc = useQueryClient();
  
  // Add iOS-style elastic bounce on Android (bottom only)
  useElasticScroll();
  
  // Refresh function based on current page
  const handleRefresh = useCallback(async () => {
    // Invalidate queries based on current route
    if (location.pathname === '/members') {
      await qc.invalidateQueries({ queryKey: ['members-all'] });
    } else if (location.pathname === '/chronicle') {
      await qc.invalidateQueries({ queryKey: ['chronicle-events'] });
    }
    // Small delay to show the animation
    await new Promise(resolve => setTimeout(resolve, 300));
  }, [location.pathname, qc]);
  
  // Only enable PTR on pages with data
  const ptrEnabled = location.pathname === '/members' || location.pathname === '/chronicle';
  
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[var(--bento-bg)] bento-bg-mesh transition-colors duration-300">
      {/* Navbar stays fixed - outside the PullToRefresh wrapper */}
      <Navbar />
      
      {/* Pull-to-refresh wraps only the main content */}
      <PullToRefresh onRefresh={handleRefresh} enabled={ptrEnabled}>
        <main 
          className="pb-mobile-nav md:pb-0"
          style={{ 
            paddingLeft: 'env(safe-area-inset-left, 0px)',
            paddingRight: 'env(safe-area-inset-right, 0px)'
          }}
        >
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                  mass: 0.8,
                  opacity: { duration: 0.15 }
                }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/chronicle" element={<Chronicle />} />
                </Routes>
              </motion.div>
            </Suspense>
          </AnimatePresence>
        </main>
      </PullToRefresh>
      
      {/* Mobile bottom navigation - native app feel */}
      <MobileNav />
      
      {/* PWA install prompt */}
      <InstallPrompt />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
