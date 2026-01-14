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

// Premium loading fallback - native-style with delight
function PageLoader() {
  return (
    <motion.div 
      className="min-h-[100dvh] md:min-h-[calc(100dvh-4.5rem)] flex flex-col items-center justify-center pb-mobile-nav md:pb-0 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Premium spinner with gradient */}
      <motion.div 
        className="relative w-10 h-10 mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-[var(--bento-primary)]/10 blur-xl scale-150" />
        
        {/* Spinner ring */}
        <motion.div 
          className="relative w-10 h-10 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, var(--bento-primary) 60deg, transparent 120deg)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          {/* Inner circle to create ring effect */}
          <div className="absolute inset-[3px] rounded-full bg-[var(--bento-bg)]" />
        </motion.div>
      </motion.div>
      
      <motion.p 
        className="text-sm font-soft font-medium text-[var(--bento-text-muted)]"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: [0.6, 1, 0.6], y: 0 }}
        transition={{ opacity: { duration: 1.5, repeat: Infinity }, y: { duration: 0.2 } }}
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
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.995 }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                  mass: 0.7,
                  opacity: { duration: 0.18, ease: "easeOut" },
                  scale: { duration: 0.2, ease: "easeOut" }
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
