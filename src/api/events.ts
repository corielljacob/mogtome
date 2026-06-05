import apiClient from '@/api/client';
import type { ChronicleEventsResponse, GetChronicleEventsParams } from '@/shared/types';

async function getEvents(params?: GetChronicleEventsParams): Promise<ChronicleEventsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.cursor) {
    searchParams.set('cursor', params.cursor);
  }
  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }
  if (params?.query?.trim()) {
    searchParams.set('query', params.query.trim());
  }
  if (params?.filter) {
    searchParams.set('filter', params.filter);
  }

  const queryString = searchParams.toString();
  const url = queryString ? `/events?${queryString}` : '/events';
  
  const response = await apiClient.get(url);
  const body = response.data;

  // API returns either a wrapped { events, nextCursor, hasMore } or a bare array
  if (Array.isArray(body)) {
    return {
      events: body,
      nextCursor: undefined,
      hasMore: false,
    };
  }

  return {
    events: Array.isArray(body?.events) ? body.events : [],
    nextCursor: body?.nextCursor,
    hasMore: body?.hasMore ?? false,
  };
}

export const eventsApi = {
  getEvents,
};
