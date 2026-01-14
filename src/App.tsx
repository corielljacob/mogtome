import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { InstallPrompt } from './components/InstallPrompt';

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

// Minimal loading fallback - keeps layout stable during lazy load
function PageLoader() {
  return (
    <div className="min-h-[calc(100dvh-4.5rem)] flex items-center justify-center pb-mobile-nav md:pb-0">
      <div className="w-10 h-10 rounded-full border-3 border-[var(--bento-primary)]/20 border-t-[var(--bento-primary)] animate-spin" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Edge-to-edge: background extends behind iOS status bar & home indicator */}
        <div className="min-h-screen min-h-[100dvh] bg-[var(--bento-bg)] bento-bg-mesh transition-colors duration-300">
          <Navbar />
          <main 
            className="pb-mobile-nav md:pb-0"
            style={{ 
              paddingLeft: 'env(safe-area-inset-left, 0px)',
              paddingRight: 'env(safe-area-inset-right, 0px)'
            }}
          >
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/members" element={<Members />} />
                <Route path="/chronicle" element={<Chronicle />} />
              </Routes>
            </Suspense>
          </main>
          
          {/* Mobile bottom navigation - native app feel */}
          <MobileNav />
          
          {/* PWA install prompt */}
          <InstallPrompt />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
