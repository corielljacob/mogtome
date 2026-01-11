// Free Company Member from the backend
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

// FC Ranks with their display info
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

// Auth types
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

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
