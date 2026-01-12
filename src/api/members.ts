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

type GetAllMembersOptions = {
  /**
   * Bypass the in-memory cache and re-fetch.
   * (React Query caching still applies at the call-site.)
   */
  force?: boolean;
};

// Tiny in-module cache so multiple hooks/calls don't refetch the full list.
// This is intentionally short-lived; React Query should remain the main cache.
const MEMBERS_CACHE_TTL_MS = 30_000;
let membersCache: { data: MembersApiResponse; fetchedAt: number } | null = null;
let inFlight: Promise<MembersApiResponse> | null = null;

async function fetchAllMembersFromApi(): Promise<MembersApiResponse> {
  const response = await apiClient.get<MembersApiResponse>('/members');
  const members = Array.isArray(response.data?.members) ? response.data.members : [];
  const apiTotalCount = typeof response.data?.totalCount === 'number' ? response.data.totalCount : members.length;

  // Prefer the actual list length if the API's totalCount is missing/mismatched.
  const totalCount = Math.max(members.length, apiTotalCount || 0);

  return { members, totalCount };
}

async function getAllMembers(options?: GetAllMembersOptions): Promise<MembersApiResponse> {
  const now = Date.now();
  const force = options?.force === true;

  if (!force && membersCache && now - membersCache.fetchedAt < MEMBERS_CACHE_TTL_MS) {
    return membersCache.data;
  }

  if (!force && inFlight) {
    return inFlight;
  }

  inFlight = fetchAllMembersFromApi()
    .then((data) => {
      membersCache = { data, fetchedAt: Date.now() };
      return data;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export const membersApi = {
  // Fetch all members (cached) and adapt to the frontend's pagination expectations
  getMembers: async (params?: GetMembersParams): Promise<PaginatedResponse<FreeCompanyMember>> => {
    const { members } = await getAllMembers();

    // Optional client-side filtering (until the backend supports server-side filtering)
    const search = params?.search?.trim().toLowerCase();
    const rankSet = params?.ranks && params.ranks.length > 0 ? new Set(params.ranks) : null;

    const filtered = members.filter((m) => {
      if (rankSet && !rankSet.has(m.freeCompanyRank)) return false;
      if (!search) return true;
      return (
        m.name.toLowerCase().includes(search) ||
        m.freeCompanyRank.toLowerCase().includes(search)
      );
    });

    const totalCount = filtered.length;

    // Handle empty dataset explicitly (avoids NaN totalPages from division by 0)
    if (totalCount === 0) {
      return {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: params?.pageSize ?? 0,
        totalPages: 0,
      };
    }

    const requestedPageSize = params?.pageSize;
    const pageSize = requestedPageSize && requestedPageSize > 0 ? requestedPageSize : totalCount; // Default to all
    const totalPages = Math.ceil(totalCount / pageSize);
    const rawPage = params?.page ?? 1;
    const page = Math.min(Math.max(rawPage, 1), totalPages);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filtered.slice(startIndex, endIndex);

    return { items, totalCount, page, pageSize, totalPages };
  },

  // Convenience lookup by character ID
  getMemberByCharacterId: async (characterId: string): Promise<FreeCompanyMember | undefined> => {
    if (!characterId) return undefined;
    const { members } = await getAllMembers();
    return members.find((m) => m.characterId === characterId);
  },
};
