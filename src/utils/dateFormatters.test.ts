import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime, formatFullDate } from './dateFormatters';

describe('dateFormatters', () => {
  beforeEach(() => {
    // Mock current time to 2026-01-15 12:00:00 UTC
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatRelativeTime', () => {
    it('returns "today" for events less than an hour ago', () => {
      expect(formatRelativeTime('2026-01-15T11:30:00Z')).toBe('today');
      expect(formatRelativeTime('2026-01-15T11:59:00Z')).toBe('today');
    });

    it('returns hours ago for events within 24 hours', () => {
      expect(formatRelativeTime('2026-01-15T10:00:00Z')).toBe('2h ago');
      expect(formatRelativeTime('2026-01-15T06:00:00Z')).toBe('6h ago');
      expect(formatRelativeTime('2026-01-14T13:00:00Z')).toBe('23h ago');
    });

    it('returns days ago for events within a week', () => {
      expect(formatRelativeTime('2026-01-14T12:00:00Z')).toBe('1d ago');
      expect(formatRelativeTime('2026-01-12T12:00:00Z')).toBe('3d ago');
      expect(formatRelativeTime('2026-01-09T12:00:00Z')).toBe('6d ago');
    });

    it('returns formatted date for events older than a week', () => {
      expect(formatRelativeTime('2026-01-08T12:00:00Z')).toBe('Jan 8');
      expect(formatRelativeTime('2025-12-25T12:00:00Z')).toBe('Dec 25');
    });
  });

  describe('formatFullDate', () => {
    it('formats date without time', () => {
      const result = formatFullDate('2026-01-15T14:30:00Z');
      // Should include day of week, month, and day number
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      // Should NOT include time
      expect(result).not.toContain(':');
      expect(result).not.toContain('PM');
      expect(result).not.toContain('AM');
    });

    it('includes weekday abbreviation', () => {
      const result = formatFullDate('2026-01-15T12:00:00Z');
      // Jan 15, 2026 is a Thursday
      expect(result).toContain('Thu');
    });
  });
});
