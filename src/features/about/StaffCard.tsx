import { memo, useId, useState, type CSSProperties } from "react";
import type { StaffMember } from "@/shared/types";
import { FamilyRankIcon } from "@/features/members/FamilyIcons";
import { StickyBioNote } from "@/features/about/StickyBioNote";
import { AboutIcon } from "./AboutIcons";
import "./about-staff.css";

function photoTilt(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (((hash >>> 0) % 5) - 2) * 0.6;
}

function StaffPortrait({ member }: { member: StaffMember }) {
  const [imageState, setImageState] = useState<
    "loading" | "ready" | "unavailable"
  >(member.avatarLink ? "loading" : "unavailable");
  const initials = member.name
    .trim()
    .split(/\s+/)
    .map((part) => Array.from(part)[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return (
    <div className="about-staff-portrait" data-image-state={imageState}>
      {imageState !== "ready" && (
        <span className="about-staff-portrait-placeholder" aria-hidden="true">
          <span>{initials || "?"}</span>
          {imageState === "unavailable" && <small>No portrait</small>}
        </span>
      )}
      {imageState !== "unavailable" && (
        <img
          src={member.avatarLink}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setImageState("ready")}
          onError={() => setImageState("unavailable")}
        />
      )}
    </div>
  );
}

export const StaffCard = memo(function StaffCard({
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
  const nameId = useId();
  const rankInk = "color-mix(in srgb, var(--scene-leaf) 60%, var(--nook-ink))";

  return (
    <article
      className="about-staff-card"
      aria-labelledby={nameId}
      style={
        {
          "--staff-photo-tilt": `${photoTilt(member.characterId)}deg`,
        } as CSSProperties
      }
    >
      <div className="about-staff-layout">
        <a
          href={`https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="about-staff-polaroid"
          aria-label={`View Lodestone profile for ${member.name} (opens in new tab)`}
          title="View Lodestone profile (opens in new tab)"
        >
          <span className="about-staff-tape" aria-hidden="true" />
          <StaffPortrait key={member.avatarLink} member={member} />
          <span className="about-staff-lodestone">
            View Lodestone <AboutIcon name="external" size={13} />
          </span>
        </a>

        <header className="about-staff-heading">
          <h4 id={nameId}>{member.name}</h4>
          <p className="about-staff-rank">
            <FamilyRankIcon rank={member.freeCompanyRank} size={20} />
            <span>{member.freeCompanyRank}</span>
          </p>
          {(isLeader || member.recentlyPromoted || isCurrentUser) && (
            <div className="about-staff-details">
              {isLeader && (
                <span className="about-staff-detail">FC leader</span>
              )}
              {member.recentlyPromoted && (
                <span className="about-staff-detail">
                  <AboutIcon name="sparkle" size={13} /> Recently promoted
                </span>
              )}
              {isCurrentUser && (
                <span className="about-staff-detail about-staff-detail--you">
                  <AboutIcon name="heart" size={12} /> That’s you
                </span>
              )}
            </div>
          )}
        </header>

        <div className="about-staff-biography">
          <StickyBioNote
            bio={member.biography}
            memberName={member.name}
            rankHex={rankInk}
            editable={isOwnEditable}
            tilt={0}
          />
        </div>
      </div>
    </article>
  );
});
