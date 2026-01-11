import apiClient from './client';
import type { FreeCompanyMember, PaginatedResponse } from '../types';

// Response from the Azure API
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
  // Get all members - fetches from Azure API and transforms to expected format
  getMembers: async (params?: GetMembersParams): Promise<PaginatedResponse<FreeCompanyMember>> => {
    const response = await apiClient.get<MembersApiResponse>('/members');
    
    // The API returns all members, we handle pagination client-side
    const allMembers = response.data.members;
    const totalCount = response.data.totalCount;
    
    // If pagination params provided, slice the results (client-side)
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

  // Get a single member by character ID
  getMemberByCharacterId: async (characterId: string): Promise<FreeCompanyMember | undefined> => {
    const response = await apiClient.get<MembersApiResponse>('/members');
    return response.data.members.find(m => m.characterId === characterId);
  },
};
