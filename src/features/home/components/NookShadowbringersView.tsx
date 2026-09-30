import { useId } from "react";
import { NookCrystarium, ShadowbringersPatch } from "./NookCrystarium";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import { shadowbringersPigments } from "./nookShadowbringersPigments";

type Pigments = ReturnType<typeof shadowbringersPigments>;
const mountains =
  "M61 251 78 223Q82 215 87 223L97 239 112 224 128 241 142 226 154 241 175 233 192 246 211 227 230 243 247 223Q251 218 255 225L264 239 278 219 288 228 302 204Q306 200 309 208L321 225 337 213 349 240V337H61Z";
const distantBank =
  "M60 318Q92 291 119 283Q198 276 307 284Q330 297 344 314V356H60Z";
const lake = "M60 304Q126 293 182 302T345 300V439H60Z";
const leftBank =
  "M59 316Q77 315 88 326L103 337 110 348 95 364 85 390Q82 412 97 439H59Z";
const rightBank =
  "M346 313Q310 318 287 332L275 347 286 368 297 392 285 439H346Z";
const boughs = [
  {
    d: "M-11-29Q-15-36-7-37Q-8-45 0-42Q5-49 11-41Q21-44 23-35Q33-36 30-27Q38-25 32-17Q36-10 27-8L22-3Q17-4 13-8Q6-3 1-10Q-8-6-7-16Q-16-19-11-29Z",
    x: 10,
    y: -22,
    rx: 27,
    ry: 25,
    shade: true,
  },
  {
    d: "M10 3Q13-7 21-2Q28-8 32 1Q42-1 40 7Q48 14 38 18Q41 26 31 26Q28 34 21 29Q13 35 9 25Q0 26 3 18Q-2 11 7 9Z",
    x: 24,
    y: 14,
    rx: 22,
    ry: 21,
    shade: true,
  },
  {
    d: "M-26-16Q-34-21-37-13Q-45-15-42-6Q-50-2-44 4Q-47 12-38 13Q-36 23-29 18Q-22 23-17 15Q-7 17-10 8Q-3 3-11-2Q-9-10-17-10Q-19-19-26-16Z",
    x: -27,
    y: 2,
    rx: 23,
    ry: 23,
    shade: false,
  },
  {
    d: "M-27-25Q-34-30-25-33Q-27-42-19-38Q-13-47-7-39Q0-44 2-35Q10-34 6-27Q14-20 5-17Q9-9 0-9Q-4-2-11-7Q-19-3-22-12Q-32-12-27-20Z",
    x: -11,
    y: -24,
    rx: 23,
    ry: 24,
    shade: false,
  },
  {
    d: "M7-15Q8-25 17-20Q23-28 28-21Q38-24 35-15Q44-14 39-6Q46-1 37 4Q31 9 27 4Q22 13 16 6Q6 11 7 2Q-2 0 5-8Z",
    x: 24,
    y: -9,
    rx: 22,
    ry: 20,
    shade: false,
  },
  {
    d: "M-18 10Q-15 3-8 8Q-2 0 3 9Q12 5 12 15Q20 19 13 24Q15 33 7 32Q0 41-5 32Q-14 37-16 28Q-26 29-22 20Q-29 13-18 10Z",
    x: -4,
    y: 20,
    rx: 23,
    ry: 19,
    shade: false,
  },
];

