import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { NookThread } from "./NookThread";

interface NookMoogleHeadwearProps {
  eventId?: SeasonalEventId | null;
  paint: (name: string) => string;
}

const witchCrown =
  "M47 81C51 68 54 50 49 42C45 37 39 39 31 39C35 28 50 23 61 30C78 40 79 59 95 79C83 91 59 91 47 81Z";
const witchBackBrim =
  "M28 83C42 75 90 74 113 82C129 88 106 99 77 97C51 96 24 91 28 83Z";
const witchBrim =
  "M28 83C49 92 82 93 107 84C117 80 126 84 116 89C101 99 60 103 36 94C27 91 23 86 28 83Z";
const witchRibbon = "M49 69C61 76 78 74 87 69L95 80C85 89 62 91 47 81Z";
const witchMoon = "M80 72A6 6 0 1 0 87 80A5 5 0 0 1 80 72Z";
const topHat = "M45 81L47 56Q65 51 83 56L85 81Q65 87 45 81Z";
const topHatBand = "M46 74Q65 80 84 74L85 81Q65 87 45 81Z";
const bowShape =
  "M0 0C-19-3-17-17-10-14L0-6C10-21 20-12 14-4L5 1L10 13L4 11L0 3L-6 12L-10 10Z";

// Keep gaps between adjacent strands when the moogle shrinks in the hero.
// Overlapping subpaths merge into a flat fill within each thread layer.
const witchCrownStitches = Array.from({ length: 16 }, (_, index) => {
  const i = (index * 22) / 15;
  return `M${30 + i * 1.6} 26C${43 + i * 0.75} 38 ${37 + i * 1.95} 64 ${44 + i * 2.5} 88`;
}).join(" ");
const witchBrimStitches = Array.from({ length: 26 }, (_, index) => {
  const i = (index * 34) / 25;
  return `M${44 + i * 2.1} 78Q${33 + i * 2.7} 89 ${23 + i * 3} 101`;
}).join(" ");
const witchRibbonStitches = Array.from(
  { length: 21 },
  (_, i) => `M${45 + i * 2.5} 69q-1 8 1 20`,
).join(" ");
const topHatStitches = Array.from(
  { length: 18 },
  (_, i) => `M${45 + i * 2.4} 54q-.8 14 ${i < 9 ? "-1" : "1"} 31`,
).join(" ");
const topHatLidStitches = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * Math.PI * 2;
  return `M${65 + Math.cos(angle) * 5} ${56 + Math.sin(angle)}L${65 + Math.cos(angle) * 18} ${56 + Math.sin(angle) * 4}`;
}).join(" ");

function GoldCoin({ x, y, radius }: { x: number; y: number; radius: number }) {
  const ring = `M${-radius} 0a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0Z`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={radius} fill="#b9985d" stroke="none" />
      <NookThread
        d={`M${-radius + 1} -.9q${radius - 1} ${-radius + 0.3} ${radius * 2 - 2} 0M${-radius + 0.7} 1q${radius - 0.7} ${radius - 0.5} ${radius * 2 - 1.4} 0`}
        color="#e5c68a"
        shadow="#987749"
        highlight="#fae6b3"
        width={1.7}
        relief={1.6}
      />
      <NookThread
        d={ring}
        color="#d8b775"
        shadow="#9a7746"
        highlight="#f4deb0"
        width={1.15}
        relief={1.6}
        dasharray="1.1 .6"
      />
      <path d="M-.55-1.1H.7V1.1H-.55Z" fill="#ae884f" stroke="none" />
    </g>
  );
}

function Flower({
  x,
  y,
  summer = false,
}: {
  x: number;
  y: number;
  summer?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const petalWidth = summer ? 5.4 : 4.2;
  const petal = `M0-11a${petalWidth} 6 0 1 0 0 12a${petalWidth} 6 0 1 0 0-12Z`;
  const leaf = "M-2 5Q-15 7-14-4Q-4-6-2 5M3 4Q7-9 15-5Q15 5 3 4";
  const thread = summer ? "#df927a" : "#efc7c9";
  const shade = summer ? "#ae6b5f" : "#ba8b96";
  const light = summer ? "#f5c6a5" : "#fff0e5";

  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={`${id}-petal`}>
          <path d={petal} />
        </clipPath>
        <clipPath id={`${id}-leaves`}>
          <path d={leaf} />
        </clipPath>
      </defs>
      <path d={leaf} fill="#64755c" stroke="none" />
      <g clipPath={`url(#${id}-leaves)`}>
        <NookThread
          d="M-17-6-2 5M-17-3-3 7M-17 0-3 10M-12-6 1 5M-8-6 2 2M4-10 17 0M2-7 17 3M1-4 15 6M0-1 11 8"
          color="#879878"
          shadow="#5e7057"
          highlight="#b3bc8d"
          width={1.9}
          relief={1.6}
        />
      </g>
      <NookThread
        d="M-13-3-2 5M14-4 3 4"
        color="#a7b18a"
        shadow="#64755c"
        highlight="#c9cda3"
        width={1.25}
        relief={1.5}
      />
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d={petal} fill={shade} stroke="none" />
          <g clipPath={`url(#${id}-petal)`}>
            <NookThread
              d="M-5-11Q-5-6-1.6 1M-2.6-12Q-3.3-5-.8 2M0-12Q-.6-5 0 2M2.6-12Q2.4-5 .8 2M5-11Q4.7-6 1.6 1"
              color={thread}
              shadow={shade}
              highlight={light}
              width={1.85}
              relief={1.8}
            />
          </g>
          <NookThread
            d={petal}
            color={thread}
            shadow={shade}
            highlight={light}
            width={1.15}
            relief={1.6}
          />
        </g>
      ))}
      <circle r="3" fill="#c3a35e" stroke="none" />
      <NookThread
        d="M-2 0q-1-3 2-2q3-1 2 2q1 3-2 2q-3 1-2-2M-1 0q1-2 2 0q-1 2-2 0"
        color="#edcc79"
        shadow="#b39455"
        highlight="#ffecb6"
        width={1.45}
        relief={1.8}
      />
      {summer && (
        <NookThread
          d="M0 0Q5 2 8-3"
          color="#f6dba1"
          shadow="#c3946d"
          highlight="#fff0c7"
          width={1.55}
          relief={1.8}
          dasharray="2 .4"
        />
      )}
    </g>
  );
}

