import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import "./nook-heavensward-dragon.css";

// The shoulders stay anchored while the long wing fingers describe each stroke.
// Broad, curved webs preserve the silhouette at the window's small scale.
const wingPoses = [
  {
    far: "M3 3Q14-11 18-30L34-45Q31-25 38-14 28-18 25-6 20-10 16 5Z",
    near: "M1 5Q-13-9-9-28L-18-51Q-27-40-50-27-38-26-32-13-26-22-20-8-14-15-7 4L-1 11Z",
    ribs: "M0 6Q-12-12-18-49M-18-48Q-29-32-48-27M-18-48Q-24-27-32-13M-18-48Q-17-23-20-8M-18-48Q-9-18-7 4",
    edge: "M0 5Q-13-11-9-28L-18-50Q-28-39-49-27",
    wrist: [-18, -48],
    hem: [
      [-50, -27],
      [-32, -13],
      [-20, -8],
      [-7, 4],
    ],
    scoops: [
      [-38, -26],
      [-26, -22],
      [-14, -15],
    ],
  },
  {
    far: "M3 3Q16-8 28-22L43-25Q34-15 36-6 29-11 24 1 18-4 13 8Z",
    near: "M1 5Q-12-7-24-22L-37-29-62-16Q-46-16-38-3-33-12-24 2-19-5-9 8L-1 12Z",
    ribs: "M0 6Q-18-12-37-28M-37-28-60-16M-37-28Q-40-15-38-3M-37-28Q-28-10-24 2M-37-28Q-17-9-9 8",
    edge: "M0 5Q-15-10-37-28L-61-16",
    wrist: [-37, -28],
    hem: [
      [-62, -16],
      [-38, -3],
      [-24, 2],
      [-9, 8],
    ],
    scoops: [
      [-46, -16],
      [-33, -12],
      [-19, -5],
    ],
  },
  {
    far: "M3 3Q20 2 34 11L41 23Q30 16 24 19 23 10 14 13L6 11Z",
    near: "M1 4Q-15 8-27 24L-48 39Q-40 20-42 10-34 15-26 1-19 8-10-1Z",
    ribs: "M0 5Q-19 13-47 38M-47 38Q-40 22-42 10M-47 38Q-34 16-26 1M-47 38Q-23 12-10-1",
    edge: "M0 5Q-16 10-27 24L-47 38",
    wrist: [-47, 38],
    hem: [
      [-42, 10],
      [-26, 1],
      [-10, -1],
      [1, 4],
    ],
    scoops: [
      [-34, 15],
      [-19, 8],
      [-4, 3],
    ],
  },
  {
    far: "M3 3Q18-12 23-29L39-39Q33-22 38-12 28-16 24-3 19-7 14 8Z",
    near: "M1 6Q-7-8-7-22L-25-48Q-35-35-68-22-47-24-40-5-32-18-24 3-17-7-7 10Z",
    ribs: "M0 6Q-13-14-25-47M-25-47Q-38-31-66-22M-25-47Q-35-24-40-5M-25-47Q-22-20-24 3M-25-47Q-10-14-7 10",
    edge: "M0 5Q-7-8-7-22L-25-47Q-36-35-67-22",
    wrist: [-25, -47],
    hem: [
      [-68, -22],
      [-40, -5],
      [-24, 3],
      [-7, 10],
    ],
    scoops: [
      [-47, -24],
      [-32, -18],
      [-17, -7],
    ],
  },
];

const body =
  "M-18 1C-9-5 1-5 9-8C16-11 17-19 24-23Q30-29 35-24L38-19Q44-18 48-15Q51-13 48-10L37-9Q32-7 30-9C24-9 26 1 17 8C6 16-6 15-17 9Z";
const tail =
  "M-12 0C-29-4-34 12-49 15Q-61 17-71 9Q-62 24-46 21C-30 19-23 8-12 11Z";
const n = (v: number) => v.toFixed(2);
const along = (from: number[], to: number[], t: number) => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
];

