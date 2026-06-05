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

// Staff/Leadership member shape from /members/staff endpoint
export interface StaffMember {
  name: string;
  freeCompanyRank: string;
  freeCompanyRankIcon: string;
  characterId: string;
  activeMember: boolean;
  lastUpdatedDate: string;
  membershipHistory?: string;
  avatarLink: string;
  discordId?: string;
  biography?: string;
  promotionDate?: string;
  recentlyPromoted?: boolean;
}

export interface StaffResponse {
  totalCount: number;
  staff: StaffMember[];
}

// FC ranks plus presentation metadata
export const FC_RANKS = [
  { name: "Moogle Guardian", color: "rank-guardian", order: 0 },
  { name: "Moogle Knight", color: "rank-knight", order: 1 },
  { name: "Paissa Trainer", color: "rank-paissa", order: 2 },
  { name: "Coeurl Hunter", color: "rank-hunter", order: 3 },
  { name: "Mandragora", color: "rank-mandragora", order: 4 },
  { name: "Apkallu Seeker", color: "rank-seeker", order: 5 },
  { name: "Kupo Shelf", color: "rank-shelf", order: 6 },
  { name: "Bom Boko", color: "rank-bom-boko", order: 7 },
] as const;

export type FCRankName = (typeof FC_RANKS)[number]["name"];

// Timeline event taxonomy
export type TimelineEventType =
  | "member_joined"
  | "member_left"
  | "name_change"
  | "rank_change"
  | "fc_announcement"
  | "achievement"
  | "other";

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

// Chronicle API event types (from /events endpoint)
export interface ChronicleEventId {
  timestamp: number;
  creationTime: string;
}

export interface ChronicleEvent {
  id: ChronicleEventId;
  text: string;
  createdAt: string;
  type: string;
}

export interface ChronicleEventsResponse {
  events: ChronicleEvent[];
  nextCursor?: string;
  hasMore: boolean;
}

/** Available event type filters matching the API's filter enum */
export type ChronicleEventFilter =
  | "MemberJoined"
  | "MemberRejoined"
  | "Announcement"
  | "RankPromoted"
  | "NameChanged";

// Params for fetching chronicle events
export interface GetChronicleEventsParams {
  cursor?: string;
  limit?: number;
  /** Search/filter events by text (GET /events query param) */
  query?: string;
  /** Filter events by type (GET /events filter param) */
  filter?: ChronicleEventFilter;
}

// Biography submission from a Paissa awaiting approval
export interface BiographySubmission {
  id: {
    timestamp: number;
    creationTime: string;
  };
  submissionId: string;
  submittedByDiscordId: string;
  biography: string;
  status: string;
  submittedAt: string;
}

// User info extracted from JWT token
export interface User {
  memberName: string;
  memberRank: string;
  memberPortraitUrl: string;
  hasKnighthood: boolean;
  hasTemporaryKnighthood: boolean;
  /** Date of user's first MogTome login (ISO string), set by backend on first-ever login */
  firstLoginDate?: string;
  /** User's Discord ID */
  discordId: string;
}

// one shape drives the Profile view whether it's your own ("me") or someone
// else's (by characterId), so the presentation layer never reads auth directly

/** source-agnostic identity for the Profile view */
export interface ProfileData {
  /** Lodestone character id (absent for accounts not yet mapped to a character) */
  characterId?: string;
  name: string;
  rank: string;
  avatarUrl: string;
  biography?: string;
  /** When this member first signed in to MogTome (own profile only; not the FC join date) */
  memberSince?: Date;
  discordId?: string;
  /** True when this member appears in the staff/leadership list (only staff carry bios today) */
  isStaff: boolean;
  /** Pre-built Lodestone URL, centralized here instead of recomputed per component */
  lodestoneUrl?: string;
}

/** Who is looking, and what they're allowed to do on this profile. */
export interface ProfileViewer {
  /** The viewer is looking at their own profile */
  isOwnProfile: boolean;
  isAuthenticated: boolean;
  /** May edit the biography (own profile, while authenticated) */
  canEditBio: boolean;
  /** May set the biography directly without review (permanent knights) */
  canSetBioDirectly: boolean;
}

/** Which profile to load: the signed-in user, or a specific character. */
export type ProfileTarget = "me" | { characterId: string };

// Common paginated response wrapper
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