/** Each seasonal accessory uses stitches laid along its own fabric pieces. */
export function NookMoogleHeadwear({
  eventId,
  paint,
}: NookMoogleHeadwearProps) {
  const id = useId().replace(/:/g, "");
  const clip = (name: string) => `url(#${id}-headwear-${name})`;

  switch (eventId) {
    case "all-saints-wake":
      return (
        <g className="nook-moogle__hat">
          <defs>
            {[
              ["crown", witchCrown],
              ["back-brim", witchBackBrim],
              ["brim", witchBrim],
              ["ribbon", witchRibbon],
              ["moon", witchMoon],
            ].map(([name, d]) => (
              <clipPath key={name} id={`${id}-headwear-${name}`}>
                <path d={d} />
              </clipPath>
            ))}
          </defs>
          <path d={witchBackBrim} fill="#ab805d" stroke="#795b50" />
          <g clipPath={clip("back-brim")}>
            <NookThread
              d={witchBrimStitches}
              color="#ab805d"
              shadow="#795b50"
              highlight="#cba67d"
              width={1.8}
              relief={1.8}
            />
          </g>
          <path d={witchCrown} fill={paint("hat")} stroke="none" />
          <g clipPath={clip("crown")}>
            <NookThread
              d={witchCrownStitches}
              color="#806a83"
              shadow="#564356"
              highlight="#c2a4b9"
              width={1.7}
              relief={2}
            />
            <NookThread
              d="M33 37Q35 33 39 32M37 38Q40 33 44 31M42 38Q45 33 49 31M47 39Q50 35 53 34"
              color="#806a83"
              shadow="#564356"
              highlight="#c2a4b9"
              width={1.3}
              relief={1.6}
            />
          </g>
          <NookThread
            d="M47 81C51 68 54 50 49 42C45 37 39 39 31 39C35 28 50 23 61 30C78 40 79 59 95 79"
            color="#806880"
            shadow="#594354"
            highlight="#b59aaf"
            width={2.2}
            relief={1.8}
          />
          <path d={witchRibbon} fill="#93604e" stroke="none" />
          <g clipPath={clip("ribbon")}>
            <NookThread
              d={witchRibbonStitches}
              color="#b67a5b"
              shadow="#79564f"
              highlight="#d3a07c"
              width={2.05}
              relief={1.8}
            />
          </g>
          <NookThread
            d="M49 70C61 77 78 75 87 70M48 80Q70 92 94 80"
            color="#c29069"
            shadow="#79564f"
            highlight="#e2b58e"
            width={1.5}
            relief={1.8}
          />
          <path d={witchBrim} fill="#594759" stroke="none" />
          <g clipPath={clip("brim")}>
            <NookThread
              d={witchBrimStitches}
              color="#806880"
              shadow="#4f3c50"
              highlight="#b49ab0"
              width={1.85}
              relief={2}
            />
          </g>
          <NookThread
            d={witchBrim}
            color="#806880"
            shadow="#594354"
            highlight="#b9a0b2"
            width={2.1}
            relief={1.8}
          />
          <NookThread
            d="M28 86Q32 97 75 98Q104 96 117 87"
            color="#aa8fa5"
            shadow="#806880"
            highlight="#d0b3c1"
            width={1.45}
            relief={1.6}
            dasharray="1.2 2.7"
          />
          <path d={witchMoon} fill="#b69665" stroke="none" />
          <g clipPath={clip("moon")}>
            <NookThread
              d="M75 71q4 4 12 2M73 73q6 5 15 2M73 75q6 5 15 2M73 77q6 5 15 2M75 80q4 4 12 2"
              color="#ddbf8c"
              shadow="#98734d"
              highlight="#f6dfb2"
              width={1.6}
              relief={1.8}
            />
          </g>
          <NookThread
            d={witchMoon}
            color="#ddbf8c"
            shadow="#98734d"
            highlight="#f6dfb2"
            width={1.05}
            relief={1.6}
          />
          <NookThread
            d="M55 48v8M51 52h8M53.8 50.8l2.4 2.4m-2.4 0 2.4-2.4"
            color="#d4b27d"
            shadow="#947245"
            highlight="#f3dba7"
            width={1.35}
            relief={1.7}
          />
        </g>
      );
    case "little-ladies":
      return <Flower x={139} y={94} />;
    case "moonfire-faire":
      return <Flower x={139} y={94} summer />;
    case "make-it-rain":
      return (
        <g transform="rotate(-9 64 82)">
          <defs>
            <clipPath id={`${id}-headwear-top-hat`}>
              <path d={topHat} />
            </clipPath>
            <clipPath id={`${id}-headwear-top-band`}>
              <path d={topHatBand} />
            </clipPath>
            <clipPath id={`${id}-headwear-top-brim`}>
              <ellipse cx="65" cy="85" rx="27" ry="6" />
            </clipPath>
          </defs>
          <ellipse cx="65" cy="85" rx="27" ry="6" fill="#514650" />
          <g clipPath={clip("top-brim")}>
            <NookThread
              d={Array.from(
                { length: 24 },
                (_, i) => `M${38 + i * 2.4} 78l-1.5 15`,
              ).join(" ")}
              color="#776a77"
              shadow="#514650"
              highlight="#b09ba6"
              width={2}
              relief={1.8}
            />
          </g>
          <NookThread
            d="M38 85C38 77 92 77 92 85C92 93 38 93 38 85Z"
            color="#817080"
            shadow="#514650"
            highlight="#b09ba6"
            width={2}
            relief={1.8}
          />
          <path d={topHat} fill="#5c4d5c" stroke="none" />
          <g clipPath={clip("top-hat")}>
            <NookThread
              d={topHatStitches}
              color="#837083"
              shadow="#514650"
              highlight="#b39cae"
              width={2.05}
              relief={1.8}
            />
          </g>
          <NookThread
            d="M47 57 45 81Q65 87 85 81L83 57"
            color="#776a77"
            shadow="#514650"
            highlight="#b39cae"
            width={2}
            relief={1.8}
          />
          <path d={topHatBand} fill="#ab874d" stroke="none" />
          <g clipPath={clip("top-band")}>
            <NookThread
              d="M45 76q19 9 40 0M45 78.6q19 9 40 0M45 81.2q19 9 40 0"
              color="#d8b775"
              shadow="#a0834e"
              highlight="#f0d9a0"
              width={2.2}
              relief={1.8}
            />
          </g>
          <NookThread
            d="M46 74Q65 80 84 74M45 81Q65 87 85 81"
            color="#d8b775"
            shadow="#a0834e"
            highlight="#f0d9a0"
            width={1.4}
            relief={1.7}
            dasharray="1.4 .7"
          />
          <ellipse cx="65" cy="56" rx="18" ry="4" fill="#716071" />
          <NookThread
            d={topHatLidStitches}
            color="#93818c"
            shadow="#645264"
            highlight="#c6abba"
            width={1.85}
            relief={1.8}
          />
          <NookThread
            d="M47 56C47 50.7 83 50.7 83 56C83 61.3 47 61.3 47 56Z"
            color="#93818c"
            shadow="#645264"
            highlight="#c6abba"
            width={1.6}
            relief={1.8}
          />
          <GoldCoin x={73} y={77} radius={4} />
        </g>
      );
    case "heavensturn":
      return (
        <g transform="translate(139 95) rotate(15)">
          <defs>
            <clipPath id={`${id}-headwear-bow`}>
              <path d={bowShape} />
            </clipPath>
          </defs>
          <path d={bowShape} fill="#a16761" stroke="none" />
          <g clipPath={clip("bow")}>
            <NookThread
              d="M-16-14Q-10-6 1-3M-17-11Q-10-3 1-1M-17-8Q-10 0 1 1M-15-5Q-9 3 1 3M0-8Q7-7 9-17M1-5Q10-6 12-15M2-2Q13-3 15-12M3 1Q16 0 18-9"
              color="#cf8e80"
              shadow="#985e58"
              highlight="#f0be9c"
              width={2}
              relief={1.8}
            />
            <NookThread
              d="M-1 1-11 12M1 2-8 14M3 1l7 13M5 0l8 13"
              color="#c98579"
              shadow="#985e58"
              highlight="#efb399"
              width={2}
              relief={1.8}
            />
          </g>
          <NookThread
            d={bowShape}
            color="#c98579"
            shadow="#985e58"
            highlight="#efb399"
            width={1.6}
            relief={1.8}
          />
          <NookThread
            d="M1 4L2 17"
            color="#b59662"
            shadow="#8d714c"
            highlight="#e0bd83"
            width={1.55}
            relief={1.6}
            dasharray="1.5 .6"
          />
          <GoldCoin x={0} y={0} radius={3.5} />
          <GoldCoin x={2} y={18} radius={3.7} />
        </g>
      );
    default:
      return null;
  }
}
