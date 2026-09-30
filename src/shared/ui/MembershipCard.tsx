import { useEffect, useId, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { getRankColor } from "@/shared/constants/rankColors";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { KawaiiHeart } from "@/shared/ui/kawaiiMotifs";
import { MogTomeMark } from "@/shared/ui/MogTomeMark";
import { MembershipPatchEmbroidery } from "@/shared/ui/MembershipPatchEmbroidery";
import "./membership-card.css";

export interface MembershipCardProps {
  name: string;
  rank: string;
  avatarUrl: string;
  characterId?: string;
  /** MogTome first-login date (NOT the FC join date); shown in the "Since" field */
  memberSince?: Date | string;
  compact?: boolean;
}

function PawPrint() {
  const threadId = useId();
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id={threadId}
          width="2"
          height="2"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-30)"
        >
          <rect width="2" height="2" fill="currentColor" />
          <path
            d="M0 .5H2"
            stroke="var(--patch-thread-light)"
            strokeWidth=".45"
          />
        </pattern>
      </defs>
      <g fill={`url(#${threadId})`}>
        <ellipse cx="12" cy="16.2" rx="5.2" ry="4.3" />
        <circle cx="5.4" cy="10.6" r="2.1" />
        <circle cx="9.7" cy="7.1" r="2.2" />
        <circle cx="14.3" cy="7.1" r="2.2" />
        <circle cx="18.6" cy="10.6" r="2.1" />
      </g>
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
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const resetTilt = () => cardRef.current?.removeAttribute("data-tilted");

  useEffect(() => {
    const card = cardRef.current;
    const reset = () => card?.removeAttribute("data-tilted");
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    reset();
    hoverQuery.addEventListener("change", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, true);
    return () => {
      hoverQuery.removeEventListener("change", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset, true);
    };
  }, [prefersReducedMotion]);

  const tiltToPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (
      prefersReducedMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      resetTilt();
      return;
    }

    // Measure the stationary wrapper so rotation never feeds back into the tilt.
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    const y = Math.min(
      1,
      Math.max(0, (event.clientY - rect.top) / rect.height),
    );
    card.style.setProperty(
      "--patch-rotate-x",
      `${((0.5 - y) * 20).toFixed(2)}deg`,
    );
    card.style.setProperty(
      "--patch-rotate-y",
      `${((x - 0.5) * 20).toFixed(2)}deg`,
    );
    card.style.setProperty("--patch-light-x", `${(x * 100).toFixed(1)}%`);
    card.style.setProperty("--patch-light-y", `${(y * 100).toFixed(1)}%`);
    // Thread highlights face the light; their tiny contact shadows fall away
    // from it. These offsets are much smaller than the card's overall depth.
    card.style.setProperty(
      "--patch-glint-x",
      `${((x - 0.5) * 1.4).toFixed(2)}px`,
    );
    card.style.setProperty(
      "--patch-glint-y",
      `${((y - 0.5) * 1.4).toFixed(2)}px`,
    );
    card.style.setProperty(
      "--patch-thread-shadow-x",
      `${((0.5 - x) * 2.6).toFixed(2)}px`,
    );
    card.style.setProperty(
      "--patch-thread-shadow-y",
      `${((0.5 - y) * 2.6).toFixed(2)}px`,
    );
    card.style.setProperty(
      "--patch-cast-x",
      `${((0.5 - x) * 22).toFixed(1)}px`,
    );
    card.dataset.tilted = "true";
  };

  return (
    <div
      ref={cardRef}
      className={`membership-card${compact ? " membership-card-compact" : ""}`}
      onPointerEnter={tiltToPointer}
      onPointerMove={tiltToPointer}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <div
        className="membership-patch"
        style={{ "--patch-rank": rankColor.hex } as CSSProperties}
      >
        <MembershipPatchEmbroidery />
        <div className="membership-patch-content">
          <div className="membership-patch-header">
            <span className="membership-patch-paw">
              <PawPrint />
            </span>
            <div className="membership-patch-brand">
              <p>
                <span className="membership-thread-lettering">MogTome</span>
              </p>
              <span>Member's Card</span>
            </div>
            <span className="membership-patch-greeting">Kupo Life!</span>
          </div>
          <div className="membership-patch-member">
            <div className="membership-patch-portrait">
              <img src={avatarUrl} alt="" />
              <span className="membership-patch-rank-badge" aria-hidden="true">
                <RankIcon />
              </span>
            </div>
            <div className="membership-patch-details">
              <dl className="membership-patch-name">
                <dt>Name</dt>
                <dd>
                  <span className="membership-thread-lettering">{name}</span>
                </dd>
              </dl>
              <dl className="membership-patch-facts">
                <div>
                  <dt>Rank</dt>
                  <dd className="membership-patch-rank">
                    <RankIcon aria-hidden="true" />
                    <span>{rank}</span>
                  </dd>
                </div>
                {since && (
                  <div>
                    <dt>Since</dt>
                    <dd>{since}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          <div className="membership-patch-footer">
            <KawaiiHeart />
            <p>member of Kupo Life</p>
            <KawaiiHeart />
          </div>
        </div>
        <span className="membership-patch-moogle" aria-hidden="true">
          <MogTomeMark />
        </span>
      </div>
    </div>
  );
}