// Like the flower petals, every membrane is sewn between its own curved edges.
// Arcs nest within each finger panel rather than stamping one grain over the wing.
function sewWing(
  {
    wrist,
    hem,
    scoops,
  }: { wrist: number[]; hem: number[][]; scoops: number[][] },
  pose: number,
) {
  const bundles = ["", "", ""];
  scoops.forEach((scoop, panel) => {
    const reach = Math.max(
      ...[hem[panel], hem[panel + 1]].map((point) =>
        Math.hypot(point[0] - wrist[0], point[1] - wrist[1]),
      ),
    );
    const count = Math.ceil(reach / 2.15);
    for (let row = 2; row < count; row++) {
      const t = (row + threadVariation(row, panel + pose * 7) * 0.13) / count;
      const a = along(wrist, hem[panel], t);
      const b = along(wrist, hem[panel + 1], t);
      const c = along(wrist, scoop, t);
      bundles[(row + panel) % 3] +=
        `M${n(a[0])} ${n(a[1])}Q${n(c[0])} ${n(c[1])} ${n(b[0])} ${n(b[1])} `;
    }
  });
  return bundles;
}
const wingSatin = wingPoses.map(sewWing);
const farWingSatin = [
  {
    wrist: [34, -45],
    hem: [
      [38, -14],
      [25, -6],
      [16, 5],
      [3, 3],
    ],
    scoops: [
      [28, -18],
      [20, -10],
      [9, -4],
    ],
  },
  {
    wrist: [43, -25],
    hem: [
      [36, -6],
      [24, 1],
      [13, 8],
      [3, 3],
    ],
    scoops: [
      [29, -11],
      [18, -4],
      [8, 6],
    ],
  },
  {
    wrist: [41, 23],
    hem: [
      [24, 19],
      [14, 13],
      [6, 11],
      [3, 3],
    ],
    scoops: [
      [23, 10],
      [9, 12],
      [9, 6],
    ],
  },
  {
    wrist: [39, -39],
    hem: [
      [38, -12],
      [24, -3],
      [14, 8],
      [3, 3],
    ],
    scoops: [
      [28, -16],
      [19, -7],
      [7, 5],
    ],
  },
].map(sewWing);
const bodySatin = Array.from({ length: 21 }, (_, i) => {
  const x = -21 + i * 1.8;
  return `M${n(x)} -6Q${n(x - 2)} 4 ${n(x + 4)} 16`;
}).join(" ");
const neckSatin = Array.from({ length: 17 }, (_, i) => {
  const y = -28 + i * 1.85;
  return `M15 ${n(y)}Q23 ${n(y + 4)} 32 ${n(y + 5)}`;
}).join(" ");
const faceSatin = Array.from(
  { length: 10 },
  (_, i) => `M${31 + i * 1.8} -26q-2 10 3 18`,
).join(" ");

/** Padded binding uses the same interrupted wraps as the moogle's sewn edge. */
function DragonBinding({
  d,
  width = 1.7,
  far = false,
}: {
  d: string;
  width?: number;
  far?: boolean;
}) {
  return (
    <g fill="none">
      <path
        d={d}
        stroke="var(--hw-dragon-shadow)"
        strokeWidth={width + 0.8}
        opacity=".5"
        transform="translate(.25 .35)"
      />
      <path
        d={d}
        stroke={far ? "var(--hw-dragon-far)" : "var(--hw-dragon-edge)"}
        strokeWidth={width}
      />
      <path
        d={d}
        stroke="var(--hw-dragon-rib)"
        strokeWidth={width}
        strokeDasharray=".65 2.4 .8 2.8"
        opacity=".6"
      />
      <path
        d={d}
        stroke="var(--hw-dragon-shine)"
        strokeWidth={width * 0.3}
        strokeDasharray="1.2 2.1 .9 2.8"
        opacity={far ? 0.2 : 0.65}
        transform="translate(-.2 -.25)"
      />
    </g>
  );
}

