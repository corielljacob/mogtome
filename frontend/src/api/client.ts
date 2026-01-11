import axios from 'axios';

// In development, requests to /api are proxied by Vite to the Azure API
// In production, this should be updated to the actual API URL or use env vars
const API_BASE_URL = '/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
