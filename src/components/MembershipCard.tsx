import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Star, ExternalLink } from "lucide-react";

import lilGuyMoogle from "../assets/moogles/lil guy moogle.webp";
import { getRankColor } from "../constants";
import { formatMemberSince } from "../utils";
import { useReducedMotion } from "../hooks";
import { KawaiiStar, KawaiiHeart, KawaiiSparkle } from "./kawaiiMotifs";

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERSHIP CARD — a kawaii, "physical" FC member card. At rest it's a matte
// candy-paper card; on hover it becomes a holographic keepsake that pivots to
// the cursor, catches the light (glare + pastel sheen) and lifts off the page,
// with the moogle popping out in 3D. Pointer-tilt is gated behind reduced-motion
// and hover-capable pointers, so touch / reduced-motion get the calm static card.
// ─────────────────────────────────────────────────────────────────────────────

export interface MembershipCardProps {
  name: string;
  rank: string;
  avatarUrl: string;
  characterId?: string;
  /** MogTome first-login date (NOT the FC join date); shown as "MogTome member since …" */
  memberSince?: Date | string;
  compact?: boolean;
}

const MAX_TILT = 12; // degrees
const HOVER_SCALE = 1.03;

export function MembershipCard({
  name,
  rank,
  avatarUrl,
  characterId,
  memberSince,
  compact = false,
}: MembershipCardProps) {
  const rankColor = getRankColor(rank);
  const RankIcon = rankColor.icon;
  const lodestoneUrl = characterId
    ? `https://na.finalfantasyxiv.com/lodestone/character/${characterId}`
    : null;
  const since = memberSince ? formatMemberSince(memberSince) : null;

  const prefersReducedMotion = useReducedMotion();
  const [canHover] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  const enableTilt = !prefersReducedMotion && canHover;

  const rootRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const setVar = (name: string, value: string) =>
    rootRef.current?.style.setProperty(name, value);

  const handleEnter = () => {
    const el = rootRef.current;
    if (!el) return;
    rectRef.current = el.getBoundingClientRect();
    setVar("--glow", "1");
    setVar("--s", String(HOVER_SCALE));
    setVar("--card-shadow", "var(--panel-shadow-strong)");
  };

  const handleMove = (e: React.MouseEvent) => {
    const rect = rectRef.current;
    if (!rect) return;
    const px = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const py = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    setVar("--ry", `${((px - 0.5) * 2 * MAX_TILT).toFixed(2)}deg`);
    setVar("--rx", `${((0.5 - py) * 2 * MAX_TILT).toFixed(2)}deg`);
    setVar("--mx", `${(px * 100).toFixed(1)}%`);
    setVar("--my", `${(py * 100).toFixed(1)}%`);
  };

  const handleLeave = () => {
    setVar("--rx", "0deg");
    setVar("--ry", "0deg");
    setVar("--s", "1");
    setVar("--glow", "0");
    setVar("--card-shadow", "var(--panel-shadow)");
  };

  const sizeClass = compact ? "max-w-[340px] sm:max-w-[360px]" : "max-w-[360px]";
  const padding = compact ? "p-4 sm:p-[1.15rem]" : "p-5";
  const avatarSize = compact ? "w-14 h-14 sm:w-16 sm:h-16" : "w-16 h-16";
  const nameSize = compact ? "text-base" : "text-base sm:text-lg";

  return (
    <div className={compact ? "" : "py-4"}>
      <div
        className={`relative w-full ${sizeClass} mx-auto`}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={rootRef}
          onMouseEnter={enableTilt ? handleEnter : undefined}
          onMouseMove={enableTilt ? handleMove : undefined}
          onMouseLeave={enableTilt ? handleLeave : undefined}
          className={`relative aspect-[1.6/1] ${
            enableTilt
              ? "preserve-3d"
              : "transition-transform duration-300 hover:-translate-y-1"
          }`}
          style={
            enableTilt
              ? ({
                  transform:
                    "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--s,1))",
                  transition: "transform 0.2s cubic-bezier(0.23,1,0.32,1)",
                } as CSSProperties)
              : undefined
          }
        >
          {/* Card face — clipped, rounded, bordered */}
          <div
            className="absolute inset-0 rounded-[1.75rem] overflow-hidden border-2"
            style={
              {
                borderColor:
                  "color-mix(in srgb, var(--primary) 22%, var(--card))",
                background: `linear-gradient(140deg,
                  color-mix(in srgb, var(--primary) 18%, var(--card)) 0%,
                  color-mix(in srgb, var(--secondary) 13%, var(--card)) 52%,
                  color-mix(in srgb, var(--accent) 15%, var(--card)) 100%)`,
                boxShadow: "var(--card-shadow, var(--panel-shadow))",
                transition: "box-shadow 0.25s ease-out",
              } as CSSProperties
            }
          >
            {/* Candy polka-dot texture */}
            <div
              className="absolute inset-0 opacity-[0.5] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--primary) 22%, transparent) 1.5px, transparent 1.6px)",
                backgroundSize: "15px 15px",
              }}
              aria-hidden="true"
            />

            {/* Rank-tinted glow, warms on hover */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                boxShadow: `inset 0 0 34px -10px ${rankColor.glow}`,
                opacity: "calc(0.3 + var(--glow,0) * 0.35)",
              }}
              aria-hidden="true"
            />

            {/* Flat background stickers */}
            <KawaiiStar className="absolute top-9 right-3 w-3.5 h-3.5 text-[var(--accent)] opacity-50 rotate-12" />
            <KawaiiHeart className="absolute bottom-3 right-4 w-3 h-3 text-[var(--primary)] opacity-40 -rotate-6" />

            {/* Content */}
            <div className={`relative h-full ${padding} flex flex-col`}>
              {/* Header */}
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-xl shrink-0"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--primary) 80%, var(--card))",
                    border:
                      "2px solid color-mix(in srgb, var(--primary) 90%, #fff)",
                  }}
                  aria-hidden="true"
                >
                  <Star className="w-3.5 h-3.5 text-white fill-white/70" />
                </span>
                <div className="leading-none">
                  <p className="font-display font-bold text-[var(--text)] text-sm tracking-wide">
                    Kupo Life
                  </p>
                  <p className="font-accent text-[var(--primary)] text-lg leading-tight">
                    ~ member card ~
                  </p>
                </div>
              </div>

              <div className="flex-1" />

              {/* Member */}
              <div className="flex items-end gap-3">
                <div className="relative shrink-0">
                  <div
                    className="absolute -inset-1 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${rankColor.hex}, color-mix(in srgb, var(--accent) 70%, var(--card)))`,
                      opacity: 0.7,
                    }}
                    aria-hidden="true"
                  />
                  <img
                    src={avatarUrl}
                    alt=""
                    className={`relative ${avatarSize} rounded-2xl object-cover border-2 border-[color:color-mix(in_srgb,var(--card)_85%,#fff)]`}
                  />
                  <span
                    className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center w-6 h-6 rounded-full"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${rankColor.hex} 26%, var(--card))`,
                      border: `2px solid color-mix(in srgb, ${rankColor.hex} 42%, var(--card))`,
                    }}
                    aria-hidden="true"
                  >
                    <RankIcon
                      className="w-3 h-3"
                      style={{ color: rankColor.hex }}
                    />
                  </span>
                </div>

                <div className="flex-1 min-w-0 pb-0.5">
                  <h3
                    className={`font-display font-bold text-[var(--text)] ${nameSize} truncate leading-tight`}
                  >
                    {name}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-soft font-semibold"
                      style={{
                        color: rankColor.hex,
                        backgroundColor: `color-mix(in srgb, ${rankColor.hex} 16%, var(--card))`,
                        border: `1.5px solid color-mix(in srgb, ${rankColor.hex} 32%, var(--card))`,
                      }}
                    >
                      <RankIcon className="w-2.5 h-2.5" aria-hidden="true" />
                      {rank}
                    </span>
                    {lodestoneUrl && (
                      <a
                        href={lodestoneUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-[var(--text-subtle)] hover:text-[var(--primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none rounded"
                      >
                        <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
                        Lodestone
                      </a>
                    )}
                  </div>
                </div>

                <KawaiiSparkle className="w-4 h-4 text-[var(--accent)] opacity-70 shrink-0 mb-1" />
              </div>

              {/* MogTome member-since stamp */}
              {since && (
                <p className="mt-3 text-center font-accent text-base text-[var(--text-subtle)] leading-none">
                  MogTome member since {since}
                </p>
              )}
            </div>

            {/* ── Lighting overlays (above content, pointer-events-none) ───────── */}
            {/* Pastel holographic sheen — sweeps with the cursor */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(105deg,
                  transparent 30%,
                  color-mix(in srgb, var(--secondary) 55%, transparent) 44%,
                  color-mix(in srgb, var(--primary) 50%, transparent) 50%,
                  color-mix(in srgb, var(--accent) 55%, transparent) 56%,
                  transparent 70%)`,
                backgroundSize: "220% 100%",
                backgroundPositionX: "var(--mx,50%)",
                mixBlendMode: "soft-light",
                opacity: "calc(var(--glow,0) * 0.9)",
                transition: "opacity 0.25s ease-out",
              }}
              aria-hidden="true"
            />
            {/* Specular glare — a soft light that follows the pointer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.6), rgba(255,255,255,0) 42%)",
                mixBlendMode: "soft-light",
                opacity: "var(--glow,0)",
                transition: "opacity 0.25s ease-out",
              }}
              aria-hidden="true"
            />
            {/* Static top rim sheen for a glossy edge */}
            <div
              className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.16), transparent)",
                opacity: "calc(0.35 + var(--glow,0) * 0.4)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Moogle — pops out of the card in 3D (sibling, so it isn't clipped) */}
          <span
            className="absolute -top-4 -right-3 z-10 pointer-events-none select-none"
            style={enableTilt ? { transform: "translateZ(45px)" } : undefined}
            aria-hidden="true"
          >
            <img
              src={lilGuyMoogle}
              alt=""
              className="w-16 object-contain rotate-[8deg] animate-float-gentle drop-shadow-[0_6px_10px_rgba(0,0,0,0.22)]"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
