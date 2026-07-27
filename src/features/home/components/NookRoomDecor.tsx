import { useId } from "react";
import { NookReadingCorner } from "./NookReadingCorner";
import "./nook-room-decor.css";

/** Quiet details around the room, all painted with the same inks as the window. */
export function NookRoomDecor({ isDark }: { isDark: boolean }) {
  const id = useId().replace(/:/g, "");

  return (
    <div className="nook-room-decor" aria-hidden="true">
      <div className="nook-room-lamplight" />
      <svg
        className="nook-room-charms nook-room-charms--left"
        viewBox="0 0 160 260"
        fill="none"
        focusable="false"
      >
        <defs>
          <radialGradient id={`${id}-glow`}>
            <stop stopColor="var(--scene-glow)" stopOpacity=".28" />
            <stop offset="1" stopColor="var(--scene-glow)" stopOpacity="0" />
          </radialGradient>
          <g id={`${id}-star`} strokeLinejoin="round">
            <circle r="27" fill={`url(#${id}-glow)`} />
            <path
              d="m0-12 3.6 8 8.9 1-6.6 6 1.9 9L0 7.5-7.8 12l1.5-9-6.2-6 8.8-1Z"
              fill="var(--scene-glow)"
              stroke="var(--scene-gold)"
              strokeWidth="1.2"
            />
            <path
              d="M0-8v12L-8-2M0 4l5 5M0 4l8-6"
              stroke="var(--scene-paper)"
              strokeWidth=".8"
              opacity=".7"
            />
          </g>
        </defs>
        <g stroke="var(--scene-gold)" strokeWidth=".8" opacity=".65">
          <path d="M31-10v130m44-130v62m47-52v29M6 0q27 52 145 17" />
          <path d="M49 77v119" strokeDasharray="1 4" />
        </g>
        <g className="nook-room-star">
          <use
            href={`#${id}-star`}
            transform="translate(31 134) rotate(-12) scale(1.08)"
          />
        </g>
        <use
          href={`#${id}-star`}
          transform="translate(75 65) rotate(9) scale(.78)"
        />
        <use
          href={`#${id}-star`}
          transform="translate(122 32) rotate(-6) scale(.52)"
        />
        <g stroke="var(--scene-gold)" fill="none" strokeWidth="1.2">
          <path d="m49 194 2.8 6.3 7 .9-5.2 4.8 1.4 7-6-3.5-6 3.5 1.4-7-5.2-4.8 7-.9Z" />
          <circle cx="49" cy="179" r="2" fill="var(--scene-gold)" />
        </g>
      </svg>

      <svg
        className="nook-room-charms nook-room-charms--right"
        viewBox="0 0 160 250"
        fill="none"
        focusable="false"
      >
        <g stroke="var(--scene-gold)" strokeWidth=".8" opacity=".65">
          <path d="M124-8v104M78-8v37M37-8v160M9 3q93 45 157 3" />
          <circle cx="37" cy="141" r="2" fill="var(--scene-gold)" />
        </g>
        <use
          href={`#${id}-star`}
          transform="translate(124 108) rotate(12) scale(.85)"
        />
        <use
          href={`#${id}-star`}
          transform="translate(78 42) rotate(-9) scale(.62)"
        />
        <g className="nook-room-moon" transform="translate(37 177) rotate(-16)">
          <circle r="39" fill={`url(#${id}-glow)`} />
          <path
            d="M4-19C-7-9-6 10 10 14C-14 29-29-6 4-19Z"
            fill="var(--scene-glow)"
            stroke="var(--scene-gold)"
            strokeWidth="1"
          />
          <path
            d="M-13-7q-8 15 7 24"
            stroke="var(--scene-paper)"
            strokeWidth="1"
            opacity=".65"
          />
        </g>
      </svg>

      <svg
        className="nook-room-botanical"
        viewBox="0 0 230 320"
        fill="none"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${id}-leaf`} x2="1" y2="1">
            <stop stopColor="var(--scene-leaf-light)" />
            <stop offset="1" stopColor="var(--scene-leaf)" />
          </linearGradient>
          <g id={`${id}-leaf-shape`}>
            <path
              d="M0 0C-18-3-27-19-24-33C-7-28 3-18 0 0Z"
              fill={`url(#${id}-leaf)`}
              stroke="var(--scene-leaf)"
              strokeWidth=".8"
            />
            <path
              d="M-1-2-19-27m10 15-10-2m6-5 1-7"
              stroke="var(--scene-paper)"
              strokeWidth=".65"
              opacity=".25"
            />
          </g>
          <g id={`${id}-flower`}>
            {[0, 73, 145, 217, 290].map((angle) => (
              <path
                key={angle}
                transform={`rotate(${angle})`}
                d="M0 1C-13-2-13-17-6-19C1-22 7-7 0 1Z"
                fill="var(--scene-dried-flower)"
                stroke="var(--scene-rose)"
                strokeWidth=".7"
              />
            ))}
            <circle r="4" fill="var(--scene-gold)" />
            <path
              d="m-2-1 1 1m3-2v1m-1 3h1"
              stroke="var(--scene-paper)"
              strokeWidth="1"
            />
          </g>
        </defs>
        <g
          opacity=".55"
          stroke="var(--scene-leaf)"
          strokeWidth="1.7"
          strokeLinecap="round"
        >
          <path d="M-10 324C69 251 48 102 97 36M10 310C110 258 123 184 165 143M19 314C72 305 139 266 215 287M4 292C22 214 4 160 18 111" />
        </g>
        <g opacity=".76">
          {[
            [48, 256, -26],
            [58, 213, 52],
            [61, 182, -27],
            [70, 139, 51],
            [78, 101, -15],
            [89, 63, 38],
            [99, 243, 86],
            [117, 213, -3],
            [145, 173, 58],
            [59, 301, 28],
            [110, 282, 69],
            [153, 279, 125],
            [184, 282, 52],
            [17, 238, 12],
            [16, 188, 59],
            [16, 144, -15],
          ].map(([x, y, angle], index) => (
            <use
              key={index}
              href={`#${id}-leaf-shape`}
              transform={`translate(${x} ${y}) rotate(${angle}) scale(${index % 3 === 0 ? 0.78 : 1})`}
            />
          ))}
        </g>
        <g stroke="var(--scene-wood-light)" strokeWidth="1" opacity=".8">
          <path d="M56 259q-20-56-5-109m66 72q-4-32 15-54M19 296q41-15 56-40" />
        </g>
        <use
          href={`#${id}-flower`}
          transform="translate(51 158) rotate(-22) scale(.58)"
        />
        <use
          href={`#${id}-flower`}
          transform="translate(132 170) rotate(16) scale(.68)"
        />
        <use
          href={`#${id}-flower`}
          transform="translate(77 257) rotate(-10) scale(.9)"
        />
        <g fill="var(--scene-rose)" opacity=".75">
          <ellipse cx="94" cy="41" rx="4" ry="7" transform="rotate(30 94 41)" />
          <ellipse
            cx="101"
            cy="30"
            rx="3"
            ry="6"
            transform="rotate(28 101 30)"
          />
          <ellipse
            cx="163"
            cy="144"
            rx="4"
            ry="7"
            transform="rotate(45 163 144)"
          />
          <ellipse
            cx="171"
            cy="137"
            rx="3"
            ry="5"
            transform="rotate(45 171 137)"
          />
        </g>
      </svg>

      <NookReadingCorner isDark={isDark} />
      <svg
        className="nook-room-stardust"
        width="100%"
        height="100%"
        focusable="false"
      >
        <defs>
          <g
            id={`${id}-spark`}
            stroke="var(--scene-gold)"
            strokeWidth=".8"
            fill="var(--scene-glow)"
          >
            <path d="M0-6 1.4-1.4 5 0 1.4 1.4 0 6-1.4 1.4-5 0-1.4-1.4Z" />
          </g>
        </defs>
        <use href={`#${id}-spark`} x="39%" y="48%" opacity=".55" />
        <use href={`#${id}-spark`} x="71%" y="23%" opacity=".4" />
        <use href={`#${id}-spark`} x="74%" y="78%" opacity=".65" />
        <use href={`#${id}-spark`} x="36%" y="82%" opacity=".6" />
        <g fill="var(--scene-gold)" opacity=".5">
          <circle cx="40%" cy="45%" r="1.2" />
          <circle cx="73%" cy="80%" r="1.4" />
          <circle cx="34%" cy="80%" r="1" />
          <circle cx="90%" cy="35%" r="1.3" />
          <circle cx="9%" cy="70%" r="1.3" />
          <circle cx="85%" cy="14%" r="1" />
        </g>
      </svg>
    </div>
  );
}