/** Irregular sprays radiate from each bough, leaving its shaded folds quieter. */
const leafWork = boughs.map(({ x: cx, y: cy, rx, ry }, bough) => {
  const leaves: string[][] = [[], []];
  const veins: string[] = [];
  const n = (value: number) => value.toFixed(2);
  for (let i = 0; i < 88; i++) {
    const angle = i * 2.39996 + bough;
    const radius = Math.sqrt((i + 0.5) / 88);
    const x = cx + Math.cos(angle) * rx * radius;
    const y = cy + Math.sin(angle) * ry * radius;
    const direction =
      Math.atan2(y - cy - 13, x - cx) + threadVariation(i, 913 + bough) * 0.4;
    const length = 4.1 + threadVariation(i, 941) * 0.65;
    const dx = Math.cos(direction) * length;
    const dy = Math.sin(direction) * length;
    const sideX = -Math.sin(direction) * 1.55;
    const sideY = Math.cos(direction) * 1.55;
    leaves[i % 2].push(
      `M${n(x)} ${n(y)}Q${n(x + dx * 0.45 + sideX)} ${n(y + dy * 0.45 + sideY)} ${n(x + dx)} ${n(y + dy)}Q${n(x + dx * 0.45 - sideX)} ${n(y + dy * 0.45 - sideY)} ${n(x)} ${n(y)}Z`,
    );
    veins.push(
      `M${n(x)} ${n(y)}q${n(dx * 0.4 + sideX * 0.12)} ${n(dy * 0.4 + sideY * 0.12)} ${n(dx * 0.88)} ${n(dy * 0.88)}`,
    );
  }
  return {
    leaves: leaves.map((paths) => paths.join(" ")),
    veins: veins.join(" "),
  };
});

function LakelandTree({
  x,
  y,
  scale,
  p,
  flipped = false,
}: {
  x: number;
  y: number;
  scale: number;
  p: Pigments;
  flipped?: boolean;
}) {
  const id = `${useId().replace(/:/g, "")}-lakeland-cotton`;
  const thread = (d: string, color: string, width = 1.4, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow={p.leafDeep}
      highlight={p.leafLight}
      width={width}
      opacity={opacity}
      relief={1.5}
    />
  );
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flipped ? -scale : scale} ${scale})`}
    >
      <defs>
        {boughs.map((bough, i) => (
          <clipPath key={i} id={`${id}-${i}`}>
            <path d={bough.d} />
          </clipPath>
        ))}
        <radialGradient id={`${id}-wool`} cx=".36" cy=".28" r=".8">
          <stop stopColor={p.leafLight} />
          <stop offset=".57" stopColor={p.leaf} />
          <stop offset="1" stopColor={p.leafShade} />
        </radialGradient>
      </defs>
      <ShadowbringersPatch
        d="M-5 92Q1 60-4 29L-20 3-16 1-1 22 5-10 9-9 5 27Q5 60 8 92Z"
        color={p.branch}
        bounds={[-18, 0, 30, 94]}
        p={p}
        edge={1.2}
      />
      {thread(
        "M-3 90Q3 55-2 27L-18 4M2 56Q16 36 26 14M-2 37Q-15 21-28 9M-2 25 18-1M-1 12-11-17",
        p.branch,
        3.2,
      )}
      {thread("M-3 83Q2 54-3 29M3 52 22 19M-5 31-23 11", p.leafShade, 1.1)}
      {boughs.map((bough, i) => (
        <g key={i}>
          <path d={bough.d} fill={p.leafDeep} transform="translate(.8 1.8)" />
          <path
            d={bough.d}
            fill={bough.shade ? p.leafShade : `url(#${id}-wool)`}
          />
          <g clipPath={`url(#${id}-${i})`}>
            {leafWork[i].leaves.map((d, tone) => (
              <path
                key={tone}
                d={d}
                fill={tone ? p.leafLight : p.leaf}
                stroke={bough.shade ? p.leafDeep : p.leafShade}
                strokeWidth=".5"
                opacity={bough.shade ? 0.46 : 0.82}
              />
            ))}
            {thread(
              leafWork[i].veins,
              bough.shade ? p.leaf : p.leafLight,
              0.8,
              bough.shade ? 0.45 : 0.8,
            )}
          </g>
          {thread(bough.d, bough.shade ? p.leafShade : p.leaf, 1.15)}
        </g>
      ))}
      {/* Detached stitches soften the cut edges without filling the branch gaps. */}
      {thread(
        "M-33-26q-4-4-5-2m9-9-3-4M-14-45q-1-4-4-3M11-46l3-3M36-23q4-4 6-1M44-8l4-1M-47 7l-3 3M-29 22q-4 3-6 1M28 31l4 2M-8 37l-2 4",
        p.leaf,
        2.2,
      )}
      {thread(
        "M-26-29l-3-2M-13-40l-2-2M21-21l3-1M35-9l3 1M-33 4l-3 1M1 31l-2 2",
        p.leafLight,
        1.1,
      )}
    </g>
  );
}

