import { useId } from "react";
import { NookNeighbourHouse } from "./NookNeighbourHouse";
import { NookNeighbourLandmarks } from "./NookNeighbourLandmarks";
import { NookThread } from "./NookThread";
import { NookLighthouseLight } from "./NookLighthouseLight";
import { threadVariation } from "./nookNeedlework";

interface NookShiroganeViewProps {
  isDark: boolean;
}

const seaOutline = "M205 277q26-5 50-2q20-1 42 2l19-5 23 5v79H203Z";
const beaconOutline =
  "M237 213H252C251 233 253 246 258 261Q245 265 231 262C236 249 238 230 237 213Z";
const beaconRoof = "M231 186q8-1 11-8h7q4 8 11 8l-2 4q-13 3-25 0Z";
const beaconBalcony = "M231 207q8 1 11-2h7q4 3 10 1l-2 6q-12 3-24 0Z";
const beaconBalconyStitches = Array.from({ length: 18 }, (_, i) => {
  const x = 230.5 + i * 1.65 + threadVariation(i, 104) * 0.15;
  return `M${x.toFixed(2)} 205q1.1 3.5 .4 9`;
}).join(" ");
// Long-and-short satin stitches interlock rather than forming masonry courses.
// Their direction bends out with the base, and the shaded threads mingle.
const beaconSatin = [0, 1, 2].map((tone) =>
  Array.from({ length: 12 }, (_, col) => {
    const x = 234.5 + col * 1.8;
    let y = 204 + threadVariation(col, 91) * 4;
    return Array.from({ length: 7 }, (_, row) => {
      const index = col * 7 + row;
      const start = y;
      y += 8.8 + threadVariation(index, 92) * 2.5;
      const shade = Math.max(
        0,
        Math.min(
          2,
          Math.floor((x - 237) / 7 + threadVariation(index, 93) * 0.65),
        ),
      );
      if (shade !== tone) return "";
      const bow = (at: number) =>
        (x - 245) * Math.max(0, at - 226) ** 2 * 0.00055;
      const sx = x + bow(start) + threadVariation(index, 94) * 0.18;
      const ex = x + bow(y) + threadVariation(index, 95) * 0.15;
      return `M${sx.toFixed(2)} ${start.toFixed(2)}Q${((sx + ex) / 2 + 0.18).toFixed(2)} ${((start + y) / 2).toFixed(2)} ${ex.toFixed(2)} ${(y - 0.5).toFixed(2)}`;
    }).join(" ");
  }).join(" "),
);
const beaconDomeStitches = [0, 1].map((tone) =>
  Array.from({ length: 21 }, (_, i) => {
    if (i % 2 !== tone) return "";
    const x = 231 + i * 1.4 + threadVariation(i, 97) * 0.22;
    return `M${(245 + (x - 245) * 0.23).toFixed(2)} ${(177 + threadVariation(i, 99) * 0.5).toFixed(2)}Q${(245 + (x - 245) * 0.55 + threadVariation(i, 98) * 0.3).toFixed(2)} 184 ${x.toFixed(2)} ${(190.5 + threadVariation(i, 100) * 0.3).toFixed(2)}`;
  }).join(" "),
);
const upperGarden = "M332 284 305 295 286 313 244 334 69 393V441H345V279Z";
const lowerGarden = "M280 360q24-28 59-33v112H153Z";
const laneOutline =
  "M339 285C305 292 289 311 253 328L70 396V438H156L280 358C309 340 320 317 342 306Z";
const cherryCanopy =
  "M206 280q-7-10 3-17q1-11 13-10q7-9 17-3q13-3 17 9q10 3 8 14q-2 13-15 15q-14 9-26 2q-13 3-17-10Z";
const distantCanopy =
  "M-27 5Q-38-9-20-19Q-9-31 5-24Q23-29 31-11Q42 0 26 15Q7 25-10 18Q-27 20-27 5Z";
const mossPatches =
  "M62 335q9-14 22-8l10 9-14 5-11 5ZM113 331q12-9 23-1l9 8-17-1-10 6ZM150 332q14-13 26-1l-10 5-9-1ZM192 330q12-13 24-5l-4 6-12 3Z";
