import { describe, it, expect } from 'vitest';
import { 
  EVENT_TYPE_CONFIG, 
  DEFAULT_EVENT_TYPE_CONFIG, 
  getEventTypeConfig 
} from './eventTypes';

describe('eventTypes', () => {
  describe('EVENT_TYPE_CONFIG', () => {
    it('has configuration for MemberJoined', () => {
      const config = EVENT_TYPE_CONFIG.MemberJoined;
      expect(config).toBeDefined();
      expect(config.label).toBe('Member Joined');
      expect(config.Icon).toBeDefined();
      expect(config.color).toContain('green');
    });

    it('has configuration for MemberRejoined', () => {
      const config = EVENT_TYPE_CONFIG.MemberRejoined;
      expect(config).toBeDefined();
      expect(config.label).toBe('Welcome Back');
      expect(config.Icon).toBeDefined();
      expect(config.color).toContain('emerald');
    });

    it('has configuration for NameChanged', () => {
      const config = EVENT_TYPE_CONFIG.NameChanged;
      expect(config).toBeDefined();
      expect(config.label).toBe('Name Changed');
      expect(config.Icon).toBeDefined();
      expect(config.color).toContain('violet');
    });

    it('has configuration for RankPromoted', () => {
      const config = EVENT_TYPE_CONFIG.RankPromoted;
      expect(config).toBeDefined();
      expect(config.label).toBe('Rank Up!');
      expect(config.Icon).toBeDefined();
      expect(config.color).toContain('amber');
    });

    it('has configuration for Announcement', () => {
      const config = EVENT_TYPE_CONFIG.Announcement;
      expect(config).toBeDefined();
      expect(config.label).toBe('Announcement');
      expect(config.Icon).toBeDefined();
    });
  });

  describe('DEFAULT_EVENT_TYPE_CONFIG', () => {
    it('has a default label', () => {
      expect(DEFAULT_EVENT_TYPE_CONFIG.label).toBe('Event');
    });

    it('has an icon', () => {
      expect(DEFAULT_EVENT_TYPE_CONFIG.Icon).toBeDefined();
    });
  });

  describe('getEventTypeConfig', () => {
    it('returns correct config for known event types', () => {
      expect(getEventTypeConfig('MemberJoined')).toBe(EVENT_TYPE_CONFIG.MemberJoined);
      expect(getEventTypeConfig('MemberRejoined')).toBe(EVENT_TYPE_CONFIG.MemberRejoined);
      expect(getEventTypeConfig('NameChanged')).toBe(EVENT_TYPE_CONFIG.NameChanged);
      expect(getEventTypeConfig('RankPromoted')).toBe(EVENT_TYPE_CONFIG.RankPromoted);
      expect(getEventTypeConfig('Announcement')).toBe(EVENT_TYPE_CONFIG.Announcement);
    });

    it('returns default config for unknown event types', () => {
      expect(getEventTypeConfig('UnknownType')).toBe(DEFAULT_EVENT_TYPE_CONFIG);
      expect(getEventTypeConfig('')).toBe(DEFAULT_EVENT_TYPE_CONFIG);
      expect(getEventTypeConfig('SomeRandomEvent')).toBe(DEFAULT_EVENT_TYPE_CONFIG);
    });
  });
});
