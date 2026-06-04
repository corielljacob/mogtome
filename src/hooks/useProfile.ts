import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { membersApi } from "../api/members";
import { biographyApi } from "../api/biography";
import type {
  ProfileData,
  ProfileViewer,
  ProfileTarget,
  BiographySubmission,
} from "../types";

const LODESTONE_BASE = "https://na.finalfantasyxiv.com/lodestone/character/";

function buildLodestoneUrl(characterId?: string): string | undefined {
  return characterId ? `${LODESTONE_BASE}${characterId}` : undefined;
}

export interface UseProfileResult {
  /** Normalized identity, or null while the source is still resolving / not found */
  profile: ProfileData | null;
  /** Who's looking + what they may do */
  viewer: ProfileViewer;
  /** Own pending/approved bio submission (null for non-owners or direct-setters) */
  submission: BiographySubmission | null;
  /** Whole-page loading (auth for "me", the member fetch for a character) */
  isLoading: boolean;
  /** The biography (staff list) is still loading - bio section shows its own state */
  isBioLoading: boolean;
  /** The submission is still loading */
  isSubmissionLoading: boolean;
  error: unknown;
  refetchSubmission: () => void;
}

/**
 * useProfile - the single data source for the Profile view.
 *
 * Composes the existing queries into one normalized {@link ProfileData} +
 * {@link ProfileViewer}, so the presentation layer never reads auth or the raw
 * APIs. Pass `"me"` for the signed-in user (today's only wired path) or
 * `{ characterId }` for any member - the latter is fully implemented so the
 * public profile route can be switched on later with no changes here.
 *
 * Reuses the app's existing query keys (`["staff"]`, `["user-submission", id]`)
 * so bio edits and the Knight dashboard's approve/reject keep this view fresh.
 */
export function useProfile(target: ProfileTarget): UseProfileResult {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const isMe = target === "me";
  const characterId = target === "me" ? undefined : target.characterId;

  // Permanent knights set their biography directly; everyone else submits for review.
  const canSetBioDirectly = user?.hasKnighthood === true;

  // Staff list carries biographies + character ids. Both paths read it: the "me"
  // path matches by name, the character path matches by id (to attach a bio if
  // that member happens to be staff - only staff have bios today).
  const {
    data: staffData,
    isLoading: isStaffLoading,
    error: staffError,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: () => membersApi.getStaff(),
    staleTime: 1000 * 60 * 5,
    enabled: isMe ? isAuthenticated && !!user?.memberName : !!characterId,
  });

  // Public path identity, by character id (idle on the "me" route).
  const {
    data: memberData,
    isLoading: isMemberLoading,
    error: memberError,
  } = useQuery({
    queryKey: ["member", "character", characterId ?? ""],
    queryFn: () => membersApi.getMemberByCharacterId(characterId!),
    enabled: !!characterId,
  });

  // Own pending/approved submission (only for the owner who can't set directly).
  const {
    data: submissionData,
    isLoading: isSubmissionLoading,
    refetch: refetchSubmission,
  } = useQuery({
    queryKey: ["user-submission", user?.discordId],
    queryFn: () => biographyApi.getSubmission(user!.discordId),
    enabled: isMe && isAuthenticated && !!user?.discordId && !canSetBioDirectly,
    staleTime: 1000 * 30,
  });

  // The signed-in user's own character id (for ownership checks on other profiles).
  const ownCharacterId = staffData?.staff.find(
    (m) => m.name === user?.memberName,
  )?.characterId;

  let profile: ProfileData | null = null;

  if (target === "me") {
    if (user) {
      const ownStaff = staffData?.staff.find((m) => m.name === user.memberName);
      profile = {
        characterId: ownStaff?.characterId,
        name: user.memberName,
        rank: user.memberRank,
        avatarUrl: user.memberPortraitUrl,
        biography: ownStaff?.biography || undefined,
        // MogTome's own first-login date (NOT the FC join date - we don't have that).
        memberSince: user.firstLoginDate
          ? new Date(user.firstLoginDate)
          : undefined,
        discordId: user.discordId,
        isStaff: !!ownStaff,
        lodestoneUrl: buildLodestoneUrl(ownStaff?.characterId),
      };
    }
  } else if (memberData) {
    const staffEntry = staffData?.staff.find(
      (m) => m.characterId === memberData.characterId,
    );
    profile = {
      characterId: memberData.characterId,
      name: memberData.name,
      rank: memberData.freeCompanyRank,
      avatarUrl: memberData.avatarLink,
      biography: staffEntry?.biography || undefined,
      discordId: staffEntry?.discordId,
      isStaff: !!staffEntry,
      lodestoneUrl: buildLodestoneUrl(memberData.characterId),
    };
  }

  const isOwnProfile = isMe
    ? isAuthenticated
    : isAuthenticated && !!characterId && characterId === ownCharacterId;

  const viewer: ProfileViewer = {
    isOwnProfile,
    isAuthenticated,
    canEditBio: isOwnProfile,
    canSetBioDirectly: isOwnProfile && canSetBioDirectly,
  };

  return {
    profile,
    viewer,
    submission: submissionData ?? null,
    isLoading: isMe ? isAuthLoading : isMemberLoading,
    isBioLoading: isStaffLoading,
    isSubmissionLoading,
    error: isMe ? undefined : (memberError ?? staffError),
    refetchSubmission,
  };
}
