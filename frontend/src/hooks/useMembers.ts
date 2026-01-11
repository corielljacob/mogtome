import { useQuery } from '@tanstack/react-query';
import { membersApi, type GetMembersParams } from '../api/members';

export function useMembers(params?: GetMembersParams) {
  return useQuery({
    queryKey: ['members', params],
    queryFn: () => membersApi.getMembers(params),
  });
}

export function useMemberByCharacterId(characterId: string) {
  return useQuery({
    queryKey: ['member', 'character', characterId],
    queryFn: () => membersApi.getMemberByCharacterId(characterId),
    enabled: !!characterId,
  });
}
