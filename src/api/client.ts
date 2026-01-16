import axios from 'axios';

// Use an env-provided base URL in production; fall back to /api for local proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const AUTH_TOKEN_KEY = 'mogtome_auth_token';

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

export default apiClient;
