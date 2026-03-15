import type { UnmappedCharacter, UnmappedDiscordUser } from '../api/characterMapping';

// ─── Types ───────────────────────────────────────────────────────────────────

export type MatchConfidence = 'exact' | 'high' | 'medium' | 'low';

export interface MatchPair {
  character: UnmappedCharacter;
  discordUser: UnmappedDiscordUser;
  confidence: MatchConfidence;
  score: number;
}

export interface MatchResults {
  /** Pairs where the FE is very confident (exact or near-exact name match) */
  exactMatches: MatchPair[];
  /** Pairs with partial / fuzzy overlap — likely but not certain */
  suggestedMatches: MatchPair[];
  /** Characters that didn't match any Discord user */
  unmatchedCharacters: UnmappedCharacter[];
  /** Discord users that didn't match any character */
  unmatchedDiscordUsers: UnmappedDiscordUser[];
}

// ─── Normalization ───────────────────────────────────────────────────────────

/** Regex that matches most emoji and symbol Unicode ranges */
const EMOJI_RE =
  /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{3030}\u{303D}\u{3297}\u{3299}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu;

/** Strip emojis, decorative Unicode, and common decorative punctuation */
function stripDecorative(s: string): string {
  return s
    .replace(EMOJI_RE, '')
    .replace(/[★☆♡♥❤✦✧✩✪✫✬✭✮✯✰⭐❇✨💫🌟🌸🌹🌺🌻🌼🌷🍀🍃🔥💀💖💗💘💝💞💟♠♣♦♧♤♢⚔️🗡️🛡️⚜️✿❀❁❂❃。°•.:*~`]/g, '')
    .replace(/[|()[\]{}<>]/g, '')
    .trim();
}

/** Normalise a name for comparison: strip decorative chars, collapse whitespace, lowercase */
export function normalizeName(raw: string): string {
  let n = stripDecorative(raw);
  // Collapse multiple spaces / special whitespace
  n = n.replace(/\s+/g, ' ').trim().toLowerCase();
  return n;
}

/** Split into lowercase tokens (handles apostrophes in FFXIV names like A'lina) */
function tokenize(normalized: string): string[] {
  return normalized
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

// ─── Similarity helpers ──────────────────────────────────────────────────────

/** Generate character bigrams from a string */
function bigrams(s: string): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) {
    set.add(s.slice(i, i + 2));
  }
  return set;
}

/** Sørensen-Dice coefficient between two strings (0–1) */
function diceCoefficient(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const biA = bigrams(a);
  const biB = bigrams(b);
  let overlap = 0;
  for (const bg of biA) {
    if (biB.has(bg)) overlap++;
  }
  return (2 * overlap) / (biA.size + biB.size);
}

/**
 * Check if all tokens of `subset` appear somewhere inside `superset` tokens.
 * Returns 1 if every token is found, otherwise fraction of tokens found.
 */
function tokenContainment(subsetTokens: string[], supersetTokens: string[]): number {
  if (subsetTokens.length === 0) return 0;
  const joined = supersetTokens.join(' ');
  let found = 0;
  for (const t of subsetTokens) {
    if (joined.includes(t)) found++;
  }
  return found / subsetTokens.length;
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

const EXACT_THRESHOLD = 0.92;    // score >= this → exact
const SUGGESTED_THRESHOLD = 0.35; // score >= this → suggested

/**
 * Score how well a character name matches a Discord nickname.
 * Returns a number 0–1 where 1 is a perfect match.
 */
export function scoreMatch(characterName: string, discordNick: string): number {
  const cNorm = normalizeName(characterName);
  const dNorm = normalizeName(discordNick);

  if (!cNorm || !dNorm) return 0;

  // 1. Full exact match after normalization
  if (cNorm === dNorm) return 1.0;

  const cTokens = tokenize(cNorm);
  const dTokens = tokenize(dNorm);

  // FFXIV names are always "First Last"
  const cFirst = cTokens[0] ?? '';
  const cLast = cTokens[1] ?? '';

  // 2. Discord nick is just the first name
  if (dTokens.length === 1 && dTokens[0] === cFirst && cFirst.length >= 3) {
    return 0.88;
  }

  // 3. Discord nick contains the full character name (with other stuff around it)
  if (dNorm.includes(cNorm) && cNorm.length >= 5) {
    return 0.95;
  }

  // 4. Both first and last name tokens appear in the Discord nick
  if (cFirst && cLast) {
    const firstInD = dNorm.includes(cFirst);
    const lastInD = dNorm.includes(cLast);
    if (firstInD && lastInD) return 0.93;
    if (firstInD && cFirst.length >= 3) return 0.65;
    if (lastInD && cLast.length >= 3) return 0.55;
  }

  // 5. Character tokens contained in Discord tokens (or vice versa)
  const charInDiscord = tokenContainment(cTokens, dTokens);
  const discordInChar = tokenContainment(dTokens, cTokens);
  const containment = Math.max(charInDiscord, discordInChar);
  if (containment >= 0.8) return 0.7;

  // 6. Dice coefficient for fuzzy similarity
  const dice = diceCoefficient(cNorm, dNorm);
  // Weighted combination: favour containment slightly
  const combined = containment * 0.4 + dice * 0.6;

  return Math.min(combined, 0.89); // cap below exact threshold
}

// ─── Main matcher ────────────────────────────────────────────────────────────

/**
 * Run the FE matching engine across all unmapped characters and Discord users.
 * Produces exact matches, suggested matches, and leftovers for manual pairing.
 *
 * The algorithm is O(characters × discordUsers). With a few hundred of each
 * this completes in < 50 ms on modern hardware.
 */
export function computeMatches(
  characters: UnmappedCharacter[],
  discordUsers: UnmappedDiscordUser[],
): MatchResults {
  // Score every possible pair
  const scores: { charIdx: number; discIdx: number; score: number }[] = [];

  for (let ci = 0; ci < characters.length; ci++) {
    for (let di = 0; di < discordUsers.length; di++) {
      const s = scoreMatch(characters[ci].name, discordUsers[di].serverNickName);
      if (s >= SUGGESTED_THRESHOLD) {
        scores.push({ charIdx: ci, discIdx: di, score: s });
      }
    }
  }

  // Sort descending by score so we greedily assign best matches first
  scores.sort((a, b) => b.score - a.score);

  const usedChars = new Set<number>();
  const usedDisc = new Set<number>();
  const exactMatches: MatchPair[] = [];
  const suggestedMatches: MatchPair[] = [];

  for (const { charIdx, discIdx, score } of scores) {
    if (usedChars.has(charIdx) || usedDisc.has(discIdx)) continue;

    const confidence: MatchConfidence =
      score >= EXACT_THRESHOLD ? 'exact' :
      score >= 0.7            ? 'high'  :
      score >= 0.5            ? 'medium' : 'low';

    const pair: MatchPair = {
      character: characters[charIdx],
      discordUser: discordUsers[discIdx],
      confidence,
      score,
    };

    if (confidence === 'exact') {
      exactMatches.push(pair);
      usedChars.add(charIdx);
      usedDisc.add(discIdx);
    } else {
      suggestedMatches.push(pair);
      // Don't mark as "used" — user might prefer a different pairing
      // But still track so we don't duplicate a pair in the list
      usedChars.add(charIdx);
      usedDisc.add(discIdx);
    }
  }

  const unmatchedCharacters = characters.filter((_, i) => !usedChars.has(i));
  const unmatchedDiscordUsers = discordUsers.filter((_, i) => !usedDisc.has(i));

  return { exactMatches, suggestedMatches, unmatchedCharacters, unmatchedDiscordUsers };
}

/**
 * For a single selected item, find and rank matches from the opposite list.
 * Returns items sorted by score descending, annotated with confidence.
 */
export function rankMatchesForCharacter(
  character: UnmappedCharacter,
  discordUsers: UnmappedDiscordUser[],
): (UnmappedDiscordUser & { confidence: MatchConfidence; score: number })[] {
  return discordUsers
    .map((u) => {
      const score = scoreMatch(character.name, u.serverNickName);
      const confidence: MatchConfidence =
        score >= EXACT_THRESHOLD ? 'exact' :
        score >= 0.7            ? 'high'  :
        score >= 0.5            ? 'medium' : 'low';
      return { ...u, confidence, score };
    })
    .filter((u) => u.score >= SUGGESTED_THRESHOLD)
    .sort((a, b) => b.score - a.score);
}

export function rankMatchesForDiscordUser(
  discordUser: UnmappedDiscordUser,
  characters: UnmappedCharacter[],
): (UnmappedCharacter & { confidence: MatchConfidence; score: number })[] {
  return characters
    .map((c) => {
      const score = scoreMatch(c.name, discordUser.serverNickName);
      const confidence: MatchConfidence =
        score >= EXACT_THRESHOLD ? 'exact' :
        score >= 0.7            ? 'high'  :
        score >= 0.5            ? 'medium' : 'low';
      return { ...c, confidence, score };
    })
    .filter((c) => c.score >= SUGGESTED_THRESHOLD)
    .sort((a, b) => b.score - a.score);
}
