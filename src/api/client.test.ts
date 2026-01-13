import { describe, it, expect } from 'vitest';
import apiClient from './client';

describe('apiClient', () => {
  it('should have correct default configuration', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should use /api as base URL by default', () => {
    // In test environment, VITE_API_BASE_URL is not set, so it defaults to /api
    expect(apiClient.defaults.baseURL).toBe('/api');
  });
});
