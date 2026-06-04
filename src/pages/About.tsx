import {
  memo,
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
} from "react";
import { motion } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Quote, Pencil, ChevronDown } from "lucide-react";
import { membersApi } from "../api/members";
import { biographyApi } from "../api/biography";
import {
  PageLayout,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/PageShell";
import { Tag } from "../components/Tag";
import {
  KawaiiStar,
  KawaiiBow,
  KawaiiSparkle,
  KawaiiHeart,
} from "../components/kawaiiMotifs";
import { getRankColor } from "../constants/rankColors";
import { useAuth } from "../contexts/AuthContext";
import type { StaffMember } from "../types";
import { FC_RANKS } from "../types";

// rank -> sort index (same ordering as the Members page)
const RANK_ORDER = new Map<string, number>(FC_RANKS.map((r, i) => [r.name, i]));

import wizardMoogle from "../assets/moogles/wizard moogle.webp";
import flyingMoogles from "../assets/moogles/moogles flying.webp";
import moogleMail from "../assets/moogles/moogle mail.webp";
import illustratedMoogle from "../assets/moogles/illustrated moogle.webp";
import lilGuyMoogle from "../assets/moogles/lil guy moogle.webp";

// deterministic per-member tilt, stable across renders (a hash, not Math.random,
// so it never jitters). photo + note tilt independently in both directions for a
// messy hand-pinned scatter rather than an orderly opposing lean.
function scrapbookTilt(seed: string): { photo: number; note: number } {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h >>>= 0;
  return {
    photo: ((h % 1000) / 1000) * 11 - 5.5, // ≈ -5.5 .. +5.5
    note: (((h >>> 11) % 1000) / 1000) * 11 - 5.5, // ≈ -5.5 .. +5.5
  };
}

function StickyBioNote({
  bio,
  rankHex,
  editable,
  tilt,
}: {
  bio?: string;
  rankHex: string;
  editable: boolean;
  tilt: number;
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(bio ?? "");

  // Track whether the note overflows (and isn't scrolled to the end) so we can
  // show a "scroll for more" hint on long bios.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    canScroll: false,
    atBottom: true,
  });
  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const canScroll = el.scrollHeight - el.clientHeight > 4;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
    setScrollState((prev) =>
      prev.canScroll === canScroll && prev.atBottom === atBottom
        ? prev
        : { canScroll, atBottom },
    );
  }, []);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    const ro = new ResizeObserver(updateScroll);
    ro.observe(el);
    let cancelled = false;
    void document.fonts?.ready?.then(() => {
      if (!cancelled) updateScroll();
    });
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [updateScroll, bio, editing]);

  const mutation = useMutation({
    mutationFn: (b: string) => biographyApi.setBiography(b),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      setEditing(false);
    },
  });

  // A warm Post-it, tinted a touch toward the rank colour. Fixed colours (not
  // theme tokens) so it reads as a physical sticky note in light + dark.
  const stickyBg = `color-mix(in srgb, ${rankHex} 13%, #fbf2d3)`;
  const stickyStyle: CSSProperties = {
    background: stickyBg,
    boxShadow:
      "2px 5px 13px -3px rgba(0, 0, 0, 0.30), inset 0 -14px 18px -14px rgba(90, 70, 25, 0.18)",
  };

  // Same overlap + tilt in both states so the note keeps its scrapbook spot,
  // tucked over the polaroid's edge. Fixed size keeps every note consistent;
  // a long bio scrolls inside it rather than stretching the card.
  const shellCls =
    "relative z-20 shrink-0 -ml-4 sm:-ml-5 mt-4 sm:mt-6 w-44 sm:w-56";
  const shellStyle: CSSProperties = { transform: `rotate(${tilt}deg)` };
  const pin = (
    <span
      className="pushpin absolute -top-2 left-1/2 -translate-x-1/2 z-10"
      style={{ "--pin": rankHex } as CSSProperties}
      aria-hidden="true"
    />
  );

  if (editing) {
    return (
      <div className={shellCls} style={shellStyle}>
        {pin}
        <div className="rounded-[3px] p-3.5" style={stickyStyle}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={6}
            maxLength={500}
            autoFocus
            placeholder="Write your note, kupo~"
            className="w-full resize-none border-none bg-transparent p-0 font-accent text-lg leading-snug text-[#463c2e] placeholder:text-[#463c2e]/40 focus:outline-none"
          />
          <div className="mt-1 flex items-center gap-2">
            <button
              onClick={() => mutation.mutate(draft.trim())}
              disabled={mutation.isPending}
              className="gel hover-bounce px-3 py-1 font-display text-xs font-bold text-white disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none touch-manipulation"
            >
              {mutation.isPending ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={mutation.isPending}
              className="px-1.5 py-1 font-display text-xs font-bold text-[#463c2e]/70 hover:text-[#463c2e] cursor-pointer touch-manipulation"
            >
              Cancel
            </button>
          </div>
          {mutation.isError && (
            <p className="mt-1 font-soft text-[11px] text-[#a23a2a]">
              couldn't save, kupo
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={shellCls} style={shellStyle}>
      {pin}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateScroll}
          className="h-48 sm:h-56 overflow-y-auto rounded-[3px] p-3.5 sm:p-4"
          style={stickyStyle}
        >
          <p
            className={`font-accent text-[17px] sm:text-lg leading-snug whitespace-pre-line ${bio ? "text-[#463c2e]" : "text-[#463c2e]/55"}`}
          >
            {bio || "no note pinned yet, kupo~"}
          </p>
        </div>
        {scrollState.canScroll && !scrollState.atBottom && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex h-11 items-end justify-center rounded-b-[3px] pb-1.5"
            style={{
              background: `linear-gradient(to bottom, transparent, ${stickyBg} 78%)`,
            }}
            aria-hidden="true"
          >
            <ChevronDown className="w-4 h-4 text-[#463c2e]/55 motion-safe:animate-bounce" />
          </div>
        )}
      </div>
      {editable && (
        <button
          onClick={() => {
            setDraft(bio ?? "");
            setEditing(true);
          }}
          className="mt-2 ml-1 inline-flex items-center gap-1 text-xs font-display font-bold text-[var(--primary)] hover:underline cursor-pointer touch-manipulation"
        >
          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
          {bio ? "edit my note" : "add my note"}
        </button>
      )}
    </div>
  );
}

const StaffCard = memo(function StaffCard({
  member,
  isLeader = false,
  isCurrentUser = false,
  isOwnEditable = false,
}: {
  member: StaffMember;
  isLeader?: boolean;
  isCurrentUser?: boolean;
  isOwnEditable?: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const rankColor = getRankColor(member.freeCompanyRank);
  const RankIcon = rankColor.icon;
  const lodestoneUrl = `https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`;
  const shortRank = member.freeCompanyRank.replace("Moogle ", "");
  const tilt = scrapbookTilt(member.characterId);

  return (
    <article className="relative flex items-start">
      {/* polaroid */}
      <a
        href={lodestoneUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="paper group relative z-10 shrink-0 focus-visible:outline-none"
        style={{ transform: `rotate(${tilt.photo}deg)` }}
        aria-label={`${member.name} on the Lodestone (opens in new tab)`}
      >
        <span
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-11 h-4 -rotate-6 rounded-[2px] opacity-80 z-10"
          style={{
            background: `repeating-linear-gradient(45deg, color-mix(in srgb, ${rankColor.hex} 45%, transparent) 0 5px, color-mix(in srgb, ${rankColor.hex} 24%, transparent) 5px 10px)`,
          }}
          aria-hidden="true"
        />
        <div className="surface p-2 pb-2.5 w-28 sm:w-32">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-[var(--bg)]">
            {!imageLoaded && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--card)] to-[var(--bg)] animate-shimmer"
                aria-hidden="true"
              />
            )}
            <img
              src={member.avatarLink}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            />
            <div
              className="absolute top-1 left-1 flex items-center justify-center w-5 h-5 rounded-full"
              style={{
                backgroundColor: `color-mix(in srgb, ${rankColor.hex} 22%, var(--card))`,
                border: `2px solid color-mix(in srgb, ${rankColor.hex} 34%, var(--card))`,
              }}
            >
              <RankIcon
                className="w-3 h-3"
                style={{ color: rankColor.hex }}
                aria-hidden="true"
              />
            </div>
            <span
              className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden="true"
            >
              <ExternalLink className="w-4 h-4 text-white" />
            </span>
          </div>
          <p className="font-accent font-bold text-sm text-center text-[var(--text)] truncate mt-1.5">
            {member.name}
          </p>
          <div className="flex justify-center mt-1.5">
            <Tag
              color={rankColor.hex}
              icon={<RankIcon className="w-3 h-3" aria-hidden="true" />}
            >
              {shortRank}
            </Tag>
          </div>
          {(isLeader || member.recentlyPromoted || isCurrentUser) && (
            <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 mt-1.5 text-[10px] font-display font-bold leading-none">
              {isLeader && (
                <span className="text-[var(--secondary)]">leads</span>
              )}
              {member.recentlyPromoted && (
                <span className="inline-flex items-center gap-0.5 text-[color:color-mix(in_srgb,var(--accent)_70%,var(--text))]">
                  <KawaiiSparkle className="w-2.5 h-2.5" />
                  promoted
                </span>
              )}
              {isCurrentUser && (
                <span className="text-[var(--primary)]">that's you!</span>
              )}
            </div>
          )}
        </div>
      </a>

      <StickyBioNote
        bio={member.biography}
        rankHex={rankColor.hex}
        editable={isOwnEditable}
        tilt={tilt.note}
      />
    </article>
  );
});

