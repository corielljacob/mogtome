import axios from 'axios';

// Use an env-provided base URL in production; fall back to /api for local proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Axios client with shared defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
