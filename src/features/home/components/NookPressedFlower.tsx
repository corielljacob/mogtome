/** A little pressed stem tucked under the note's paperclip. */
export function NookPressedFlower() {
  return (
    <svg
      className="nook-pressed-flower"
      viewBox="0 0 48 102"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="var(--scene-leaf)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M24 96C19 70 28 46 18 14M23 82Q34 62 35 40M23 65Q10 57 9 40"
          strokeWidth="1.4"
        />
        <path
          d="M23 78C13 75 11 65 13 63Q23 66 23 78ZM25 71C28 58 37 56 39 57Q37 67 25 71ZM23 58C15 52 13 46 15 43Q23 47 23 58Z"
          fill="var(--scene-leaf)"
          strokeWidth=".7"
        />
        {[
          [17, 15, -14],
          [19, 23, 25],
          [15, 30, -30],
          [21, 36, 22],
          [34, 40, 20],
          [31, 48, -18],
          [36, 53, 30],
          [9, 40, -25],
          [12, 48, 10],
        ].map(([x, y, angle], i) => (
          <g
            key={i}
            transform={`translate(${x} ${y}) rotate(${angle})`}
            stroke="var(--scene-wood-dark)"
            strokeWidth=".6"
          >
            <path
              d="M0 5C-6 1-6-5-3-7Q0-9 2-5C7-6 6 2 0 5Z"
              fill="var(--scene-dried-flower)"
            />
            <path d="M0 2 0-4" stroke="var(--scene-paper)" opacity=".6" />
          </g>
        ))}
      </g>
      <path
        d="M17 83 28 80M18 86 29 83"
        stroke="var(--scene-rose)"
        strokeWidth="2"
      />
      <path
        d="M24 84Q36 76 34 84Q31 88 24 84Q18 77 16 81Q14 85 24 84L29 96M24 84 19 94"
        stroke="var(--scene-rose)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
