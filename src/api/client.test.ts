import { describe, it, expect } from 'vitest';
import apiClient from '@/api/client';

describe('apiClient', () => {
  it('should have correct default configuration', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should use /api as base URL by default', () => {
    // test/dev always go through the vite proxy base url
    expect(apiClient.defaults.baseURL).toBe('/api');
  });
});
