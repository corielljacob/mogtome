import apiClient from './client';

/**
 * Unmapped character from the API
 */
export interface UnmappedCharacter {
  characterId: string;
  name: string;
  avatarLink: string;
  freeCompanyRank: string;
}

/**
 * Unmapped Discord user from the API
 */
export interface UnmappedDiscordUser {
  discordId: string;
  serverNickName: string;
}

/**
 * Response from get unmapped characters endpoint
 */
export interface UnmappedCharactersResponse {
  suggestedCharacters: UnmappedCharacter[];
  unmappedCharacters: UnmappedCharacter[];
}

/**
 * Response from get unmapped Discord users endpoint
 */
export interface UnmappedDiscordUsersResponse {
  suggestedDiscordUsers: UnmappedDiscordUser[];
  unmappedDiscordUsers: UnmappedDiscordUser[];
}

/**
 * Request body for mapping a character to a Discord user
 */
export interface MapCharacterRequest {
  characterId: string;
  discordId: string;
}

/**
 * Get unmapped characters, optionally filtered by Discord username for suggestions.
 * @param discordUsername - Optional Discord username to find suggested character matches
 */
async function getUnmappedCharacters(
  discordUsername?: string
): Promise<UnmappedCharactersResponse> {
  const params = discordUsername ? { discordUsername } : undefined;
  const response = await apiClient.get<UnmappedCharactersResponse>(
    '/dashboard/unmapped-characters',
    { params }
  );
  return {
    suggestedCharacters: Array.isArray(response.data?.suggestedCharacters) ? response.data.suggestedCharacters : [],
    unmappedCharacters: Array.isArray(response.data?.unmappedCharacters) ? response.data.unmappedCharacters : [],
  };
}

/**
 * Get unmapped Discord users, optionally filtered by character name for suggestions.
 * @param characterName - Optional character name (first and last with space) to find suggested Discord matches
 */
async function getUnmappedDiscordUsers(
  characterName?: string
): Promise<UnmappedDiscordUsersResponse> {
  const params = characterName ? { characterName } : undefined;
  const response = await apiClient.get<UnmappedDiscordUsersResponse>(
    '/dashboard/unmapped-discord-users',
    { params }
  );
  return {
    suggestedDiscordUsers: Array.isArray(response.data?.suggestedDiscordUsers) ? response.data.suggestedDiscordUsers : [],
    unmappedDiscordUsers: Array.isArray(response.data?.unmappedDiscordUsers) ? response.data.unmappedDiscordUsers : [],
  };
}

/**
 * Create a mapping between a character and a Discord account.
 * @param characterId - The character ID to map
 * @param discordId - The Discord ID to map
 */
async function mapCharacter(
  characterId: string,
  discordId: string
): Promise<void> {
  await apiClient.post('/dashboard/map', { characterId, discordId });
}

export const characterMappingApi = {
  getUnmappedCharacters,
  getUnmappedDiscordUsers,
  mapCharacter,
};
