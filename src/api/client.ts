import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Use an env-provided base URL in production; fall back to /api for local proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const AUTH_API_URL = 'https://api.mogtome.com';

const AUTH_TOKEN_KEY = 'mogtome_auth_token';

// Track if we're currently refreshing to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh completion
function subscribeToTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Notify all subscribers when refresh completes
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// Clear subscribers on refresh failure
function onRefreshFailed() {
  refreshSubscribers = [];
}

// Axios client with shared defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for auth
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Attempt to refresh the auth token using the refresh endpoint.
 * The refresh token is stored in an HttpOnly cookie by the backend,
 * so we just need to hit the endpoint with credentials and it will
 * read the refresh token from cookies and issue a new JWT.
 * Returns the new token on success, or null on failure.
 */
async function refreshAuthToken(): Promise<string | null> {
  try {
    const response = await axios.get(
      `${AUTH_API_URL}/auth/discord/refresh`,
      {
        withCredentials: true, // Important: sends the HttpOnly refresh token cookie
      }
    );

    const newToken = response.data?.token;
    if (newToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      return newToken;
    }
    return null;
  } catch {
    // Refresh failed - clear the JWT token
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return null;
  }
}

// Response interceptor to handle 401 errors and attempt token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt refresh on 401 errors, if we haven't already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for it to complete
        return new Promise((resolve, reject) => {
          subscribeToTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
          // Also handle the case where refresh fails
          setTimeout(() => {
            if (isRefreshing) {
              reject(error);
            }
          }, 10000); // Timeout after 10 seconds
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAuthToken();
        
        if (newToken) {
          // Update the original request with new token and retry
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          onTokenRefreshed(newToken);
          isRefreshing = false;
          
          // Dispatch event so AuthContext can update its state
          window.dispatchEvent(new CustomEvent('auth-token-refreshed'));
          
          return apiClient(originalRequest);
        } else {
          // Refresh failed, clear auth state
          onRefreshFailed();
          isRefreshing = false;
          window.dispatchEvent(new CustomEvent('auth-token-expired'));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        onRefreshFailed();
        isRefreshing = false;
        window.dispatchEvent(new CustomEvent('auth-token-expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { refreshAuthToken };
