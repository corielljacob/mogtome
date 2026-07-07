import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";

interface NavBotanicalProps {
  className?: string;
  eventId?: SeasonalEventId | null;
}

const leaf = "var(--nav-leaf, #8c9878)";
const leafLight = "var(--nav-leaf-light, #b3bc98)";
const flower = "var(--nav-flower, #be8b90)";
const gold = "var(--nav-gold, #caa56c)";
const stem = "var(--nav-stem, #8c7964)";

function Leaf({
  x,
  y,
  angle = 0,
  light = false,
  autumn = false,
}: {
  x: number;
  y: number;
  angle?: number;
  light?: boolean;
  autumn?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path
        d={
          autumn
            ? "M0 0L-4-3L-8-3L-7-7L-12-10L-7-12L-8-17L-3-16L0-22L3-16L7-17L6-11L10-8L5-5L5-1Z"
            : "M0 0C-7-2-10-12-6-20C1-18 7-8 0 0Z"
        }
        fill={light ? leafLight : leaf}
        stroke={stem}
        strokeWidth=".6"
      />
      <path
        d={autumn ? "M0-1V-17M0-6L-5-10M0-8L4-12" : "M0-1Q-4-8-5-16"}
        fill="none"
        stroke={stem}
        strokeWidth=".55"
        opacity=".65"
      />
    </g>
  );
}

function PineTip({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${angle})`}
      fill="none"
      strokeLinecap="round"
    >
      <path d="M0 1Q1-12 0-27" stroke={stem} strokeWidth=".9" />
      <path
        d="M0-1L-8-12M0-6L-8-17M0-11L-7-21M0-16L-5-25M0-21L-2-29"
        stroke={leaf}
        strokeWidth="1.5"
      />
      <path
        d="M0-2L8-12M0-7L8-17M0-12L6-22M0-17L4-26"
        stroke={leafLight}
        strokeWidth="1.2"
      />
    </g>
  );
}

function Berries({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M-4 8L0 0M-3 5L5 3M-3 6L-7 1"
        fill="none"
        stroke={stem}
        strokeWidth=".65"
      />
      <g fill={flower} stroke={stem} strokeWidth=".4">
        <circle cy="-1" r="2.8" />
        <circle cx="6" cy="3" r="2.5" />
        <circle cx="-7" cy="1" r="2.2" />
      </g>
      <path
        d="M-1-2L0-2M5 2L6 2"
        stroke={gold}
        strokeWidth=".7"
        strokeLinecap="round"
        opacity=".75"
      />
    </g>
  );
}

export function NavBotanical({
  className = "",
  eventId = null,
}: NavBotanicalProps) {
  const winter = eventId === "starlight";
  const autumn = eventId === "all-saints-wake";

  return (
    <svg
      className={className}
      viewBox="0 0 140 94"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M10 84C31 73 46 59 62 47C83 31 101 25 121 13"
          stroke={stem}
          strokeWidth="1.25"
        />
        {winter ? (
          <>
            <PineTip x={28} y={73} angle={-37} />
            <PineTip x={40} y={64} angle={101} />
            <PineTip x={59} y={49} angle={-27} />
            <PineTip x={75} y={39} angle={99} />
            <PineTip x={94} y={28} angle={-24} />
            <PineTip x={111} y={20} angle={73} />
            <Berries x={60} y={46} />
            <Berries x={109} y={24} />
          </>
        ) : (
          <>
            <path
              d="M29 73Q22 64 23 54M41 63Q50 63 57 68M54 53Q45 43 44 34M70 41Q78 48 87 47M88 31Q81 23 82 17M105 23Q114 27 124 25"
              stroke={stem}
              strokeWidth=".85"
            />
            <Leaf x={23} y={56} angle={-24} autumn={autumn} />
            <Leaf x={54} y={67} angle={111} light autumn={autumn} />
            <Leaf x={45} y={36} angle={-14} light autumn={autumn} />
            <Leaf x={82} y={47} angle={91} autumn={autumn} />
            <Leaf x={82} y={22} angle={-27} autumn={autumn} />
            <Leaf x={117} y={26} angle={71} light autumn={autumn} />
            {autumn ? (
              <>
                <Berries x={62} y={54} />
                <Berries x={106} y={19} />
                <path
                  d="M109 64Q117 62 123 66Q119 72 112 69Z"
                  fill={gold}
                  stroke={stem}
                  strokeWidth=".6"
                />
                <path
                  d="M110 65L120 67"
                  stroke={stem}
                  strokeWidth=".55"
                  opacity=".65"
                />
              </>
            ) : (
              <>
                <path
                  d="M43 62Q32 54 34 44M66 45Q63 35 67 31M114 17L121 12"
                  stroke={stem}
                  strokeWidth=".7"
                />
                <g fill={flower} stroke={stem} strokeWidth=".5">
                  <path d="M34 45C27 42 29 35 33 37C36 32 42 38 37 42Z" />
                  <path d="M66 32C62 29 64 24 67 26C71 23 74 28 69 31Z" />
                  <path d="M119 13C113 10 116 5 119 7C123 3 128 9 123 12Z" />
                </g>
                <path
                  d="M33 39L34 41M67 27L67 29M119 9L120 10"
                  stroke={gold}
                  strokeWidth=".85"
                />
                <path
                  d="M31 46L34 43L38 43M64 33L67 31L70 32M118 15L121 12L125 13"
                  stroke={leaf}
                  strokeWidth="1"
                />
              </>
            )}
          </>
        )}
      </g>
    </svg>
  );
}
