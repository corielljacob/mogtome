import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useMembers, useMemberByCharacterId } from './useMembers';
import { membersApi } from '../api/members';

// Mock the members API
vi.mock('../api/members', () => ({
  membersApi: {
    getMembers: vi.fn(),
    getMemberByCharacterId: vi.fn(),
  },
}));

const mockMembers = [
  {
    id: '1',
    name: 'Test Member',
    freeCompanyRank: 'Moogle Guardian',
    freeCompanyRankIcon: 'https://example.com/icon.png',
    characterId: '12345',
    activeMember: true,
    lastUpdatedDate: '2024-01-01',
    avatarLink: 'https://example.com/avatar.png',
  },
];

const mockPaginatedResponse = {
  items: mockMembers,
  totalCount: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('useMembers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch members successfully', async () => {
    vi.mocked(membersApi.getMembers).mockResolvedValueOnce(mockPaginatedResponse);

    const { result } = renderHook(() => useMembers(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockPaginatedResponse);
    expect(membersApi.getMembers).toHaveBeenCalledWith(undefined);
  });

  it('should pass params to the API', async () => {
    vi.mocked(membersApi.getMembers).mockResolvedValueOnce(mockPaginatedResponse);

    const params = { search: 'Test', page: 1, pageSize: 10 };
    
    const { result } = renderHook(() => useMembers(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(membersApi.getMembers).toHaveBeenCalledWith(params);
  });

  it('should handle API errors', async () => {
    const error = new Error('API Error');
    vi.mocked(membersApi.getMembers).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useMembers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});

describe('useMemberByCharacterId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch a member by character ID', async () => {
    vi.mocked(membersApi.getMemberByCharacterId).mockResolvedValueOnce(mockMembers[0]);

    const { result } = renderHook(() => useMemberByCharacterId('12345'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockMembers[0]);
    expect(membersApi.getMemberByCharacterId).toHaveBeenCalledWith('12345');
  });

  it('should not fetch when character ID is empty', async () => {
    const { result } = renderHook(() => useMemberByCharacterId(''), {
      wrapper: createWrapper(),
    });

    // Query should be disabled
    expect(result.current.fetchStatus).toBe('idle');
    expect(membersApi.getMemberByCharacterId).not.toHaveBeenCalled();
  });

  it('should return null for non-existent character', async () => {
    // React Query doesn't allow undefined returns, so we return null instead
    vi.mocked(membersApi.getMemberByCharacterId).mockResolvedValueOnce(null as unknown as undefined);

    const { result } = renderHook(() => useMemberByCharacterId('99999'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeNull();
  });
});
