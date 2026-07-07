interface NavCharmsProps {
  className?: string;
  side?: "left" | "right";
}

const gold = "var(--nav-gold, #c7954b)";
const rose = "var(--nav-accent, #bc8580)";
const paper = "var(--nav-tab, #f8ecdd)";
const thread = "var(--nav-stem, #cfb189)";

function PaperStar({
  x,
  y,
  angle = 0,
}: {
  x: number;
  y: number;
  angle?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <g className="nav-charm-glint">
        <path
          d="M0-9L2.9-3.1L9.5-2L4.8 2.6L5.8 9.3L0 6.1L-6.2 9L-5 2.5L-9.6-2.3L-3-3.2Z"
          fill={paper}
          stroke={gold}
          strokeWidth=".9"
        />
        <path
          d="M0-9L0 1L9.5-2L4.8 2.6L0 1L5.8 9.3L0 6.1L0 1L-6.2 9L-5 2.5L0 1L-9.6-2.3L-3-3.2Z"
          fill={gold}
          opacity=".35"
        />
        <path d="M0-6.6L0-3.8" stroke={paper} strokeWidth=".75" />
      </g>
    </g>
  );
}

/** A little paper-and-brass mobile, hung from the masthead's stitched edge. */
export function NavCharms({ className = "", side = "left" }: NavCharmsProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        transform={
          side === "right" ? "translate(180 0) scale(-1 1)" : undefined
        }
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 8C41 31 119 35 175 7" stroke={thread} strokeWidth="1.05" />
        <path
          d="M5 10C42 34 118 37 174 10"
          stroke={gold}
          strokeWidth=".5"
          opacity=".45"
        />
        <g className="nav-charm-thread">
          <path
            d="M37 22C36 30 41 36 39 46M91 29C88 40 90 46 88 53M140 21C141 37 137 46 139 61"
            stroke={thread}
            strokeWidth=".85"
          />
          <g fill={paper} stroke={gold} strokeWidth=".75">
            <circle cx="38" cy="37" r="1.8" />
            <circle cx="89" cy="43" r="1.8" />
            <circle cx="139" cy="48" r="1.8" />
          </g>
          <g fill={rose}>
            <circle cx="37" cy="23" r="1.3" />
            <circle cx="91" cy="29" r="1.5" />
            <circle cx="140" cy="22" r="1.3" />
            <circle cx="139" cy="54" r="1.1" />
          </g>
          <PaperStar x={39} y={55} angle={-12} />
          <PaperStar x={139} y={70} angle={13} />
          <g className="nav-charm-glint">
            <path
              d="M89 54C76 55 74 70 83 77C88 81 97 80 101 74C89 77 80 63 89 54Z"
              fill={paper}
              stroke={gold}
              strokeWidth="1"
            />
            <path
              d="M85 58C77 66 82 76 91 78"
              stroke={gold}
              strokeWidth="1.8"
              opacity=".3"
            />
          </g>
        </g>
        <g stroke={rose} strokeWidth=".85">
          <path
            d="M91 29C83 30 78 24 80 21C83 18 89 24 91 29C94 22 100 21 101 24C102 29 95 30 91 29Z"
            fill={paper}
          />
          <path d="M90 30Q85 35 83 37M92 30Q97 36 100 35" />
        </g>
        <g stroke={gold} strokeWidth=".7" opacity=".75">
          <path d="M20 48V54M17 51H23M114 46V52M111 49H117M64 76V80M62 78H66" />
          <circle cx="62" cy="42" r=".8" fill={gold} stroke="none" />
          <circle cx="113" cy="81" r=".9" fill={gold} stroke="none" />
          <circle cx="159" cy="45" r=".75" fill={gold} stroke="none" />
        </g>
      </g>
    </svg>
  );
}
