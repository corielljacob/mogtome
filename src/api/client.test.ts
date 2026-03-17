import { describe, it, expect } from 'vitest';
import apiClient from './client';

describe('apiClient', () => {
  it('should have correct default configuration', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should use /api as base URL by default', () => {
    // In test/dev, we always use the Vite proxy base URL.
    expect(apiClient.defaults.baseURL).toBe('/api');
  });
});
