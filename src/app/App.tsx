import {
  lazy,
  memo,
  Suspense,
  Component,
  useEffect,
  useLayoutEffect,
} from "react";
import type { ReactNode, ErrorInfo, SyntheticEvent } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/app/Navbar";
import { KnightRoute } from "@/app/KnightRoute";
import { MissingUserDataDialog } from "@/app/MissingUserDataDialog";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { AccessibilityProvider } from "@/shared/contexts/AccessibilityContext";
import { ThemeProvider, useTheme } from "@/shared/contexts/ThemeContext";
import { NookWallpaper } from "@/features/home/components/NookWallpaper";
import { NavExpandedProvider } from "@/shared/contexts/NavExpandedContext";
import { jumpAppToTop } from "@/shared/lib/scroll";
import { preloadRoute, routeLoaders } from "./routePreload";
import "@/shared/styles/inner-page.css";

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

const Home = lazy(routeLoaders["/"]);
const Members = lazy(routeLoaders["/members"]);
const Chronicle = lazy(routeLoaders["/chronicle"]);
const About = lazy(routeLoaders["/about"]);
const AuthCallback = lazy(routeLoaders["/auth/callback"]);
const Logout = lazy(routeLoaders["/auth/logout"]);
const Settings = lazy(routeLoaders["/settings"]);
const Profile = lazy(routeLoaders["/profile"]);
const KnightDashboard = lazy(routeLoaders["/dashboard"]);
const Debug = lazy(routeLoaders["/debug"]);
const Wallpaper = memo(NookWallpaper);

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
    <div className="app-page-loader min-h-[calc(100dvh-var(--app-header-height))] flex items-center justify-center pb-[env(safe-area-inset-bottom)]">
      <div className="w-10 h-10 rounded-full border-3 border-[var(--primary)]/20 border-t-[var(--primary)] animate-spin" />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const { isDarkMode, activeEvent, isEventThemeActive, settings } = useTheme();
  const event = isEventThemeActive ? activeEvent : null;
  const isHome = location.pathname === "/";
  const isFamily = location.pathname === "/members";
  const isChronicle = location.pathname === "/chronicle";
  const isAbout = location.pathname === "/about";
  const isDashboard = location.pathname === "/dashboard";
  const isSettings = location.pathname === "/settings";
  const contentClass = `cozy-app-content nook-theme${isHome ? " is-home" : " is-inner-page"}${isFamily ? " is-family" : ""}${isChronicle ? " is-chronicle" : ""}${isAbout ? " is-about" : ""}${isDashboard ? " is-dashboard" : ""}${isSettings ? " is-settings" : ""}`;

  // Start each view at the top on navigation - the document (window) is the
  // scroller, and its scroll position carries across client-side route changes.
  useLayoutEffect(() => {
    jumpAppToTop();
  }, [location.pathname]);

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

  function warmDestination(event: SyntheticEvent) {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download"))
      return;
    const url = new URL(link.href, window.location.href);
    if (
      url.origin === window.location.origin &&
      url.pathname !== location.pathname
    ) {
      void preloadRoute(url.pathname, queryClient);
    }
  }

  return (
    <div>
      <MissingUserDataDialog />

      {/* keyboard skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* The document remains the native scroller, including on iOS. */}
      <div
        className={contentClass}
        onPointerOverCapture={warmDestination}
        onPointerDownCapture={warmDestination}
        onFocusCapture={warmDestination}
        data-mode={isDarkMode ? "dark" : "light"}
        data-scene={event?.id ?? settings.colorTheme}
        data-holiday={event ? "true" : undefined}
      >
        <Wallpaper
          eventId={event?.id ?? null}
          colorTheme={settings.colorTheme}
        />
        <Navbar />

        <main
          id="main-content"
          className={isHome ? undefined : "inner-page-shell"}
          tabIndex={-1}
        >
          <ChunkErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/members" element={<Members />} />
                <Route path="/chronicle" element={<Chronicle />} />
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
