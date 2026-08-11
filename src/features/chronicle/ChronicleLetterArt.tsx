/** Correspondence painted in the same paper, brass, and rose inks as Home. */
export function ChronicleLetterArt() {
  return (
    <svg viewBox="0 0 310 200" fill="none" aria-hidden="true" focusable="false">
      <ellipse
        cx="157"
        cy="179"
        rx="115"
        ry="10"
        fill="var(--scene-shadow)"
        opacity=".1"
      />
      <g transform="rotate(-8 148 104)">
        <path
          d="M53 29 230 27l4 149-179 3Z"
          fill="var(--scene-shadow)"
          opacity=".13"
          transform="translate(3 4)"
        />
        <path
          d="M53 29 230 27l4 149-179 3Z"
          fill="var(--nook-paper)"
          stroke="var(--scene-wood-light)"
          strokeWidth=".8"
        />
        <path
          d="m69 55 143-2M70 73l141-2M70 91l121-1M71 109l140-1M71 127l140-1M71 145l90-1"
          stroke="var(--nook-ink)"
          opacity=".15"
          strokeWidth=".7"
        />
        <path d="M71 38v126" stroke="var(--scene-rose)" opacity=".25" />
        <text
          x="91"
          y="69"
          fontFamily="var(--font-script)"
          fontSize="25"
          fill="var(--nook-ink)"
        >
          Kupo Life
        </text>
      </g>
      <g
        transform="rotate(8 165 135)"
        stroke="var(--nook-ink)"
        strokeWidth=".8"
        strokeLinejoin="round"
      >
        <path
          d="M67 92h189v89H67Z"
          fill="var(--scene-shadow)"
          opacity=".13"
          transform="translate(3 4)"
          stroke="none"
        />
        <path d="M67 92h189v89H67Z" fill="var(--scene-paper)" />
        <path
          d="m67 181 80-60q14-10 28 0l81 60"
          fill="var(--nook-paper)"
          strokeOpacity=".3"
        />
        <path
          d="m67 92 81 60q14 10 28 0l80-60"
          fill="var(--nook-paper)"
          strokeOpacity=".35"
        />
        <path
          d="m149 136 6-4 8 2 7-1 5 6 1 7-4 5-1 7-8 2-7-2-6-1-4-6 1-7Z"
          fill="var(--season-seal)"
          stroke="var(--season-seal-shadow)"
        />
        <circle cx="161" cy="146" r="9" stroke="var(--season-seal-light)" />
        <path
          d="M161 151c-10-6-6-13 0-7 6-6 10 1 0 7Z"
          fill="var(--season-seal-light)"
          stroke="none"
        />
      </g>
      <g stroke="var(--scene-leaf)" strokeWidth="1.2" strokeLinecap="round">
        <path d="M43 157q-20-40-8-81m1 58L19 111m15 2 19-21" />
        <path
          d="M35 135q-19-4-16-16 14 1 16 16Zm-2-25q-12-10-8-20 10 6 8 20Zm4-15q-8-12-1-22 7 9 1 22Zm1 26q2-19 14-21 0 15-14 21Z"
          fill="var(--scene-leaf-light)"
          strokeWidth=".6"
        />
        <path
          d="M31 146q13-9 13-1-2 7-13 1-12-7-12-1 1 7 12 1Zm0 0-5 16m5-16 14 12"
          stroke="var(--scene-rose)"
        />
      </g>
      <path
        d="m261 52 2 5 5 2-5 2-2 5-2-5-5-2 5-2M42 38l2 4 4 2-4 2-2 4-2-4-4-2 4-2"
        stroke="var(--scene-gold)"
      />
    </svg>
  );
}
