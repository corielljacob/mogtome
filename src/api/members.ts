import apiClient from "@/api/client";
import type {
  FreeCompanyMember,
  PaginatedResponse,
  StaffResponse,
} from "@/shared/types";

// shape returned by the Azure API
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
  /** bypass the in-module cache (React Query caching still applies at the call-site) */
  force?: boolean;
};

// short-lived dedupe so concurrent hooks don't all refetch the full list;
// React Query remains the real cache
const MEMBERS_CACHE_TTL_MS = 30_000;
let membersCache: { data: MembersApiResponse; fetchedAt: number } | null = null;
let inFlight: Promise<MembersApiResponse> | null = null;

async function fetchAllMembersFromApi(): Promise<MembersApiResponse> {
  const response = await apiClient.get<MembersApiResponse>("/members");
  const members = Array.isArray(response.data?.members)
    ? response.data.members
    : [];
  const apiTotalCount =
    typeof response.data?.totalCount === "number"
      ? response.data.totalCount
      : members.length;

  // trust the actual list length when the API's totalCount is missing/mismatched
  const totalCount = Math.max(members.length, apiTotalCount || 0);

  return { members, totalCount };
}

async function getAllMembers(
  options?: GetAllMembersOptions,
): Promise<MembersApiResponse> {
  const now = Date.now();
  const force = options?.force === true;

  if (
    !force &&
    membersCache &&
    now - membersCache.fetchedAt < MEMBERS_CACHE_TTL_MS
  ) {
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
  // fetch-all (cached) then adapt to the frontend's pagination shape
  getMembers: async (
    params?: GetMembersParams,
  ): Promise<PaginatedResponse<FreeCompanyMember>> => {
    const { members } = await getAllMembers();

    // client-side filtering until the backend supports it server-side
    const search = params?.search?.trim().toLowerCase();
    const rankSet =
      params?.ranks && params.ranks.length > 0 ? new Set(params.ranks) : null;

    const filtered = members.filter((m) => {
      if (rankSet && !rankSet.has(m.freeCompanyRank)) return false;
      if (!search) return true;
      return (
        m.name.toLowerCase().includes(search) ||
        m.freeCompanyRank.toLowerCase().includes(search)
      );
    });

    const totalCount = filtered.length;

    // handle empty set explicitly - avoids NaN totalPages from div-by-zero
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
    const pageSize =
      requestedPageSize && requestedPageSize > 0
        ? requestedPageSize
        : totalCount; // default: all on one page
    const totalPages = Math.ceil(totalCount / pageSize);
    const rawPage = params?.page ?? 1;
    const page = Math.min(Math.max(rawPage, 1), totalPages);

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filtered.slice(startIndex, endIndex);

    return { items, totalCount, page, pageSize, totalPages };
  },

  getMemberByCharacterId: async (
    characterId: string,
  ): Promise<FreeCompanyMember | undefined> => {
    if (!characterId) return undefined;
    const { members } = await getAllMembers();
    return members.find((m) => m.characterId === characterId);
  },

  getStaff: async (): Promise<StaffResponse> => {
    const response = await apiClient.get<StaffResponse>("/members/staff");
    const staff = Array.isArray(response.data?.staff)
      ? response.data.staff
      : [];
    const totalCount =
      typeof response.data?.totalCount === "number"
        ? response.data.totalCount
        : staff.length;
    return { staff, totalCount };
  },
};
