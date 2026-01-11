import apiClient from './client';
import type { FreeCompanyMember, PaginatedResponse } from '../types';

// Shape returned by the Azure API
interface MembersApiResponse {
  totalCount: number;
  members: FreeCompanyMember[];
}

export interface GetMembersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  ranks?: string[];
}

export const membersApi = {
  // Fetch all members and adapt to the frontend's pagination expectations
  getMembers: async (params?: GetMembersParams): Promise<PaginatedResponse<FreeCompanyMember>> => {
    const response = await apiClient.get<MembersApiResponse>('/members');
    
    // API returns the full list; we paginate on the client
    const allMembers = response.data.members;
    const totalCount = response.data.totalCount;
    
    // Apply client-side slicing when pagination params are present
    const page = params?.page || 1;
    const pageSize = params?.pageSize || totalCount; // Default to all
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const items = allMembers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalCount / pageSize);
    
    return {
      items,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  // Convenience lookup by character ID
  getMemberByCharacterId: async (characterId: string): Promise<FreeCompanyMember | undefined> => {
    const response = await apiClient.get<MembersApiResponse>('/members');
    return response.data.members.find(m => m.characterId === characterId);
  },
};
