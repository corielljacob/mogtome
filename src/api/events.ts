import apiClient from './client';
import type { ChronicleEventsResponse, GetChronicleEventsParams } from '../types';

/**
 * Fetch chronicle events with cursor-based pagination.
 */
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

  // The API may return either:
  //   - A wrapped object: { events: [...], nextCursor, hasMore }
  //   - A flat array of events: [...]
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
