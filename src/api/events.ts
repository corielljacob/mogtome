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

  const queryString = searchParams.toString();
  const url = queryString ? `/events?${queryString}` : '/events';
  
  const response = await apiClient.get<ChronicleEventsResponse>(url);
  
  return {
    events: Array.isArray(response.data?.events) ? response.data.events : [],
    nextCursor: response.data?.nextCursor,
    hasMore: response.data?.hasMore ?? false,
  };
}

export const eventsApi = {
  getEvents,
};