const pineCanopies =
  "M306 243q-8-7 1-9q3-9 10-3q8-2 11 6q-6 8-22 6ZM325 231q-7-8 3-12q7-7 15 1l2 11ZM321 254q-9-6-3-11q7-6 13-1q10-2 15 7q-10 9-25 5Z";
const rockFaces =
  "M62 344 80 332 97 335 108 350 102 378 69 391ZM104 338 127 329 148 341 147 357 119 373 104 363ZM146 334 166 327 187 330 195 342 177 353 147 364ZM190 331 210 321 228 326 244 331 212 344 193 347Z";
const seaStitches = Array.from({ length: 28 }, (_, i) => {
  const y = 275 + i * 2.9;
  const start = 194 + (i % 2) * 10;
  return Array.from(
    { length: 7 },
    (_, j) => `M${start + j * 23} ${y.toFixed(1)}q9-1.3 20 0`,
  ).join(" ");
}).join(" ");
const rockStitches = Array.from({ length: 28 }, (_, i) => {
  const y = 319 + i * 2.9;
  return `M59 ${y.toFixed(1)}l47-15M105 ${y.toFixed(1)}l43-18M145 ${y.toFixed(1)}l48-13M190 ${y.toFixed(1)}l58-19`;
}).join(" ");
const laneStitches = Array.from({ length: 48 }, (_, i) => {
  const y = 289 + i * 3.15;
  return `M${61 + (i % 2) * 6} ${y.toFixed(1)}q136-14 288-7`;
}).join(" ");

// Short overlapping stitches change direction between the two planted banks.
function gardenStitches(
  x: number,
  y: number,
  columns: number,
  rows: number,
  rising: boolean,
) {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, col) => {
      const sx = x + col * 4.3 + (row % 2) * 2.1;
      const sy = y + row * 3.15 + Math.sin(col * 0.75 + row) * 0.6;
      return `M${sx.toFixed(1)} ${sy.toFixed(1)}q${rising ? "1.6-3.2 4.3-3.8" : "2.2 2.2 5.1 1"}`;
    }).join(" "),
  ).join(" ");
}

function canopyKnots(
  x: number,
  y: number,
  columns: number,
  rows: number,
  tone: number,
) {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, col) => {
      if ((row * 3 + col) % 3 !== tone) return "";
      const sx = x + col * 4.2 + (row % 2) * 2.1;
      const sy = y + row * 3.7 + Math.sin(col * 2.3 + row) * 0.5;
      return `M${sx.toFixed(1)} ${sy.toFixed(1)}c-2.2-2.8 2.6-4 2.6-.9c0 2.6-3.2 2.7-2.2.1`;
    }).join(" "),
  ).join(" ");
}

const upperGardenStitches = gardenStitches(66, 281, 66, 52, false);
const lowerGardenStitches = gardenStitches(150, 326, 46, 37, true);
const mossStitches = gardenStitches(59, 321, 38, 10, true);
const cherryKnots = [0, 1, 2].map((tone) =>
  canopyKnots(202, 250, 16, 13, tone),
);
const distantKnots = [0, 1, 2].map((tone) =>
  canopyKnots(-33, -28, 18, 15, tone),
);
const pineNeedles = Array.from({ length: 12 }, (_, row) =>
  Array.from({ length: 15 }, (_, col) => {
    const x = 299 + col * 3.25 + (row % 2) * 1.5;
    const y = 218 + row * 3.2;
    return `M${x} ${y}q1-2.3 3-5`;
  }).join(" "),
).join(" ");

