import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { membersApi } from './members';
import apiClient from './client';

// Mock the API client
vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockMembers = [
  {
    id: '1',
    name: 'Test Member One',
    freeCompanyRank: 'Moogle Guardian',
    freeCompanyRankIcon: 'https://example.com/icon1.png',
    characterId: '12345',
    activeMember: true,
    lastUpdatedDate: '2024-01-01',
    avatarLink: 'https://example.com/avatar1.png',
  },
  {
    id: '2',
    name: 'Test Member Two',
    freeCompanyRank: 'Moogle Knight',
    freeCompanyRankIcon: 'https://example.com/icon2.png',
    characterId: '67890',
    activeMember: true,
    lastUpdatedDate: '2024-01-02',
    avatarLink: 'https://example.com/avatar2.png',
  },
  {
    id: '3',
    name: 'Another Person',
    freeCompanyRank: 'Mandragora',
    freeCompanyRankIcon: 'https://example.com/icon3.png',
    characterId: '11111',
    activeMember: false,
    lastUpdatedDate: '2024-01-03',
    avatarLink: 'https://example.com/avatar3.png',
  },
];

describe('membersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module state between tests
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getMembers', () => {
    it('should fetch and return all members', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { members: mockMembers, totalCount: 3 },
      });

      const result = await membersApi.getMembers();

      expect(apiClient.get).toHaveBeenCalledWith('/members');
      expect(result.items).toHaveLength(3);
      expect(result.totalCount).toBe(3);
    });

    it('should filter members by search query', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { members: mockMembers, totalCount: 3 },
      });

      const result = await membersApi.getMembers({ search: 'Test' });

      expect(result.items).toHaveLength(2);
      expect(result.items.every(m => m.name.includes('Test'))).toBe(true);
    });

    it('should filter members by rank', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { members: mockMembers, totalCount: 3 },
      });

      const result = await membersApi.getMembers({ ranks: ['Moogle Guardian'] });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].freeCompanyRank).toBe('Moogle Guardian');
    });

    it('should handle pagination correctly', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { members: mockMembers, totalCount: 3 },
      });

      const result = await membersApi.getMembers({ page: 1, pageSize: 2 });

      expect(result.items).toHaveLength(2);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(2);
      expect(result.totalPages).toBe(2);
    });

    it('should return empty result when no members match filters', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { members: mockMembers, totalCount: 3 },
      });

      const result = await membersApi.getMembers({ search: 'NonExistent' });

      expect(result.items).toHaveLength(0);
      expect(result.totalCount).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('should handle case-insensitive search', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { members: mockMembers, totalCount: 3 },
      });

      const result = await membersApi.getMembers({ search: 'TEST MEMBER' });

      expect(result.items).toHaveLength(2);
    });

    it('should search by rank name as well', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { members: mockMembers, totalCount: 3 },
      });

      const result = await membersApi.getMembers({ search: 'mandragora' });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Another Person');
    });
  });

  describe('getMemberByCharacterId', () => {
    it('should return the member matching the character ID', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { members: mockMembers, totalCount: 3 },
      });

      const result = await membersApi.getMemberByCharacterId('67890');

      expect(result).toBeDefined();
      expect(result?.name).toBe('Test Member Two');
    });

    it('should return undefined for non-existent character ID', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { members: mockMembers, totalCount: 3 },
      });

      const result = await membersApi.getMemberByCharacterId('99999');

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty character ID', async () => {
      const result = await membersApi.getMemberByCharacterId('');

      expect(result).toBeUndefined();
      expect(apiClient.get).not.toHaveBeenCalled();
    });
  });
});
