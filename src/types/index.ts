// Free Company member shape coming from the backend
export interface FreeCompanyMember {
  id?: string;
  name: string;
  freeCompanyRank: string;
  freeCompanyRankIcon: string;
  characterId: string;
  activeMember: boolean;
  lastUpdatedDate: string;
  membershipHistory?: string;
  avatarLink: string;
}

// FC ranks plus presentation metadata
export const FC_RANKS = [
  { name: 'Moogle Guardian', color: 'rank-guardian', order: 0 },
  { name: 'Moogle Knight', color: 'rank-knight', order: 1 },
  { name: 'Paissa Trainer', color: 'rank-paissa', order: 2 },
  { name: 'Coeurl Hunter', color: 'rank-hunter', order: 3 },
  { name: 'Mandragora', color: 'rank-mandragora', order: 4 },
  { name: 'Apkallu Seeker', color: 'rank-seeker', order: 5 },
  { name: 'Kupo Shelf', color: 'rank-shelf', order: 6 },
  { name: 'Bom Boko', color: 'rank-bom-boko', order: 7 },
] as const;

export type FCRankName = typeof FC_RANKS[number]['name'];

// Timeline event taxonomy
export type TimelineEventType = 
  | 'member_joined'
  | 'member_left'
  | 'name_change'
  | 'rank_change'
  | 'fc_announcement'
  | 'achievement'
  | 'other';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  date: string; // ISO date string
  memberId?: string;
  memberName?: string;
  memberAvatar?: string;
  metadata?: Record<string, unknown>;
}

export interface TimelineResponse {
  events: TimelineEvent[];
  nextCursor?: string;
  hasMore: boolean;
}

// Auth payloads
export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Common paginated response wrapper
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
