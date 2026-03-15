import { describe, it, expect, vi, beforeEach } from 'vitest';
import { characterMappingApi } from './characterMapping';
import apiClient from './client';

// Mock the apiClient
vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockApiClient = apiClient as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

describe('characterMappingApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUnmappedCharacters', () => {
    it('should fetch unmapped characters without params', async () => {
      const mockResponse = {
        data: {
          suggested: [{ characterId: '1', name: 'Test Char', avatarLink: 'url', freeCompanyRank: 'Knight' }],
          all: [{ characterId: '2', name: 'Another Char', avatarLink: 'url2', freeCompanyRank: 'Paissa' }],
        },
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await characterMappingApi.getUnmappedCharacters();

      expect(mockApiClient.get).toHaveBeenCalledWith('/dashboard/unmapped-characters', { params: undefined });
      expect(result.suggested).toHaveLength(1);
      expect(result.all).toHaveLength(1);
    });

    it('should fetch unmapped characters with discordUsername param', async () => {
      const mockResponse = {
        data: {
          suggested: [{ characterId: '1', name: 'Suggested Char', avatarLink: 'url', freeCompanyRank: 'Knight' }],
          all: [],
        },
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await characterMappingApi.getUnmappedCharacters('TestUser');

      expect(mockApiClient.get).toHaveBeenCalledWith('/dashboard/unmapped-characters', { params: { discordUsername: 'TestUser' } });
      expect(result.suggested).toHaveLength(1);
      expect(result.suggested[0].name).toBe('Suggested Char');
    });

    it('should handle empty response gracefully', async () => {
      mockApiClient.get.mockResolvedValue({ data: {} });

      const result = await characterMappingApi.getUnmappedCharacters();

      expect(result.suggested).toEqual([]);
      expect(result.all).toEqual([]);
    });
  });

  describe('getUnmappedDiscordUsers', () => {
    it('should fetch unmapped Discord users without params', async () => {
      const mockResponse = {
        data: {
          suggested: [{ discordId: '123', discordUsername: 'TestUser' }],
          all: [{ discordId: '456', discordUsername: 'AnotherUser' }],
        },
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await characterMappingApi.getUnmappedDiscordUsers();

      expect(mockApiClient.get).toHaveBeenCalledWith('/dashboard/unmapped-discord-users', { params: undefined });
      expect(result.suggested).toHaveLength(1);
      expect(result.all).toHaveLength(1);
    });

    it('should fetch unmapped Discord users with characterName param', async () => {
      const mockResponse = {
        data: {
          suggested: [{ discordId: '123', discordUsername: 'MatchedUser' }],
          all: [],
        },
      };
      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await characterMappingApi.getUnmappedDiscordUsers('Joe Mamma');

      expect(mockApiClient.get).toHaveBeenCalledWith('/dashboard/unmapped-discord-users', { params: { characterName: 'Joe Mamma' } });
      expect(result.suggested).toHaveLength(1);
    });

    it('should handle empty response gracefully', async () => {
      mockApiClient.get.mockResolvedValue({ data: null });

      const result = await characterMappingApi.getUnmappedDiscordUsers();

      expect(result.suggested).toEqual([]);
      expect(result.all).toEqual([]);
    });
  });

  describe('mapCharacter', () => {
    it('should post mapping with correct payload', async () => {
      mockApiClient.post.mockResolvedValue({});

      await characterMappingApi.mapCharacter('char123', 'discord456');

      expect(mockApiClient.post).toHaveBeenCalledWith('/dashboard/map', {
        characterId: 'char123',
        discordId: 'discord456',
      });
    });
  });
});