/** Lakeland cotton foliage frames the warm glasshouses and cool Crystal Tower. */
export function NookShadowbringersView({ isDark }: { isDark: boolean }) {
  const p = shadowbringersPigments(isDark);
  const thread = (d: string, color: string, width = 1.4, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow={p.ink}
      highlight={p.paper}
      width={width}
      opacity={opacity}
      relief={1.4}
    />
  );
  return (
    <g
      className="nook-shadowbringers-view"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="translate(0 22)">
        <ShadowbringersPatch
          d={mountains}
          color={p.distant}
          bounds={[59, 200, 292, 140]}
          p={p}
          edge={1.1}
          slant={2}
        />
        <ShadowbringersPatch
          d="M278 221 288 230 302 207 299 242 309 263 297 297 285 324H258L274 271ZM78 225 87 227 97 240 93 262 107 289 96 330H71L79 270Z"
          color={p.distantLight}
          bounds={[69, 206, 246, 127]}
          p={p}
          edge={0.55}
          slant={-2}
        />
        {thread(
          "M76 250q15 7 28 4m159 12 21-4m12-34 8 13m7 16 12-4",
          p.distantLight,
          1.1,
          0.65,
        )}
      </g>
      <ShadowbringersPatch
        d={distantBank}
        color={p.bank}
        bounds={[59, 275, 289, 83]}
        grain="courses"
        p={p}
        edge={1}
      />
      <NookCrystarium isDark={isDark} />
      <ShadowbringersPatch
        d="M226 283H238Q234 293 241 302L229 321H215Q230 301 224 295Q221 289 226 283Z"
        color={p.terrace}
        bounds={[213, 282, 30, 41]}
        p={p}
        slant={2}
        edge={0.7}
      />
      <ShadowbringersPatch
        d={lake}
        color={p.water}
        bounds={[59, 291, 288, 148]}
        grain="water"
        p={p}
        edge={0}
      />
      {thread(
        "M109 330q28-4 51-1m44 8 37-2m-117 14 29-2m43 4 42-2M115 369l21-1m68 4 46-1M256 393l30-1M107 405h29m109 15 34-1",
        p.waterLight,
        1.55,
        0.8,
      )}
      {thread(
        "M157 346h21m-8 8 22 1m-36 6h18m5 10 14-1m-34 8 19 1",
        p.crystalLight,
        1.3,
        0.45,
      )}
      <ShadowbringersPatch
        d={leftBank}
        color={p.bank}
        bounds={[58, 313, 55, 126]}
        grain="courses"
        p={p}
        edge={1.2}
      />
      <ShadowbringersPatch
        d={rightBank}
        color={p.bank}
        bounds={[273, 311, 75, 128]}
        grain="courses"
        p={p}
        edge={1.2}
      />
      {thread(
        "M63 320q16-1 25 9l13 10M343 318q-33 5-51 17l-9 10",
        p.leafLight,
        2.1,
        0.8,
      )}
      <LakelandTree x={70} y={326} scale={0.7} p={p} />
      <LakelandTree x={325} y={288} scale={1.08} p={p} flipped />
      <LakelandTree x={106} y={365} scale={0.34} p={p} flipped />
      <ShadowbringersPatch
        d="M58 411Q76 400 92 409L105 427 99 439H58ZM310 439Q299 418 318 406L347 400V439Z"
        color={p.leafShade}
        bounds={[58, 399, 289, 40]}
        grain="courses"
        p={p}
        edge={1.3}
      />
      {thread(
        "M66 425q4-9 9-7m3 15q3-12 9-10M317 421q6-8 10-4m3 11 7-9",
        p.leafLight,
        2,
        0.8,
      )}
    </g>
  );
}
