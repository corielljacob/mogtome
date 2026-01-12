import axios from 'axios';

// Vite dev server proxies /api to the Azure API; prod should swap to env-backed base URL
const API_BASE_URL = '/api';

// Axios client with shared defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
