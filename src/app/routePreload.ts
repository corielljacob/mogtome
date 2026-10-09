import type { QueryClient } from "@tanstack/react-query";
import { memberDirectoryQuery, staffQuery } from "@/shared/api/memberQueries";

export const routeLoaders = {
  "/": () =>
    import("@/features/home/HomePage").then((m) => ({ default: m.Home })),
  "/members": () =>
    import("@/features/members/MembersPage").then((m) => ({
      default: m.Members,
    })),
  "/chronicle": () =>
    import("@/app/ChronicleRoute").then((m) => ({ default: m.ChronicleRoute })),
  "/about": () =>
    import("@/features/about/AboutPage").then((m) => ({ default: m.About })),
  "/settings": () =>
    import("@/features/settings/SettingsPage").then((m) => ({
      default: m.Settings,
    })),
  "/profile": () =>
    import("@/features/profile/ProfilePage").then((m) => ({
      default: m.Profile,
    })),
  "/dashboard": () =>
    import("@/features/knights/KnightDashboardPage").then((m) => ({
      default: m.KnightDashboard,
    })),
  "/auth/callback": () =>
    import("@/features/auth/AuthCallbackPage").then((m) => ({
      default: m.AuthCallback,
    })),
  "/auth/logout": () =>
    import("@/features/auth/LogoutPage").then((m) => ({ default: m.Logout })),
  "/debug": () =>
    import("@/features/debug/DebugPage").then((m) => ({ default: m.Debug })),
};

export function preloadRoute(path: string, queryClient: QueryClient) {
  if (!Object.prototype.hasOwnProperty.call(routeLoaders, path))
    return Promise.resolve();
  // A failed speculative import must not interrupt navigation or become an
  // unhandled rejection. The actual route still owns loading and error handling.
  const code = routeLoaders[path as keyof typeof routeLoaders]().then(
    () => undefined,
    () => undefined,
  );
  if (path === "/members") void queryClient.prefetchQuery(memberDirectoryQuery);
  if (path === "/about") void queryClient.prefetchQuery(staffQuery);
  // Private data is fetched by authenticated views, never by link previews.
  return code;
}
