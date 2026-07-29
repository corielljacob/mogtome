import { KawaiiSparkle, KawaiiStar } from "@/shared/ui/kawaiiMotifs";
import "./storybook-atmosphere.css";

type DecorationProps = { className?: string };

/** A little pressed flower, with deliberately uneven, soft petals. */
function PaperFlower({ className = "" }: DecorationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      focusable="false"
    >
      <path
        d="M31 22C18 5 35-2 41 11c2 5 1 10-2 14 18-10 28 6 14 14-5 2-11 1-15-2 12 17-2 30-12 18-3-4-3-10 0-16C9 51-3 35 10 26c5-3 11-3 16 1-3-2-6-4-8-9"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="31" r="7" className="storybook-flower-center" />
      <path
        d="m31 28 1 2m3 2-1 1m-5 1 1-1"
        className="storybook-flower-seeds"
      />
    </svg>
  );
}

/** Place first inside a positioned, isolated Home container; content sits above it. */
export function StorybookAtmosphere({ className = "" }: DecorationProps) {
  return (
    <div className={`storybook-atmosphere ${className}`} aria-hidden="true">
      <svg
        className="storybook-atmosphere__garland"
        viewBox="0 0 1200 150"
        fill="none"
        focusable="false"
      >
        <path
          className="storybook-atmosphere__cord"
          d="M-24 14C115 115 289 113 408 34c95 53 234 69 349 22 130 79 315 63 467-39"
        />
        <g className="storybook-atmosphere__charm storybook-atmosphere__charm--pink">
          <path className="storybook-atmosphere__string" d="m117 80 1 17" />
          <circle cx="118" cy="105" r="10" />
          <path
            className="storybook-atmosphere__shine"
            d="M112 103c0-3 2-5 5-5"
          />
        </g>
        <g className="storybook-atmosphere__charm storybook-atmosphere__charm--gold">
          <path className="storybook-atmosphere__string" d="m307 80 1 22" />
          <path d="m308 100 5 10 12 1-9 8 2 12-10-6-11 6 3-12-9-8 12-1Z" />
        </g>
        <g className="storybook-atmosphere__charm storybook-atmosphere__charm--lilac">
          <path className="storybook-atmosphere__string" d="m582 86 1 16" />
          <circle cx="583" cy="110" r="9" />
          <path
            className="storybook-atmosphere__shine"
            d="M578 108c0-3 1-4 4-4"
          />
        </g>
        <g className="storybook-atmosphere__charm storybook-atmosphere__charm--gold">
          <path className="storybook-atmosphere__string" d="m880 104 1 15" />
          <path d="m881 117 5 9 10 2-7 7 1 11-9-5-9 5 2-11-8-7 11-2Z" />
        </g>
        <g className="storybook-atmosphere__charm storybook-atmosphere__charm--pink">
          <path className="storybook-atmosphere__string" d="m1090 85 1 18" />
          <circle cx="1091" cy="111" r="10" />
          <path
            className="storybook-atmosphere__shine"
            d="M1085 109c0-3 2-5 5-5"
          />
        </g>
      </svg>

      <KawaiiSparkle className="storybook-atmosphere__sparkle storybook-atmosphere__sparkle--one" />
      <KawaiiStar className="storybook-atmosphere__sparkle storybook-atmosphere__sparkle--two" />
    </div>
  );
}

/** A quiet frame behind the hero mascot. Its parent establishes its own stacking context. */
export function StorybookOrbit({ className = "" }: DecorationProps) {
  return (
    <div className={`storybook-orbit ${className}`} aria-hidden="true">
      <svg viewBox="0 0 560 560" fill="none" focusable="false">
        <path
          className="storybook-orbit__line"
          d="M71 388C15 334 77 203 212 134C354 60 491 80 511 157C532 240 409 366 264 429C193 460 132 466 95 443"
        />
        <circle className="storybook-orbit__pom" cx="511" cy="157" r="11" />
        <path className="storybook-orbit__shine" d="M505 155c1-3 3-5 6-5" />
      </svg>
      <PaperFlower className="storybook-orbit__flower" />
    </div>
  );
}
