import { lazy, Suspense, Component, useEffect } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/app/Navbar";
import { ScrapbookNav } from "@/app/ScrapbookNav";
import { ProtectedRoute } from "@/app/ProtectedRoute";
import { KnightRoute } from "@/app/KnightRoute";
import { MissingUserDataDialog } from "@/app/MissingUserDataDialog";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { AccessibilityProvider } from "@/shared/contexts/AccessibilityContext";
import { ThemeProvider } from "@/shared/contexts/ThemeContext";
import {
  NavExpandedProvider,
  useNavExpanded,
} from "@/shared/contexts/NavExpandedContext";
import { jumpAppToTop } from "@/shared/lib/scroll";

// catches stale-chunk failures after a deploy and reloads to fetch fresh assets
class ChunkErrorBoundary extends Component<{ children: ReactNode }> {
  static getDerivedStateFromError(error: Error): null {
    if (
      error.name === "ChunkLoadError" ||
      error.message?.includes("Failed to fetch dynamically imported module") ||
      error.message?.includes("Loading chunk") ||
      error.message?.includes("Loading CSS chunk")
    ) {
      window.location.reload();
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Chunk loading error:", error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

const Home = lazy(() =>
  import("@/features/home/HomePage").then((m) => ({ default: m.Home })),
);
const Members = lazy(() =>
  import("@/features/members/MembersPage").then((m) => ({
    default: m.Members,
  })),
);
const Chronicle = lazy(() =>
  import("@/features/chronicle/ChroniclePage").then((m) => ({
    default: m.Chronicle,
  })),
);
const About = lazy(() =>
  import("@/features/about/AboutPage").then((m) => ({ default: m.About })),
);
const AuthCallback = lazy(() =>
  import("@/features/auth/AuthCallbackPage").then((m) => ({
    default: m.AuthCallback,
  })),
);
const Logout = lazy(() =>
  import("@/features/auth/LogoutPage").then((m) => ({ default: m.Logout })),
);
const Settings = lazy(() =>
  import("@/features/settings/SettingsPage").then((m) => ({
    default: m.Settings,
  })),
);
const Profile = lazy(() =>
  import("@/features/profile/ProfilePage").then((m) => ({
    default: m.Profile,
  })),
);
const KnightDashboard = lazy(() =>
  import("@/features/knights/KnightDashboardPage").then((m) => ({
    default: m.KnightDashboard,
  })),
);
const Debug = lazy(() =>
  import("@/features/debug/DebugPage").then((m) => ({ default: m.Debug })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-[100lvh] flex items-center justify-center pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="w-10 h-10 rounded-full border-3 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
    </div>
  );
}

function AppContent() {
  const { expanded: navExpanded } = useNavExpanded();
  const location = useLocation();
  // Home has its own bg; every other page gets the page pattern.
  const isHome = location.pathname === "/";

  // Content pages get a left gutter so the centered corkboard clears the fixed
  // nav rail (or the wider pinned sidebar). HOME gets NO gutter: its background
  // atmosphere + glow run edge to edge under the floating nav, so a gutter there
  // would cut the glow off at the padding line and leave a seam beside the nav.
  const contentClass = [
    isHome ? "h-[100dvh] md:h-auto md:min-h-[100lvh]" : "min-h-[100lvh]",
    "overflow-x-clip",
    isHome
      ? ""
      : `transition-[padding] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${navExpanded ? "md:pl-[17rem]" : "md:pl-16"}`,
  ]
    .filter(Boolean)
    .join(" ");

  // Start each view at the top on navigation - the document (window) is the
  // scroller, and its scroll position carries across client-side route changes.
  useEffect(() => {
    jumpAppToTop();
  }, [location.pathname]);

  // Phones: pin the home view to the visible viewport (base.css html[data-home])
  // so it never scrolls. The flat page background is painted on the <html> canvas,
  // so it still fills the whole screen behind the iOS chrome. Other pages scroll.
  useEffect(() => {
    const root = document.documentElement;
    if (isHome) root.setAttribute("data-home", "");
    else root.removeAttribute("data-home");
    return () => root.removeAttribute("data-home");
  }, [isHome]);

  // While the viewport is actively resizing (orientation change, or iOS Safari
  // collapsing/expanding its toolbars on scroll), mark <html data-resizing> so
  // the global CSS freeze (animations.css) suspends transitions/animations.
  // Without it, spring/overshoot transitions and the Home view's transform
  // layers can render a transient oversized/stale frame that only corrects on a
  // reflow. (Page heights are pure CSS now - 100lvh - so nothing to re-measure.)
  useEffect(() => {
    const root = document.documentElement;
    let timer: number | undefined;
    const onResize = () => {
      root.setAttribute("data-resizing", "");
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(
        () => root.removeAttribute("data-resizing"),
        180,
      );
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (timer) window.clearTimeout(timer);
      root.removeAttribute("data-resizing");
    };
  }, []);

  return (
    <div>
      {/* The page background lives on the <html> element (base.css) so the
            browser canvas paints it across the whole viewport - no fixed layer
            that undershoots on iOS, no chin/forehead. On desktop home, the full-
            viewport atmosphere (BackgroundAtmospherics) paints behind the nav too,
            so the nav reads as a card floating on it - no left-edge seam. */}

      <MissingUserDataDialog />

      {/* keyboard skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrapbookNav />

      {/* The viewport scrolls the document natively. This wrapper just holds
            the page (left-gutter logic for the fixed nav lives in contentClass
            above). overflow-x-clip is the horizontal guard for stray
            decorations: it clips sideways overflow WITHOUT creating a scroll
            container, so the native body scroll (and iOS toolbar-collapse) keeps
            working.

            CRITICAL: do NOT make this a `flex flex-col` with a `flex-1` <main>.
            Combined with min-h-[100lvh] that gives <main> a one-screen-tall BOX
            that taller content merely overflows - and iOS Safari fills behind its
            toolbar based on that box, so content hard-stops at the screen edge
            instead of running under the toolbar. A plain block <main> whose box
            grows with its content is what lets content render behind the toolbar
            (verified against a bare HTML page). Pages fill the screen via their
            own min-h-[100lvh] (PageLayout / Home), not a flex stretch. */}
      <div className={contentClass}>
        <Navbar />

        <main id="main-content" tabIndex={-1}>
          <ChunkErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/members" element={<Members />} />
                <Route
                  path="/chronicle"
                  element={
                    <ProtectedRoute>
                      <Chronicle />
                    </ProtectedRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/logout" element={<Logout />} />
                <Route
                  path="/dashboard"
                  element={
                    <KnightRoute>
                      <KnightDashboard />
                    </KnightRoute>
                  }
                />
                <Route path="/debug" element={<Debug />} />
              </Routes>
            </Suspense>
          </ChunkErrorBoundary>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AccessibilityProvider>
              <NavExpandedProvider>
                <AppContent />
              </NavExpandedProvider>
            </AccessibilityProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
