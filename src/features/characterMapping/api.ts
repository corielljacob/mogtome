import apiClient from '@/shared/api/client';

export interface UnmappedCharacter {
  characterId: string;
  name: string;
  avatarLink: string;
  freeCompanyRank: string;
}

export interface UnmappedDiscordUser {
  discordId: string;
  serverNickName: string;
}

export interface UnmappedCharactersResponse {
  suggestedCharacters: UnmappedCharacter[];
  unmappedCharacters: UnmappedCharacter[];
}

export interface UnmappedDiscordUsersResponse {
  suggestedDiscordUsers: UnmappedDiscordUser[];
  unmappedDiscordUsers: UnmappedDiscordUser[];
}

export interface MapCharacterRequest {
  characterId: string;
  discordId: string;
}

/** optional discordUsername narrows the result to suggested matches */
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

/** optional characterName ("First Last", space-separated) narrows to suggested matches */
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
