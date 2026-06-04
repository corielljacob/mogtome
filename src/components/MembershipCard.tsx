import { useRef, useState } from "react";
import type { CSSProperties } from "react";

import lilGuyMoogle from "../assets/moogles/lil guy moogle.webp";
import { getRankColor } from "../constants";
import { useReducedMotion } from "../hooks";
import { useTheme } from "../contexts/ThemeContext";
import { KawaiiHeart, KawaiiStar } from "./kawaiiMotifs";

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERSHIP CARD — a handmade café-style member card: a marker-handwritten
// Japanese face (Yusei Magic), a washi-taped tilted photo, hand-drawn lines and
// doodles on cream paper, finished with a warm welcome note. At rest it's matte
// cardstock; on hover it pivots to the cursor and catches the light. Pointer-tilt
// is gated behind reduced-motion + hover pointers; lighting eases off in dark.
// ─────────────────────────────────────────────────────────────────────────────

export interface MembershipCardProps {
  name: string;
  rank: string;
  avatarUrl: string;
  characterId?: string;
  /** MogTome first-login date (NOT the FC join date); shown in the "Member Since" field */
  memberSince?: Date | string;
  compact?: boolean;
}

const MAX_TILT = 12; // degrees
const HOVER_SCALE = 1.03;

// Handmade marker-handwritten face, just for the card (loaded in index.html).
const HAND = '"Yusei Magic", "Zen Maru Gothic", "Caveat", cursive';

/** A little paw print — the café's hand-drawn logo mark. */
function PawPrint({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="12" cy="16.2" rx="5.2" ry="4.3" />
      <circle cx="5.4" cy="10.6" r="2.1" />
      <circle cx="9.7" cy="7.1" r="2.2" />
      <circle cx="14.3" cy="7.1" r="2.2" />
      <circle cx="18.6" cy="10.6" r="2.1" />
    </svg>
  );
}