/** A distant dragon in profile: webbed wings, a swept neck, and a trailing tail. */
export function NookHeavenswardDragon() {
  const id = `${useId().replace(/:/g, "")}-wyvern`;
  const thread = (d: string, width = 0.8, color = "var(--hw-dragon-rib)") => (
    <NookThread
      d={d}
      color={color}
      shadow="var(--hw-dragon-shadow)"
      highlight="var(--hw-dragon-shine)"
      width={width}
      relief={1.15}
    />
  );
  const wingLayer = (side: "far" | "near") => (
    <g data-dragon-part={`${side}-wing`}>
      <g className="nook-hw-wyvern__flapping">
        {wingPoses.map((_, index) => (
          <use
            key={index}
            href={`#${id}-${side}-${index}`}
            className={`nook-hw-wyvern__pose nook-hw-wyvern__pose--${index}`}
          />
        ))}
      </g>
      <use href={`#${id}-${side}-3`} className="nook-hw-wyvern__gliding" />
    </g>
  );
  return (
    <g
      className="nook-hw-wyvern"
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-wing-cloth`} x1=".15" y1="0" x2=".8" y2="1">
          <stop stopColor="var(--hw-dragon-edge)" />
          <stop offset=".35" stopColor="var(--hw-dragon-wing)" />
          <stop offset=".72" stopColor="var(--hw-dragon-wing)" />
          <stop offset="1" stopColor="var(--hw-dragon-body)" />
        </linearGradient>
        <linearGradient id={`${id}-body-cloth`} x1=".3" y1="0" x2=".65" y2="1">
          <stop stopColor="var(--hw-dragon-edge)" />
          <stop offset=".42" stopColor="var(--hw-dragon-body)" />
          <stop offset="1" stopColor="var(--hw-dragon-far)" />
        </linearGradient>
        <clipPath id={`${id}-body-clip`}>
          <path d={body} />
        </clipPath>
        <clipPath id={`${id}-tail-clip`}>
          <path d={tail} />
        </clipPath>
        {wingPoses.map((pose, index) => (
          <clipPath id={`${id}-wing-clip-${index}`} key={`clip-${index}`}>
            <path d={pose.near} />
          </clipPath>
        ))}
        {wingPoses.map((pose, index) => (
          <clipPath id={`${id}-far-clip-${index}`} key={`far-clip-${index}`}>
            <path d={pose.far} />
          </clipPath>
        ))}
        {wingPoses.map((pose, index) => (
          <g id={`${id}-far-${index}`} key={`far-${index}`}>
            <path d={pose.far} fill="var(--hw-dragon-far)" />
            <g clipPath={`url(#${id}-far-clip-${index})`}>
              <NookThread
                d={farWingSatin[index].join(" ")}
                color="var(--hw-dragon-far)"
                shadow="var(--hw-dragon-shadow)"
                highlight="var(--hw-dragon-edge)"
                width={1.45}
                relief={1.1}
                opacity={0.85}
              />
            </g>
            <DragonBinding d={pose.far} width={1.25} far />
          </g>
        ))}
        {wingPoses.map((pose, index) => (
          <g id={`${id}-near-${index}`} key={`near-${index}`}>
            <path d={pose.near} fill={`url(#${id}-wing-cloth)`} />
            <g clipPath={`url(#${id}-wing-clip-${index})`}>
              {wingSatin[index].map((d, tone) => (
                <NookThread
                  key={tone}
                  d={d}
                  color={
                    tone === 1
                      ? "var(--hw-dragon-edge)"
                      : "var(--hw-dragon-wing)"
                  }
                  shadow="var(--hw-dragon-body)"
                  highlight="var(--hw-dragon-shine)"
                  width={1.55}
                  relief={1.15}
                  opacity={0.95}
                />
              ))}
            </g>
            <DragonBinding d={pose.near} width={1.3} />
            {thread(pose.ribs, 1.4, "var(--hw-dragon-body)")}
            <DragonBinding d={pose.edge} width={2.2} />
          </g>
        ))}
      </defs>
      <g className="nook-hw-wyvern__body-bob">
        {/* Paint through the body in depth order. Each wing's held pose uses
            the same clock, but the torso now occludes only the far shoulder. */}
        {wingLayer("far")}
        <path
          data-dragon-part="far-legs"
          d="M-6 6q-4 5 0 10l9-1 3 3 1-5-8-2 3-6M14 3l5 7 8-1 3 3v-5l-8-1-2-5"
          fill="var(--hw-dragon-far)"
          stroke="var(--hw-dragon-shadow)"
          strokeWidth=".9"
        />
        <g className="nook-hw-wyvern__tail">
          <path d={tail} fill={`url(#${id}-body-cloth)`} />
          <g clipPath={`url(#${id}-tail-clip)`}>
            {thread(
              "M-14 1C-30-2-37 23-65 13M-14 3C-30 0-38 26-65 15M-14 5C-30 2-37 28-65 17M-14 7C-30 4-37 30-65 19",
              1.6,
              "var(--hw-dragon-body)",
            )}
          </g>
          <DragonBinding d={tail} width={1.15} />
        </g>
        <g data-dragon-part="body">
          {/* The small horns are folded cloth, tucked behind the padded head. */}
          <path
            d="M26-23Q22-28 20-34Q27-30 30-23M32-24Q33-29 30-32Q37-30 37-21M16-15l-4-8 9 6M6-6 0-13 1-3M-8-1-14-8-12 3"
            fill="var(--hw-dragon-edge)"
          />
          {thread("M23-29l4 5M33-28l2 5", 1.2, "var(--hw-dragon-shine)")}
          <path d={body} fill={`url(#${id}-body-cloth)`} />
          <g clipPath={`url(#${id}-body-clip)`}>
            {thread(bodySatin, 1.5, "var(--hw-dragon-body)")}
            {thread(neckSatin, 1.55, "var(--hw-dragon-body)")}
            {thread(faceSatin, 1.45, "var(--hw-dragon-body)")}
          </g>
          <DragonBinding d={body} width={1.6} />
          {thread(
            "M-12 9Q3 15 16 5Q22 1 24-8Q27-15 32-14",
            2.5,
            "var(--hw-dragon-rib)",
          )}
          {thread(
            "M-5 12l.3-2.5M1 12l-.1-2.5M7 10l-1-2M13 7l-1.5-2M19 2l-2-1M23-4l-2-1M26-10l-2-1",
            0.9,
            "var(--hw-dragon-body)",
          )}
          <path
            d="M39-12q4 1 8-.7"
            stroke="var(--hw-dragon-shadow)"
            strokeWidth=".9"
          />
          <circle cx="35" cy="-19" r="1" fill="var(--hw-dragon-shadow)" />
          <circle cx="34.8" cy="-19.3" r=".55" fill="var(--hw-dragon-eye)" />
        </g>
        {/* The nearest legs emerge below the belly. The downstroke can pass
            in front of their upper joints instead of showing through them. */}
        <g data-dragon-part="near-legs">
          <path
            d="M-12 7q-5 6-1 11l10-1 3 4 1-6-8-2 4-6M11 7l4 8 9-1 3 3 1-6-9-1-2-6"
            fill="var(--hw-dragon-body)"
            stroke="var(--hw-dragon-edge)"
            strokeWidth="1.5"
          />
          {thread("M-13 11l2 5 7-1M14 10l3 3 7-1", 1.4)}
        </g>
        {wingLayer("near")}
        {/* Only the shoulder cap is above the near wing; tracing the entire
            body again here would erase the wing's overlap in every pose. */}
        <path
          data-dragon-part="shoulder"
          d="M-2 1Q3-1 6 3L4 8 0 10-3 6Z"
          fill="var(--hw-dragon-body)"
        />
        {thread("M-2 2Q3-1 5 3M4 8 1 9", 0.9, "var(--hw-dragon-edge)")}
      </g>
    </g>
  );
}
