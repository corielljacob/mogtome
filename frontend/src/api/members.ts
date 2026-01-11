import apiClient from './client';
import type { FreeCompanyMember, PaginatedResponse } from '../types';

export interface GetMembersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  ranks?: string[];
}

export const membersApi = {
  // Get all members with optional filtering
  getMembers: async (params?: GetMembersParams): Promise<PaginatedResponse<FreeCompanyMember>> => {
    const response = await apiClient.get('/members', { params });
    return response.data;
  },

  // Get a single member by ID
  getMember: async (id: string): Promise<FreeCompanyMember> => {
    const response = await apiClient.get(`/members/${id}`);
    return response.data;
  },

  // Get member by character ID (Lodestone ID)
  getMemberByCharacterId: async (characterId: string): Promise<FreeCompanyMember> => {
    const response = await apiClient.get(`/members/character/${characterId}`);
    return response.data;
  },

  // Admin: Update a member
  updateMember: async (id: string, data: Partial<FreeCompanyMember>): Promise<FreeCompanyMember> => {
    const response = await apiClient.put(`/members/${id}`, data);
    return response.data;
  },

  // Admin: Refresh members from Lodestone
  refreshMembers: async (): Promise<{ message: string; count: number }> => {
    const response = await apiClient.post('/members/refresh');
    return response.data;
  },
};
