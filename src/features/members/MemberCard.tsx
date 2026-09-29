import { useState, memo, type CSSProperties } from "react";
import type { FreeCompanyMember } from "@/shared/types";
import { FamilyIcon, FamilyRankIcon } from "./FamilyIcons";
import "./member-card.css";

interface MemberCardProps {
  member: FreeCompanyMember;
  index?: number;
}

function MemberPortrait({ member }: { member: FreeCompanyMember }) {
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
    <div className="family-member-portrait" data-image-state={imageState}>
      {imageState !== "ready" && (
        <span className="family-member-placeholder" aria-hidden="true">
          <FamilyIcon
            name="flower"
            className="family-member-placeholder-flower"
            size={30}
          />
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
          onLoad={() => setImageState("ready")}
          onError={() => setImageState("unavailable")}
          draggable={false}
        />
      )}
    </div>
  );
}

export const MemberCard = memo(function MemberCard({
  member,
  index = 0,
}: MemberCardProps) {
  return (
    <article
      className="family-member-card"
      aria-label={`${member.name}, ${member.freeCompanyRank}`}
      style={
        {
          "--member-tilt": `${(((index * 7 + 3) % 5) - 2) * 0.55}deg`,
          "--member-tape-tilt": `${[-4, 3, -2, 5, 1][index % 5]}deg`,
        } as CSSProperties
      }
    >
      <a
        href={`https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${member.name}'s Lodestone profile, ${member.freeCompanyRank} (opens in new tab)`}
        title="View Lodestone profile (opens in new tab)"
      >
        <span className="family-member-tape" aria-hidden="true" />
        <div className="family-member-photo">
          <MemberPortrait key={member.avatarLink} member={member} />
        </div>
        <div className="family-member-caption">
          <h3>{member.name}</h3>
          <p>
            <FamilyRankIcon rank={member.freeCompanyRank} size={16} />
            <span>{member.freeCompanyRank}</span>
          </p>
          <span className="family-member-profile" aria-hidden="true">
            <FamilyIcon name="external" size={13} />
          </span>
        </div>
      </a>
    </article>
  );
});

export function MemberCardSkeleton() {
  return (
    <div
      className="family-member-card family-member-skeleton"
      aria-hidden="true"
    >
      <span className="family-member-tape" />
      <div className="family-member-skeleton-photo animate-pulse">
        <FamilyIcon name="people" size={38} />
      </div>
      <div className="family-member-skeleton-caption">
        <span className="animate-pulse" />
        <span className="animate-pulse" />
      </div>
    </div>
  );
}

export function MemberCardCompact({ member }: { member: FreeCompanyMember }) {
  return (
    <a
      href={`https://na.finalfantasyxiv.com/lodestone/character/${member.characterId}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${member.name}'s Lodestone profile, ${member.freeCompanyRank} (opens in new tab)`}
      className="family-member-compact"
    >
      <div className="family-member-compact-photo">
        <MemberPortrait key={member.avatarLink} member={member} />
      </div>
      <div className="family-member-compact-caption">
        <p>{member.name}</p>
        <span>
          <FamilyRankIcon rank={member.freeCompanyRank} size={15} />
          {member.freeCompanyRank}
        </span>
      </div>
      <FamilyIcon
        name="external"
        size={15}
        className="family-member-compact-external"
      />
    </a>
  );
}