// The lane beside the FC house, composed from the member-supplied in-game view.
export function NookShiroganeView({ isDark }: NookShiroganeViewProps) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-neighbourhood-${name})`;
  const stone =
    "color-mix(in srgb, var(--scene-plaster) 67%, var(--scene-rock))";
  const blossom =
    "color-mix(in srgb, var(--scene-paper) 69%, var(--scene-rose))";
  const gardenLight =
    "color-mix(in srgb, var(--scene-pine) 44%, var(--scene-leaf-light))";
  const gardenThread =
    "color-mix(in srgb, var(--scene-pine) 76%, var(--scene-leaf-light))";

  return (
    <g
      className="nook-shirogane-view"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <clipPath id={`${id}-neighbourhood-sea-clip`}>
          <path d={seaOutline} />
        </clipPath>
        <clipPath id={`${id}-neighbourhood-beacon-clip`}>
          <path d={beaconOutline} />
        </clipPath>
        <clipPath id={`${id}-neighbourhood-beacon-roof-clip`}>
          <path d={beaconRoof} />
        </clipPath>
        <clipPath id={`${id}-neighbourhood-beacon-balcony-clip`}>
          <path d={beaconBalcony} />
        </clipPath>
        <clipPath id={`${id}-neighbourhood-rock-clip`}>
          <path d={rockFaces} />
        </clipPath>
        {[
          ["upper-garden", upperGarden],
          ["lower-garden", lowerGarden],
          ["moss", mossPatches],
          ["cherry", cherryCanopy],
          ["distant-cherry", distantCanopy],
          ["pine", pineCanopies],
        ].map(([name, d]) => (
          <clipPath key={name} id={`${id}-neighbourhood-${name}-clip`}>
            <path d={d} />
          </clipPath>
        ))}
        <linearGradient
          id={`${id}-neighbourhood-sea`}
          x1="0"
          y1="276"
          x2="0"
          y2="348"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="color-mix(in srgb, var(--scene-sea) 62%, var(--scene-horizon))" />
          <stop offset="1" stopColor="var(--scene-sea)" />
        </linearGradient>
        <linearGradient
          id={`${id}-neighbourhood-stone`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop stopColor="var(--scene-rock-light)" />
          <stop offset=".45" stopColor={stone} />
          <stop offset="1" stopColor="var(--scene-rock)" />
        </linearGradient>
        <linearGradient
          id={`${id}-neighbourhood-lane`}
          x1="269"
          y1="289"
          x2="184"
          y2="440"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="color-mix(in srgb, var(--scene-plaster) 80%, var(--scene-rock-light))" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-plaster) 42%, var(--scene-rock))"
          />
        </linearGradient>
        <clipPath id={`${id}-neighbourhood-lane-clip`}>
          <path d={laneOutline} />
        </clipPath>
      </defs>

      {/* Only a quiet sliver of the bay is visible between the buildings. */}
      <path d={seaOutline} fill={paint("sea")} />
      <g clipPath={paint("sea-clip")}>
        <NookThread
          d={seaStitches}
          color="var(--scene-sea)"
          shadow="var(--scene-roof)"
          highlight="color-mix(in srgb, var(--scene-surf) 65%, var(--scene-sea))"
          width={2.2}
          relief={1.8}
        />
      </g>
      <path
        d="M226 274q22-2 42 1m12 0h25m12 1h20"
        fill="none"
        stroke="var(--scene-surf)"
        strokeWidth=".75"
        opacity=".35"
      />
      <g fill="none" stroke="var(--scene-surf)" strokeWidth=".6">
        <path className="nook-shirogane-wave" d="M237 285h12m7 0h20m13 1h18" />
        <path className="nook-shirogane-wave" d="M219 296h19m7 1h15m18 0h23" />
        <path className="nook-shirogane-wave" d="M232 310h13m14 0h20m8 0h9" />
      </g>
      <path
        d="M292 280 307 272 319 270 338 251 346 288Z"
        fill="var(--scene-distant)"
        opacity=".55"
      />

      {/* The familiar green-roofed beacon above the cherry trees. */}
      <path
        d="M220 288 224 270 233 256 253 252 263 266 268 292Z"
        fill="var(--scene-rock)"
      />
      <path
        d="M224 274 234 258 250 257 242 275 254 288 233 292Z"
        fill="var(--scene-rock-light)"
        opacity=".65"
      />
      <NookThread
        d="M233 260 230 273M237 258 234 274M241 257 238 275M245 257 242 272M246 260 251 272M251 257 256 272M255 261 262 276M228 278 233 288M231 277 237 290M235 277 241 290M240 278 246 289M245 277 252 289M251 277 258 290M257 277 264 290"
        color="var(--scene-rock-light)"
        shadow="var(--scene-rock)"
        highlight={stone}
        width={2.25}
        relief={1.8}
      />
      <path
        d="m228 277 6-4 8 2m-14 8 8-1 4 5m10-26 4 8"
        fill="none"
        stroke="var(--scene-ink)"
        strokeWidth=".7"
        opacity=".24"
      />
      <NookLighthouseLight isDark={isDark} />
      <g stroke="none">
        <path d={beaconOutline} fill={stone} />
        <g clipPath={paint("beacon-clip")}>
          {beaconSatin.map((d, tone) => (
            <NookThread
              key={tone}
              d={d}
              color={
                [
                  "color-mix(in srgb, var(--scene-plaster) 76%, var(--scene-paper))",
                  "color-mix(in srgb, var(--scene-plaster) 93%, var(--scene-paper))",
                  "color-mix(in srgb, var(--scene-plaster) 79%, var(--scene-rock))",
                ][tone]
              }
              shadow="var(--scene-rock)"
              highlight="var(--scene-paper)"
              width={1.52 + tone * 0.025}
              relief={0.65}
            />
          ))}
        </g>
        <NookThread
          d="M237 215q2 25-5 46M252 215q-1 25 6 46"
          color={stone}
          shadow="var(--scene-rock)"
          highlight="var(--scene-plaster)"
          width={0.7}
          relief={0.5}
          dasharray="3.4 .4 4.2 .3 2.8 .5"
        />
        <path
          d="M242 249v-9q2-3 4 0v9Z"
          fill="var(--scene-roof)"
          strokeWidth=".4"
        />
        <NookThread
          d="M243 241v7M245 241v7"
          color="var(--scene-roof)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-rock-light)"
          width={1.15}
          relief={0.8}
        />
        <NookThread
          d="M241.5 249v-9q2.5-4 5 0v9"
          color="var(--scene-rock-light)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-plaster)"
          width={1.1}
          relief={0.75}
        />
        <path d="M231 258q14 3 27 0l1 5q-15 4-29 0Z" fill={stone} />
        <NookThread
          d="M232 259l-1 3M235 260l-.7 3M238 261l-.4 3M241 261.5v3M244 261.5v3M247 261.5v3M250 261l.3 3M253 260l.5 3M256 259l1 3"
          color="var(--scene-plaster)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-paper)"
          width={1.8}
          relief={0.85}
        />
        <NookThread
          d="M231 258q14 3 27 0M230 263q14 4 29 0"
          color={stone}
          shadow="var(--scene-rock)"
          highlight="var(--scene-plaster)"
          width={1.3}
          relief={0.85}
        />
        {/* Fine satin columns taper around a small lens inside the dark glazing. */}
        <path d="M236 188H254V207H236Z" fill="var(--scene-roof)" />
        <path
          d="M238.5 190H251.5V205H238.5Z"
          fill={
            isDark
              ? "color-mix(in srgb, var(--scene-roof) 74%, #b6a17a)"
              : "var(--scene-rock-light)"
          }
        />
        <path
          d="M245 191.5C247.7 192.6 249.5 195.3 249.3 198.2C249.1 201.2 247.4 203.4 245 204C242.3 202.7 240.7 200.6 240.8 197.7C240.9 194.8 242.9 192.4 245 191.5Z"
          fill={
            isDark
              ? "#c8a76c"
              : "color-mix(in srgb, var(--scene-plaster) 64%, var(--scene-gold))"
          }
          stroke="none"
        />
        <NookThread
          d="M241.4 195.9q-.6 2.2 .5 4.2M242.3 194.3q-.9 3.8 .5 7.4M248 194.8q1.1 3.3-.6 6.7M249 197q.1 1.2-.4 2.4"
          color={
            isDark
              ? "#dfbe81"
              : "color-mix(in srgb, var(--scene-plaster) 73%, var(--scene-gold))"
          }
          shadow={isDark ? "#ad8b54" : "var(--scene-rock)"}
          highlight={isDark ? "#edcf98" : "var(--scene-plaster)"}
          width={1.05}
          relief={0.4}
        />
        <NookThread
          d="M243.5 193.1q-1.1 4.8 .1 9.3M244.7 192.3q-.6 5.6.1 10.8M246 192.8q.9 4.8-.3 10.1M247.1 193.7q1 4-.5 8.2"
          color={isDark ? "#f3e3bd" : "var(--scene-plaster)"}
          shadow={isDark ? "#d4b780" : "var(--scene-rock-light)"}
          highlight={isDark ? "#fff0cf" : "var(--scene-paper)"}
          width={1.15}
          relief={0.4}
        />
        <NookThread
          d="M239.8 191.3q-.3 2.1 0 4.1M250.1 199.9q.2 1.8-.2 3.5"
          color={isDark ? "#b4b39a" : "var(--scene-paper)"}
          shadow="var(--scene-roof)"
          highlight={isDark ? "#d2cfb4" : "var(--scene-paper)"}
          width={0.55}
          relief={0.3}
          opacity={isDark ? 0.42 : 0.35}
        />
        <NookThread
          d="M237 189q-.2 8 .2 17M239.1 190q.2 7-.1 15M251 190q-.1 8 .2 15M253 189q.2 7-.1 17M237 205q8 .4 16-.2"
          color="color-mix(in srgb, var(--scene-roof) 83%, var(--scene-gold))"
          shadow="var(--scene-roof)"
          highlight="color-mix(in srgb, var(--scene-gold) 38%, var(--scene-roof))"
          width={1}
          relief={0.6}
        />
        <path d={beaconBalcony} fill="var(--scene-roof)" />
        <g clipPath={paint("beacon-balcony-clip")}>
          <NookThread
            d={beaconBalconyStitches}
            color="color-mix(in srgb, var(--scene-roof) 82%, var(--scene-leaf-light))"
            shadow="var(--scene-roof)"
            highlight="color-mix(in srgb, var(--scene-roof) 55%, var(--scene-leaf-light))"
            width={1.2}
            relief={0.6}
          />
        </g>
        <path d={beaconRoof} fill="var(--scene-roof)" />
        <g clipPath={paint("beacon-roof-clip")}>
          {beaconDomeStitches.map((d, tone) => (
            <NookThread
              key={tone}
              d={d}
              color={`color-mix(in srgb, var(--scene-roof) ${tone ? 69 : 79}%, var(--scene-leaf-light))`}
              shadow="var(--scene-roof)"
              highlight="color-mix(in srgb, var(--scene-roof) 49%, var(--scene-leaf-light))"
              width={1.18}
              relief={0.6}
            />
          ))}
        </g>
        <NookThread
          d="M245 178v-10m-2 4h4"
          color="var(--scene-gold)"
          shadow="var(--scene-roof)"
          highlight="var(--scene-paper)"
          width={1.2}
          relief={0.75}
        />
        <path d="m242 178 3-3 3 3Z" fill="var(--scene-gold)" stroke="none" />
        <NookThread
          d="M232 186q13 4 27 0M233 190q12 3 25 0M232 208q13 5 26 0M234 212q12 3 22 0"
          color="color-mix(in srgb, var(--scene-roof) 77%, var(--scene-leaf-light))"
          shadow="var(--scene-roof)"
          highlight="var(--scene-leaf-light)"
          width={1.35}
          relief={0.7}
          dasharray="3.1 .3 2.4 .4 4 .3"
        />
        <NookThread
          d="M232 187q13 4 27 0M233 209q13 4 24 0"
          color="color-mix(in srgb, var(--scene-gold) 70%, var(--scene-roof))"
          shadow="var(--scene-roof)"
          highlight="color-mix(in srgb, var(--scene-gold) 70%, var(--scene-paper))"
          width={0.85}
          relief={0.55}
          dasharray=".7 1.5 1.1 1.9"
          opacity={0.7}
        />
      </g>

      {/* A paved lane descends diagonally past mossy garden banks. */}
      <path d={upperGarden} fill="var(--scene-pine)" />
      <g clipPath={paint("upper-garden-clip")}>
        <NookThread
          d={upperGardenStitches}
          color={gardenThread}
          shadow="var(--scene-pine)"
          highlight={gardenLight}
          width={2.25}
          relief={1.8}
        />
      </g>
      <path
        d={lowerGarden}
        fill="color-mix(in srgb, var(--scene-pine) 62%, var(--scene-leaf-light))"
      />
      <g clipPath={paint("lower-garden-clip")}>
        <NookThread
          d={lowerGardenStitches}
          color="color-mix(in srgb, var(--scene-pine) 58%, var(--scene-leaf-light))"
          shadow="var(--scene-pine)"
          highlight="color-mix(in srgb, var(--scene-leaf-light) 78%, var(--scene-pine))"
          width={2.25}
          relief={1.8}
        />
        <NookThread
          d="M321 350q-6 12-18 18m8-9q8-2 12 2m-17 3q-4-4-2-8m22-4q-2 12 8 23m-7-15q-5-1-7 5m10 1q7-3 7-8M301 372q12 3 14 18m-12-17q-8 3-4 11m10-5q9-5 12 1M280 389q15-4 25 7m-15-6q-2 7-7 9m17-5q4-6 11-3M325 391q-9 10-6 22m2-15q-7-2-10 3m8 6q8 0 12-5M264 403q6 7 17 6m-12-3q-5 7 0 10m7-7q3-6 9-4"
          color="var(--scene-pine)"
          shadow="var(--scene-timber)"
          highlight={gardenLight}
          width={2.5}
          relief={1.8}
          dasharray="3.5 1.3"
        />
      </g>
      <path
        d="M340 287C306 294 291 312 255 330L69 399V438H155L280 360C310 342 321 320 342 308Z"
        fill="var(--scene-rock)"
      />
      <path d={laneOutline} fill={paint("lane")} />
      <g clipPath={paint("lane-clip")}>
        <NookThread
          d={laneStitches}
          color="var(--scene-rock-light)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-plaster)"
          width={2.2}
          relief={1.8}
          dasharray="12 1.6"
        />
      </g>
      <g
        clipPath={paint("lane-clip")}
        fill="none"
        stroke="var(--scene-rock)"
        strokeWidth=".8"
        opacity=".6"
      >
        <path d="M52 420 266 341Q315 312 347 293M113 452 278 350Q313 328 345 300" />
        <path d="m282 305 31 11m-41-4 32 16m-44-9 32 21m-49-13 34 21m-54-14 34 24m-59-15 29 26m-59-16 26 33m-61-20 20 42m-64-23 24 47" />
      </g>
      <NookThread
        d="M338 284C304 292 289 310 252 327L72 394M339 307Q316 319 281 359L158 438"
        color="var(--scene-rock-light)"
        shadow="var(--scene-rock)"
        highlight="var(--scene-plaster)"
        width={2.75}
        relief={1.8}
        dasharray="2.7 1.1"
      />
      <path
        d="m280 360 7 3 7-5 9 1 8-9 15-5m-183 71 5 5m35-24 4 4m34-27 4 4"
        fill="none"
        stroke="var(--scene-leaf-light)"
        strokeWidth="1"
        opacity=".55"
      />

      {/* The house sits on a planted rock bank above the lower edge of the lane. */}
      <path
        d="M61 321Q92 313 124 328L181 326 209 319 249 328 247 334 68 399Z"
        fill="var(--scene-rock)"
      />
      <path
        d={rockFaces}
        fill="var(--scene-rock-light)"
        stroke="var(--scene-rock)"
        strokeWidth="1.1"
      />
      <g clipPath={paint("rock-clip")}>
        <NookThread
          d={rockStitches}
          color="var(--scene-rock-light)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-plaster)"
          width={2.2}
          relief={1.8}
        />
      </g>
      <path
        d="m80 335 7 13 15 5m-14-5-13 21m52-35-6 12 9 14m34-30 8 9-3 12m39-26 6 8 12-2"
        fill="none"
        stroke="var(--scene-rock)"
        strokeWidth=".9"
        opacity=".7"
      />
      <NookThread
        d={rockFaces}
        color="var(--scene-rock-light)"
        shadow="var(--scene-rock)"
        highlight={stone}
        width={2}
        relief={1.8}
        dasharray="2 1.3"
      />
      <path d={mossPatches} fill="var(--scene-pine)" />
      <g clipPath={paint("moss-clip")}>
        <NookThread
          d={mossStitches}
          color={gardenThread}
          shadow="var(--scene-pine)"
          highlight={gardenLight}
          width={2.3}
          relief={1.8}
        />
      </g>
      <path
        d="m75 333 8-1m-14 20 5-4m51-12 6-2m26 3 7-3m40-3 5-3m-101 49 5-4m-13 7-6 2"
        stroke="var(--scene-leaf-light)"
        strokeWidth="1.6"
        fill="none"
        opacity=".55"
      />
      <NookNeighbourHouse isDark={isDark} />

      {/* Pale blossom trees frame the small gap toward the water. */}
      <g stroke="var(--scene-timber)" strokeLinecap="round" fill="none">
        <path
          d="M231 315q7-15 4-33l-8-16m8 19 12-18m-13 20-14-12"
          strokeWidth="3"
        />
        <path d="M239 292q5-7 6-15m-12 19-10-8" strokeWidth="1.3" />
      </g>
      <NookThread
        d="M231 315q7-15 4-33l-8-16m8 19 12-18m-13 20-14-12"
        color="var(--scene-timber)"
        shadow="var(--scene-rock)"
        highlight="var(--scene-wood-light)"
        width={2.6}
        relief={1.8}
        dasharray="2.7 1.1"
      />
      <path
        d={cherryCanopy}
        fill="color-mix(in srgb, var(--scene-rose) 36%, var(--scene-rock-light))"
      />
      <g clipPath={paint("cherry-clip")}>
        {cherryKnots.map((d, tone) => (
          <NookThread
            key={tone}
            d={d}
            color={
              tone === 0
                ? "color-mix(in srgb, var(--scene-rose) 47%, var(--scene-paper))"
                : blossom
            }
            shadow="color-mix(in srgb, var(--scene-rose) 62%, var(--scene-timber))"
            highlight="var(--scene-paper)"
            width={2.1}
            relief={1.8}
          />
        ))}
      </g>
      <NookThread
        d={cherryCanopy}
        color={blossom}
        shadow="var(--scene-rose)"
        highlight="var(--scene-paper)"
        width={2}
        relief={1.8}
        dasharray="1.2 2.5"
      />
      <path
        d="M217 310q6-8 14-6l13 5-5 12-20 4-10-6Z"
        fill="var(--scene-rock-light)"
      />
      <NookThread
        d="M217 309 221 311M214 312 227 308M212 315 234 309M212 319 240 311M218 320 239 315M223 322 237 319"
        color="var(--scene-rock-light)"
        shadow="var(--scene-rock)"
        highlight={stone}
        width={2.2}
        relief={1.8}
      />
      <path
        d="m213 314 8 2 6-6m-6 6 3 7m10-15 4 7"
        stroke="var(--scene-rock)"
        strokeWidth=".8"
        fill="none"
      />
      <path d="M211 311q6-9 15-5l4 4-9 2-7 3Z" fill="var(--scene-pine)" />
      <g transform="translate(304 268) scale(.55)">
        <NookThread
          d="M0 44Q9 18 1-5m4 27 17-23m-19 25-16-15"
          color="var(--scene-timber)"
          highlight="var(--scene-wood-light)"
          width={3.8}
          relief={1.8}
        />
        <path d={distantCanopy} fill="var(--scene-rose)" />
        <g clipPath={paint("distant-cherry-clip")}>
          {distantKnots.map((d, tone) => (
            <NookThread
              key={tone}
              d={d}
              color={
                tone === 0
                  ? "color-mix(in srgb, var(--scene-rose) 47%, var(--scene-paper))"
                  : blossom
              }
              shadow="var(--scene-rose)"
              highlight="var(--scene-paper)"
              width={2.8}
              relief={1.8}
            />
          ))}
        </g>
        <NookThread
          d={distantCanopy}
          color={blossom}
          shadow="var(--scene-rose)"
          width={2.8}
          relief={1.8}
          dasharray="1.4 2.4"
        />
      </g>

      {/* A restrained willow curtain and pine boughs on the right garden edge. */}
      <NookThread
        d="M343 149q-14 22-9 69l5 79"
        color="var(--scene-timber)"
        highlight="var(--scene-wood-light)"
        width={3}
        relief={1.8}
      />
      <g fill="none" stroke="var(--scene-pine)" strokeWidth=".7">
        <path d="M338 167q-23 15-24 47m23-40q-13 15-11 58m15-33q-18 16-15 51m16-20q-10 17-7 39" />
        <path
          d="m324 185-7 8m10-12-6 12m0 0-6 10m7-5-5 12m13-19-5 11m5-5-5 11m5-2-4 12m7-4-6 10m8-2-5 11m1 3-5 11m11-8-6 13m6-2-4 10"
          strokeWidth="1.6"
          opacity=".75"
        />
      </g>
      <NookThread
        d="M338 167q-23 15-24 47m23-40q-13 15-11 58m15-33q-18 16-15 51m16-20q-10 17-7 39"
        color="var(--scene-pine)"
        highlight={gardenLight}
        width={2.2}
        relief={1.8}
      />
      <NookThread
        d="M331 175q-5 0-5 6q4 1 5-6M327 180q-6 0-5 6q4 1 5-6M323 185q-6 1-5 7q4 0 5-7M320 191q-6 1-5 7q4 1 5-7M318 198q-5 1-5 7q4 1 5-7M316 205q-4 2-3 7q4 0 3-7M333 184q-5 2-4 8q4-1 4-8M330 192q-5 2-4 8q4 0 4-8M328 200q-5 2-4 8q4 0 4-8M327 208q-5 2-4 8q4 0 4-8M326 216q-4 2-3 9q4-1 3-9M335 207q-5 2-4 8q4 0 4-8M331 215q-5 2-4 8q4 0 4-8M329 224q-5 2-4 8q4 0 4-8M328 233q-4 2-3 9q4-1 3-9M338 237q-5 2-4 8q4 0 4-8M336 245q-5 2-4 8q4 0 4-8M335 253q-4 2-3 9q4-1 3-9"
        color={gardenThread}
        shadow="var(--scene-pine)"
        highlight={gardenLight}
        width={2.15}
        relief={1.8}
      />
      <path
        d="M309 259q-2-14 10-22l17-8m-19 16 15 6m-16-1-10-2"
        fill="none"
        stroke="var(--scene-timber)"
        strokeWidth="1.6"
      />
      <path d={pineCanopies} fill="var(--scene-pine)" />
      <path
        d="m304 237 9-2m9 14 11-2m-3-22 9-2"
        fill="none"
        stroke="var(--scene-leaf-light)"
        strokeWidth=".8"
        opacity=".55"
      />
      <g clipPath={paint("pine-clip")}>
        <NookThread
          d={pineNeedles}
          color={gardenThread}
          shadow="var(--scene-pine)"
          highlight={gardenLight}
          width={2.2}
          relief={1.8}
        />
      </g>
      <NookThread
        d={pineCanopies}
        color={gardenThread}
        shadow="var(--scene-pine)"
        highlight={gardenLight}
        width={2.2}
        relief={1.8}
        dasharray="1.2 2.1"
      />
      <NookNeighbourLandmarks isDark={isDark} />

      <g fill="var(--scene-rose)" opacity=".75">
        <ellipse
          cx="242"
          cy="321"
          rx="1.8"
          ry=".7"
          transform="rotate(-24 242 321)"
        />
        <ellipse cx="228" cy="337" rx="1.5" ry=".65" />
        <ellipse cx="290" cy="316" rx="1.3" ry=".6" />
        <ellipse
          cx="297"
          cy="336"
          rx="1.8"
          ry=".7"
          transform="rotate(21 297 336)"
        />
      </g>
    </g>
  );
}
