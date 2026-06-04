import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

// dev/test go through the Vite proxy to dodge CORS on localhost; prod uses
// the env base url (or the public API as fallback)
const API_BASE_URL =
  import.meta.env.DEV || import.meta.env.MODE === "test"
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL || "https://api.mogtome.com";

const AUTH_TOKEN_KEY = "mogtome_auth_token";

// guards against firing multiple refresh calls when several requests 401 at once
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeToTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function onRefreshFailed() {
  refreshSubscribers = [];
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send auth cookies
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * The refresh token lives in an HttpOnly cookie, so hitting this endpoint with
 * credentials is enough - the backend reads the cookie and issues a fresh JWT.
 * Returns the new token, or null on failure.
 */
async function refreshAuthToken(): Promise<string | null> {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/discord/refresh`, {
      withCredentials: true, // carries the HttpOnly refresh cookie
    });

    const newToken = response.data?.token;
    if (newToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      return newToken;
    }
    return null;
  } catch {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // refresh once per request, only on 401
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // a refresh is already in flight - queue this request behind it
        return new Promise((resolve, reject) => {
          subscribeToTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
          // bail out if the in-flight refresh never resolves
          setTimeout(() => {
            if (isRefreshing) {
              reject(error);
            }
          }, 10000);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAuthToken();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          onTokenRefreshed(newToken);
          isRefreshing = false;

          // let AuthContext sync its state
          window.dispatchEvent(new CustomEvent("auth-token-refreshed"));

          return apiClient(originalRequest);
        } else {
          onRefreshFailed();
          isRefreshing = false;
          window.dispatchEvent(new CustomEvent("auth-token-expired"));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        onRefreshFailed();
        isRefreshing = false;
        window.dispatchEvent(new CustomEvent("auth-token-expired"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
export { refreshAuthToken };
