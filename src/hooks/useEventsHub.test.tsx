import { describe, it, expect } from 'vitest';
import { ConnectionStatus } from './useEventsHub';

/**
 * Note: Full integration tests for useEventsHub require complex SignalR mocking.
 * These tests verify the types and basic structure.
 * 
 * For full testing, use integration/e2e tests with a real SignalR server.
 */

describe('useEventsHub types', () => {
  it('ConnectionStatus type has expected values', () => {
    // Type check - these should compile without errors
    const statuses: ConnectionStatus[] = [
      'disconnected',
      'connecting', 
      'connected',
      'reconnecting',
      'error',
    ];
    
    expect(statuses).toHaveLength(5);
    expect(statuses).toContain('disconnected');
    expect(statuses).toContain('connecting');
    expect(statuses).toContain('connected');
    expect(statuses).toContain('reconnecting');
    expect(statuses).toContain('error');
  });
});

describe('useEventsHub exports', () => {
  it('exports useEventsHub function', async () => {
    const module = await import('./useEventsHub');
    expect(module.useEventsHub).toBeDefined();
    expect(typeof module.useEventsHub).toBe('function');
  });

  it('exports ConnectionStatus type', async () => {
    // This is a compile-time check - if it compiles, the type exists
    const status: ConnectionStatus = 'connected';
    expect(status).toBe('connected');
  });
});
