import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { refreshAuthToken } from "@/shared/api/client";

// User info extracted from JWT token
export interface User {
  memberName: string;
  memberRank: string;
  memberPortraitUrl: string;
  hasKnighthood: boolean;
  hasTemporaryKnighthood: boolean;
  /** Date of user's first MogTome login (ISO string), set by backend on first-ever login */
  firstLoginDate?: string;
  /** User's Discord ID */
  discordId: string;
}

// JWT payload structure from our API
interface JwtPayload {
  aud: string;
  iss: string;
  exp: number;
  nbf: number;
  discordId: string;
  memberName: string;
  memberRank: string;
  memberPortraitUrl: string;
  hasKnighthood: string;
  hasTemporaryKnighthood: string;
  /** Date of user's first MogTome login (ISO string) - set by backend on first-ever login */
  firstMogTomeLoginDate?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_TOKEN_KEY = "mogtome_auth_token";
const RETURN_URL_KEY = "mogtome_return_url";

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// localStorage, not sessionStorage: the Discord OAuth round-trip can drop
// sessionStorage in some browsers
export const getReturnUrl = (): string | null => {
  return localStorage.getItem(RETURN_URL_KEY);
};

export const setReturnUrl = (url: string): void => {
  localStorage.setItem(RETURN_URL_KEY, url);
};

export const clearReturnUrl = (): void => {
  localStorage.removeItem(RETURN_URL_KEY);
};

// no signature verification needed; the server already verified it
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // Base64url decode
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(payload: JwtPayload): boolean {
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

// threshold defaults to 5 minutes before expiration
function isTokenExpiringSoon(
  payload: JwtPayload,
  thresholdSeconds: number = 300,
): boolean {
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now < thresholdSeconds;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // guards against overlapping refresh calls
  const isRefreshingRef = useRef(false);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // schedule a proactive refresh before expiry, recording the expected time so
  // the visibility handler can detect a timer that never fired
  const scheduleTokenRefresh = useCallback(
    (payload: JwtPayload) => {
      clearRefreshTimer();

      const now = Math.floor(Date.now() / 1000);
      const expiresIn = payload.exp - now;

      // 5 min before expiry, with a 10s floor to avoid a tight loop near expiry
      const refreshInSeconds = Math.max(10, expiresIn - 300);
      const refreshIn = refreshInSeconds * 1000;

      const expectedRefreshTime = Date.now() + refreshIn;
      sessionStorage.setItem(
        "mogtome_expected_refresh",
        expectedRefreshTime.toString(),
      );

      refreshTimerRef.current = setTimeout(async () => {
        if (isRefreshingRef.current) return;
        isRefreshingRef.current = true;

        try {
          const newToken = await refreshAuthToken();
          if (newToken) {
            // the listener below picks this up and calls refreshUser
            window.dispatchEvent(new CustomEvent("auth-token-refreshed"));
          }
        } catch {
          // let it lapse; user gets logged out when the token expires
        } finally {
          isRefreshingRef.current = false;
        }
      }, refreshIn);
    },
    [clearRefreshTimer],
  );

  // load the user from the stored JWT, refreshing via cookie when needed
  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      // no token stored, but the refresh-token cookie may still get us one
      if (!isRefreshingRef.current) {
        isRefreshingRef.current = true;
        try {
          const newToken = await refreshAuthToken();
          if (newToken) {
            // re-run to process the freshly minted token
            isRefreshingRef.current = false;
            return refreshUser();
          }
        } catch {
          // refresh failed silently
        } finally {
          isRefreshingRef.current = false;
        }
      }

      clearRefreshTimer();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    const payload = decodeJwtPayload(token);

    if (!payload || isTokenExpired(payload)) {
      // invalid or expired; fall back to the refresh-token cookie
      clearAuthToken();

      if (!isRefreshingRef.current) {
        isRefreshingRef.current = true;
        try {
          const newToken = await refreshAuthToken();
          if (newToken) {
            // re-run to process the freshly minted token
            isRefreshingRef.current = false;
            return refreshUser();
          }
        } catch {
          // refresh failed silently
        } finally {
          isRefreshingRef.current = false;
        }
      }

      clearRefreshTimer();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return;
    }

    // expiring soon: refresh in the background, don't block this load
    if (isTokenExpiringSoon(payload)) {
      if (!isRefreshingRef.current) {
        isRefreshingRef.current = true;
        refreshAuthToken()
          .then((newToken) => {
            if (newToken) {
              window.dispatchEvent(new CustomEvent("auth-token-refreshed"));
            }
          })
          .finally(() => {
            isRefreshingRef.current = false;
          });
      }
    } else {
      scheduleTokenRefresh(payload);
    }

    setState({
      user: {
        memberName: payload.memberName,
        memberRank: payload.memberRank,
        memberPortraitUrl: payload.memberPortraitUrl,
        hasKnighthood:
          payload.memberRank == "Moogle Knight" ||
          payload.memberRank == "Moogle Guardian",
        hasTemporaryKnighthood: false,
        firstLoginDate: payload.firstMogTomeLoginDate,
        discordId: payload.discordId,
      },
      isLoading: false,
      isAuthenticated: true,
    });
  }, [clearRefreshTimer, scheduleTokenRefresh]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // token refresh/expiry events come from the API client
  useEffect(() => {
    const handleTokenRefreshed = () => {
      refreshUser();
    };

    const handleTokenExpired = () => {
      clearRefreshTimer();
      clearAuthToken();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    };

    window.addEventListener("auth-token-refreshed", handleTokenRefreshed);
    window.addEventListener("auth-token-expired", handleTokenExpired);

    return () => {
      window.removeEventListener("auth-token-refreshed", handleTokenRefreshed);
      window.removeEventListener("auth-token-expired", handleTokenExpired);
      clearRefreshTimer();
    };
  }, [refreshUser, clearRefreshTimer]);

  // re-check on tab visible / back online: a sleeping or backgrounded tab can
  // miss the scheduled refresh timer, so verify auth proactively here
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshUser();
      }
    };

    const handleOnline = () => {
      refreshUser();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
    };
  }, [refreshUser]);

  const login = useCallback(() => {
    // remember where to land after login (skip auth pages to avoid a loop)
    const currentPath =
      window.location.pathname + window.location.search + window.location.hash;
    if (!currentPath.startsWith("/auth/")) {
      setReturnUrl(currentPath);
    }

    // use the current origin so this works on localhost, mogtome.com, etc.
    const redirectUrl = `${window.location.origin}/auth/callback`;

    const loginUrl = new URL("https://api.mogtome.com/auth/discord/login");
    loginUrl.searchParams.set("redirect", redirectUrl);

    window.location.href = loginUrl.toString();
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
