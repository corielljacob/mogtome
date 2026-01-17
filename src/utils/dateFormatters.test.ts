import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime, formatFullDate, formatLastUpdated } from './dateFormatters';

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

  describe('formatLastUpdated', () => {
    it('returns "just now" for timestamps less than 10 seconds ago', () => {
      const now = new Date('2026-01-15T12:00:00Z').getTime();
      expect(formatLastUpdated(now - 5000)).toBe('just now');
      expect(formatLastUpdated(now - 9000)).toBe('just now');
    });

    it('returns seconds ago for timestamps less than a minute ago', () => {
      const now = new Date('2026-01-15T12:00:00Z').getTime();
      expect(formatLastUpdated(now - 15000)).toBe('15s ago');
      expect(formatLastUpdated(now - 45000)).toBe('45s ago');
    });

    it('returns minutes ago for timestamps less than an hour ago', () => {
      const now = new Date('2026-01-15T12:00:00Z').getTime();
      expect(formatLastUpdated(now - 60000)).toBe('1m ago');
      expect(formatLastUpdated(now - 300000)).toBe('5m ago');
      expect(formatLastUpdated(now - 3540000)).toBe('59m ago');
    });

    it('returns formatted time for timestamps over an hour ago', () => {
      const now = new Date('2026-01-15T12:00:00Z').getTime();
      const result = formatLastUpdated(now - 3600000); // 1 hour ago
      // Should contain time format like "11:00 AM"
      expect(result).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/i);
    });

    it('handles edge case at exactly 10 seconds', () => {
      const now = new Date('2026-01-15T12:00:00Z').getTime();
      // At exactly 10 seconds, should show seconds, not "just now"
      expect(formatLastUpdated(now - 10000)).toBe('10s ago');
    });

    it('handles edge case at exactly 60 seconds', () => {
      const now = new Date('2026-01-15T12:00:00Z').getTime();
      expect(formatLastUpdated(now - 60000)).toBe('1m ago');
    });
  });

  describe('edge cases', () => {
    it('formatRelativeTime handles exactly 1 hour ago', () => {
      expect(formatRelativeTime('2026-01-15T11:00:00Z')).toBe('1h ago');
    });

    it('formatRelativeTime handles exactly 24 hours ago', () => {
      expect(formatRelativeTime('2026-01-14T12:00:00Z')).toBe('1d ago');
    });

    it('formatRelativeTime handles exactly 7 days ago', () => {
      expect(formatRelativeTime('2026-01-08T12:00:00Z')).toBe('Jan 8');
    });

    it('formatFullDate handles different months', () => {
      expect(formatFullDate('2026-02-14T12:00:00Z')).toContain('Feb');
      expect(formatFullDate('2025-12-25T12:00:00Z')).toContain('Dec');
      expect(formatFullDate('2026-07-04T12:00:00Z')).toContain('Jul');
    });

    it('formatFullDate handles different days of week', () => {
      // Monday
      expect(formatFullDate('2026-01-12T12:00:00Z')).toContain('Mon');
      // Saturday
      expect(formatFullDate('2026-01-17T12:00:00Z')).toContain('Sat');
      // Sunday
      expect(formatFullDate('2026-01-18T12:00:00Z')).toContain('Sun');
    });

    it('formatRelativeTime handles year boundaries', () => {
      // Event from last year
      const result = formatRelativeTime('2025-01-01T12:00:00Z');
      expect(result).toContain('Jan');
    });

    it('formatLastUpdated handles timestamps from today at different hours', () => {
      const now = new Date('2026-01-15T12:00:00Z').getTime();
      // 2 hours ago
      const twoHoursAgo = formatLastUpdated(now - 7200000);
      expect(twoHoursAgo).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/i);
    });
  });
});