/** Hand-drawn wavy underline. */
function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0,3 Q8,0 16,3 T32,3 T48,3 T64,3 T80,3 T100,3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function printDate(memberSince?: Date | string): string | null {
  if (!memberSince) return null;
  const d = memberSince instanceof Date ? memberSince : new Date(memberSince);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function MembershipCard({
  name,
  rank,
  avatarUrl,
  memberSince,
  compact = false,
}: MembershipCardProps) {
  const rankColor = getRankColor(rank);
  const RankIcon = rankColor.icon;
  const since = printDate(memberSince);

  const { isDarkMode } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [canHover] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  const enableTilt = !prefersReducedMotion && canHover;

  // Lighting is gentler in dark mode (soft-light white blows out on a dark card).
  const lit = {
    glareWhite: isDarkMode ? 0.34 : 0.6,
    glareMul: isDarkMode ? 0.55 : 1,
    holoMul: isDarkMode ? 0.38 : 0.85,
    topSheen: isDarkMode ? 0.07 : 0.16,
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const setVar = (n: string, v: string) =>
    rootRef.current?.style.setProperty(n, v);

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

  const sizeClass = compact
    ? "max-w-[340px] sm:max-w-[360px]"
    : "max-w-[360px]";
  const dashColor =
    "border-[color:color-mix(in_srgb,var(--text)_24%,transparent)]";

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
          {/* Card face — cream paper */}
          <div
            className="absolute inset-0 rounded-[1.35rem] overflow-hidden border"
            style={
              {
                borderColor:
                  "color-mix(in srgb, var(--primary) 26%, var(--card))",
                background: `linear-gradient(165deg, color-mix(in srgb, var(--primary) 7%, var(--card)), var(--card) 55%)`,
                boxShadow: "var(--card-shadow, var(--panel-shadow))",
                transition: "box-shadow 0.25s ease-out",
              } as CSSProperties
            }
          >
            {/* Faint paper grain dots */}
            <div
              className="absolute inset-0 opacity-[0.3] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--text) 11%, transparent) 1px, transparent 1.4px)",
                backgroundSize: "13px 13px",
              }}
              aria-hidden="true"
            />
            {/* Doodles */}
            <KawaiiHeart className="absolute top-10 right-6 w-3 h-3 text-[var(--primary)] opacity-30 rotate-12" />
            <KawaiiStar className="absolute bottom-8 left-7 w-3 h-3 text-[var(--accent)] opacity-30 -rotate-12" />

            {/* Content — all handwritten */}
            <div
              className="relative h-full px-4 py-3 flex flex-col"
              style={{ fontFamily: HAND }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 -rotate-6"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    <PawPrint className="w-3.5 h-3.5 text-white" />
                  </span>
                  <div className="leading-none">
                    <p className="text-lg text-[var(--text)]">MogTome</p>
                    <p className="text-[10px] text-[var(--text-muted)] -mt-0.5">
                      メンバーズカード · Member's Card
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-[var(--text-subtle)] -rotate-3">
                  Kupo Life!
                </span>
              </div>

              {/* Hand-drawn divider */}
              <Squiggle className="w-full h-1.5 mt-1.5 text-[color:color-mix(in_srgb,var(--primary)_35%,transparent)]" />

              {/* Body — washi-taped photo + handwritten fields */}
              <div className="flex-1 flex items-center gap-4 min-h-0">
                {/* Photo */}
                <div className="relative shrink-0 rotate-[-3deg]">
                  {/* Washi tape */}
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-12 h-4 rotate-3 rounded-[2px]"
                    style={{
                      background:
                        "repeating-linear-gradient(45deg, color-mix(in srgb, var(--secondary) 42%, transparent) 0 5px, color-mix(in srgb, var(--secondary) 24%, transparent) 5px 10px)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="p-[5px] pb-3 rounded-[3px] bg-white"
                    style={{ boxShadow: "0 2px 5px -2px rgba(0,0,0,0.25)" }}
                  >
                    <img
                      src={avatarUrl}
                      alt=""
                      className="w-[4rem] h-[4rem] object-cover rounded-[2px]"
                    />
                  </div>
                  <span
                    className="absolute -bottom-1 -right-2 flex items-center justify-center w-6 h-6 rounded-full rotate-6"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${rankColor.hex} 26%, var(--card))`,
                      border: `2px solid color-mix(in srgb, ${rankColor.hex} 46%, var(--card))`,
                    }}
                    aria-hidden="true"
                  >
                    <RankIcon
                      className="w-3 h-3"
                      style={{ color: rankColor.hex }}
                    />
                  </span>
                </div>

                {/* Fields */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div>
                    <span className="block text-[10px] text-[var(--text-subtle)] leading-none">
                      なまえ / Name
                    </span>
                    <span className="block text-[var(--text)] text-xl leading-tight truncate">
                      {name}
                    </span>
                    <Squiggle className="w-20 h-1 text-[color:color-mix(in_srgb,var(--accent)_55%,transparent)]" />
                  </div>
                  <div className="flex gap-4">
                    <div className="min-w-0">
                      <span className="block text-[10px] text-[var(--text-subtle)] leading-none">
                        ランク / Rank
                      </span>
                      <span
                        className="flex items-center gap-1 text-sm leading-tight truncate"
                        style={{ color: rankColor.hex }}
                      >
                        <RankIcon
                          className="w-3 h-3 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate">{rank}</span>
                      </span>
                    </div>
                    {since && (
                      <div className="shrink-0">
                        <span className="block text-[10px] text-[var(--text-subtle)] leading-none">
                          なかま歴 / Since
                        </span>
                        <span className="block text-sm text-[var(--text)] leading-tight">
                          {since}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Warm footer note */}
              <div className="flex items-center justify-center gap-2 mt-1">
                <span
                  className={`flex-1 border-t border-dashed ${dashColor}`}
                  aria-hidden="true"
                />
                <p className="flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] whitespace-nowrap">
                  <KawaiiHeart className="w-3 h-3 text-[var(--primary)]" />
                  part of the moogle family
                  <KawaiiHeart className="w-3 h-3 text-[var(--primary)]" />
                </p>
                <span
                  className={`flex-1 border-t border-dashed ${dashColor}`}
                  aria-hidden="true"
                />
              </div>
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
                opacity: `calc(var(--glow,0) * ${lit.holoMul})`,
                transition: "opacity 0.25s ease-out",
              }}
              aria-hidden="true"
            />
            {/* Specular glare — a soft light that follows the pointer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,${lit.glareWhite}), rgba(255,255,255,0) 42%)`,
                mixBlendMode: "soft-light",
                opacity: `calc(var(--glow,0) * ${lit.glareMul})`,
                transition: "opacity 0.25s ease-out",
              }}
              aria-hidden="true"
            />
            {/* Static top rim sheen for a glossy edge */}
            <div
              className="absolute inset-x-0 top-0 h-1/4 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, rgba(255,255,255,${lit.topSheen}), transparent)`,
                opacity: "calc(0.5 + var(--glow,0) * 0.5)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Moogle — the café mascot, popping out of the corner in 3D */}
          <span
            className="absolute -bottom-3 -right-3 z-10 pointer-events-none select-none"
            style={enableTilt ? { transform: "translateZ(45px)" } : undefined}
            aria-hidden="true"
          >
            <img
              src={lilGuyMoogle}
              alt=""
              className="w-14 object-contain rotate-[-8deg] animate-float-gentle drop-shadow-[0_6px_10px_rgba(0,0,0,0.22)]"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