export function About() {
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["staff"],
    queryFn: () => membersApi.getStaff(),
    staleTime: 1000 * 60 * 5,
  });

  const currentUserName = isAuthenticated ? user?.memberName : undefined;
  // inline note editing only when the role can set its own biography (same gate
  // as the Profile editor).
  const canEditOwn = isAuthenticated && user?.hasKnighthood === true;

  const staff = useMemo(() => {
    const rawStaff = data?.staff ?? [];
    return [...rawStaff].sort((a, b) => {
      const rankDiff =
        (RANK_ORDER.get(a.freeCompanyRank) ?? 999) -
        (RANK_ORDER.get(b.freeCompanyRank) ?? 999);
      return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
    });
  }, [data?.staff]);

  const leaderName = useMemo(
    () => staff.find((m) => m.freeCompanyRank === "Moogle Guardian")?.name,
    [staff],
  );

  const hasStaff = !isLoading && !isError && staff.length > 0;

  return (
    <PageLayout
      moogles={{ primary: wizardMoogle, secondary: flyingMoogles }}
      maxWidth="max-w-5xl"
    >
      <div className="corkboard relative px-3.5 py-7 sm:px-6 sm:py-9 md:px-9 md:py-11">
        <span
          className="pushpin absolute top-3 left-3 sm:top-4 sm:left-4 z-20"
          aria-hidden="true"
        />
        <span
          className="pushpin absolute top-3 right-3 sm:top-4 sm:right-4 z-20"
          style={{ "--pin": "var(--secondary)" } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="pushpin absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20"
          style={{ "--pin": "var(--accent)" } as CSSProperties}
          aria-hidden="true"
        />
        <span
          className="pushpin absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20"
          style={{ "--pin": "var(--secondary)" } as CSSProperties}
          aria-hidden="true"
        />

        <img
          src={lilGuyMoogle}
          alt=""
          aria-hidden="true"
          className="hidden lg:block absolute -top-7 -right-4 w-20 rotate-[10deg] animate-[float-gentle_4s_ease-in-out_infinite] pointer-events-none select-none z-20"
        />

        <header className="relative w-fit mx-auto mb-7 sm:mb-9 text-center animate-[fadeSlideIn_0.4s_ease-out]">
          <span
            className="pushpin absolute -top-2 left-1/2 -translate-x-1/2 z-10"
            aria-hidden="true"
          />
          <div className="surface paper -rotate-1 px-7 sm:px-12 py-5 sm:py-6">
            <div
              className="flex items-center justify-center gap-1.5 mb-1.5"
              aria-hidden="true"
            >
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <KawaiiBow className="w-6 h-6 text-[var(--primary)]" />
              <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--secondary)]" />
            </div>
            <p className="eyebrow-script text-lg sm:text-2xl text-[var(--secondary)]/90 mb-1">
              ~ pull up a chair, kupo ~
            </p>
            <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text)]">
              <span className="text-highlight">Who We Are</span>
            </h1>
          </div>
        </header>

        <motion.section
          className="relative mb-9 sm:mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span
            className="pushpin absolute -top-2 left-10 z-10"
            style={{ "--pin": "var(--primary)" } as CSSProperties}
            aria-hidden="true"
          />
          <span
            className="pushpin absolute -top-2 right-10 z-10"
            style={{ "--pin": "var(--accent)" } as CSSProperties}
            aria-hidden="true"
          />
          <div className="surface paper p-5 sm:p-8 text-center -rotate-[0.5deg]">
            <img
              src={illustratedMoogle}
              alt=""
              aria-hidden="true"
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 object-contain drop-shadow-md"
            />
            <div className="space-y-4 text-[var(--text-muted)] font-soft text-base sm:text-lg leading-relaxed">
              <p>
                Kupo Life is a cozy Free Company on{" "}
                <strong className="text-[var(--text)] font-semibold">
                  Zalera
                </strong>
                , over in the{" "}
                <strong className="text-[var(--text)] font-semibold">
                  Crystal
                </strong>{" "}
                data center. More than anything, it's a place to log in and not
                be alone, kupo.
              </p>
              <p>
                There's no quota to hit and no pressure to perform. Raid if you
                raid, craft if you craft, or park a retainer and just chat.
                Whatever you're into, odds are someone here is into it too.
              </p>
              <p>
                We do the occasional silly thing, screenshot competitions,
                treasure hunts, a giveaway here and there, and the Discord stays
                lively even when the servers are down. Mostly though, it's just
                home.
              </p>
            </div>
            <figure className="mt-7">
              <Quote
                className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]/40 rotate-180"
                aria-hidden="true"
              />
              <p className="font-accent text-2xl sm:text-3xl text-[var(--secondary)] leading-snug">
                A warm corner of Eorzea to come back to, kupo.
              </p>
            </figure>
          </div>
        </motion.section>

        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div
            className="sticker px-3 py-1.5"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--primary) 14%, var(--card))",
              border:
                "2px solid color-mix(in srgb, var(--primary) 30%, var(--card))",
            }}
          >
            <KawaiiHeart className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="font-display font-bold text-sm sm:text-base text-[var(--text)] leading-none">
              The folks who keep it cozy
            </h2>
            {staff.length > 0 && (
              <span
                className="text-xs font-display font-bold px-1.5 py-0.5 rounded-full leading-none"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--primary) 20%, var(--card))",
                  color: "var(--primary)",
                }}
              >
                {staff.length}
              </span>
            )}
          </div>
          <div
            className="flex-1 border-t-2 border-dashed border-[color:color-mix(in_srgb,var(--primary)_22%,transparent)]"
            aria-hidden="true"
          />
          <KawaiiStar className="w-4 h-4 text-[var(--accent)]" />
        </div>

        {isLoading ? (
          <div className="paper">
            <LoadingState message="Rounding everyone up, kupo..." />
          </div>
        ) : isError ? (
          <div className="paper">
            <ErrorState
              message="A moogle fell over, kupo..."
              onRetry={() => refetch()}
            />
          </div>
        ) : staff.length === 0 ? (
          <div className="paper">
            <EmptyState
              title="Nobody home yet"
              message="No one to show just yet, kupo~"
              imageSrc={moogleMail}
            />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-14">
            {staff.map((member) => (
              <StaffCard
                key={member.characterId}
                member={member}
                isLeader={member.name === leaderName}
                isCurrentUser={currentUserName === member.name}
                isOwnEditable={currentUserName === member.name && canEditOwn}
              />
            ))}
          </div>
        )}

        {hasStaff && (
          <div className="text-center mt-12 sm:mt-14 pt-2">
            <p className="eyebrow-script text-2xl text-[var(--text-muted)] inline-flex items-center justify-center gap-2.5">
              <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
              However long you've been here, we're glad you're part of it, kupo.
              <KawaiiHeart className="w-5 h-5 text-[var(--primary)]" />
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
