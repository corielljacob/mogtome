import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';

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
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-3 border-[var(--bento-primary)]/20 border-t-[var(--bento-primary)] animate-spin" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[var(--bento-bg)] bento-bg-mesh transition-colors duration-300">
          <Navbar />
          <main>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/members" element={<Members />} />
                <Route path="/chronicle" element={<Chronicle />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
