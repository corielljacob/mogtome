import { useId } from "react";
import { LunarCloth, NookLunarShelter } from "./NookLunarShelter";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import { endwalkerPigments } from "./nookEndwalkerPigments";

const farRidge =
  "M60 233C86 211 104 201 132 205C161 209 176 202 198 198C229 192 250 213 277 206C308 198 330 207 347 215V440H60Z";
const middleRidge =
  "M60 244C85 235 108 214 134 214C167 212 190 229 216 224C246 219 263 226 288 219C312 215 330 224 347 222V440H60Z";
const middleFold =
  "M60 257C94 245 112 246 133 251C157 259 184 246 213 249C242 253 274 243 300 242C320 240 337 245 348 248V440H60Z";
const foreground =
  "M60 296C90 265 115 271 144 278C177 287 204 265 235 270C273 276 301 249 347 259V440H60Z";
const nearFold =
  "M60 367C98 343 116 352 145 363C171 373 202 349 232 352C271 357 305 338 347 351V440H60Z";
const n = (value: number) => value.toFixed(2);

function ellipsePoint(
  rx: number,
  ry: number,
  angle: number,
  seed: number,
  cy = 0,
) {
  const wobble =
    1 + Math.sin(angle * 3 + seed) * 0.021 + Math.cos(angle * 5 - seed) * 0.009;
  return [Math.cos(angle) * rx * wobble, cy + Math.sin(angle) * ry * wobble];
}

/** Rounded irregular contours avoid the mechanically perfect vector ellipse. */
function sewnEllipse(rx: number, ry: number, seed: number, cy = 0) {
  const points = Array.from({ length: 20 }, (_, i) =>
    ellipsePoint(rx, ry, (i * Math.PI) / 10, seed, cy),
  );
  let d = `M${n(points[0][0])} ${n(points[0][1])}`;
  for (let i = 0; i < points.length; i++) {
    const prev = points[(i + 19) % 20],
      a = points[i],
      b = points[(i + 1) % 20],
      next = points[(i + 2) % 20];
    d += `C${n(a[0] + (b[0] - prev[0]) / 6)} ${n(a[1] + (b[1] - prev[1]) / 6)} ${n(b[0] - (next[0] - a[0]) / 6)} ${n(b[1] - (next[1] - a[1]) / 6)} ${n(b[0])} ${n(b[1])}`;
  }
  return d + "Z";
}

function craterNeedlework(rx: number, ry: number, seed: number) {
  const innerX = rx * 0.75,
    innerY = ry * 0.57,
    centerY = -ry * 0.11;
  const rays: string[][] = [[], [], []];
  const count = Math.ceil((Math.PI * 2 * rx) / 1.55);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const inner = ellipsePoint(innerX, innerY, angle, seed + 0.7, centerY);
    const outer = ellipsePoint(
      rx,
      ry,
      angle + threadVariation(i, seed + 1103) * 0.007,
      seed,
    );
    const curl = threadVariation(i, seed + 1107) * 0.6;
    rays[i % 3].push(
      `M${n(inner[0])} ${n(inner[1])}Q${n((inner[0] + outer[0]) * 0.5 - Math.sin(angle) * curl)} ${n((inner[1] + outer[1]) * 0.5 - 1.1)} ${n(outer[0])} ${n(outer[1])}`,
    );
  }
  const floor: string[] = [];
  for (let row = 0; row < Math.ceil((innerY * 2) / 1.55) + 2; row++) {
    const y = -innerY + row * 1.55 + 0.2;
    const chord = Math.sqrt(Math.max(0, 1 - (y / innerY) ** 2)) * innerX;
    if (chord < 1) continue;
    const join = threadVariation(row, seed + 1111) * Math.min(chord * 0.25, 5);
    floor.push(
      `M${n(-chord)} ${n(y + centerY)}Q${n((-chord + join) * 0.5)} ${n(y + centerY + 1.3)} ${n(join - 0.6)} ${n(y + centerY + 0.6)}M${n(join + 0.6)} ${n(y + centerY + 0.6)}Q${n((chord + join) * 0.5)} ${n(y + centerY + 1.3)} ${n(chord)} ${n(y + centerY)}`,
    );
  }
  return {
    outer: sewnEllipse(rx, ry, seed),
    inner: sewnEllipse(innerX, innerY, seed + 0.7, centerY),
    rays: rays.map((p) => p.join(" ")),
    floor: floor.join(" "),
    rx,
    ry,
  };
}
const craterForms = [
  { x: 245, y: 213, quiet: true, ...craterNeedlework(19, 5.4, 2) },
  { x: 108, y: 304, quiet: false, ...craterNeedlework(30, 12.5, 4) },
  { x: 286, y: 282, quiet: false, ...craterNeedlework(46, 19, 7) },
  { x: 297, y: 399, quiet: false, ...craterNeedlework(65, 29, 9) },
];

function LunarCrater({ form }: { form: (typeof craterForms)[number] }) {
  const id = `${useId().replace(/:/g, "")}-moon-crater`;
  const p = endwalkerPigments();
  const { x, y, rx, ry, outer, inner, rays, floor, quiet } = form;
  const rim = `url(#${id}-rim)`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={`${id}-ring`}>
          <path d={`${outer}${inner}`} fillRule="evenodd" clipRule="evenodd" />
        </clipPath>
        <clipPath id={`${id}-floor`}>
          <path d={inner} />
        </clipPath>
        <radialGradient id={`${id}-rim`} cx=".3" cy=".18" r=".86">
          <stop stopColor={quiet ? p.groundLight : p.rimLight} />
          <stop offset=".4" stopColor={quiet ? p.ground : p.rim} />
          <stop offset=".74" stopColor={quiet ? p.ground : p.groundLight} />
          <stop offset="1" stopColor={p.groundShade} />
        </radialGradient>
        <linearGradient id={`${id}-bowl`} x1="0" y1="0" x2=".2" y2="1">
          <stop stopColor={p.bowlDeep} />
          <stop offset=".6" stopColor={p.bowl} />
          <stop offset="1" stopColor={p.nearShade} />
        </linearGradient>
      </defs>
      <path
        d={outer}
        fill={p.ink}
        opacity={quiet ? 0.25 : 0.43}
        transform="translate(.8 1.8)"
      />
      <path d={outer} fill={rim} />
      <path d={inner} fill={`url(#${id}-bowl)`} />
      <g clipPath={`url(#${id}-floor)`}>
        <NookThread
          d={floor}
          color={p.bowl}
          shadow={p.bowlDeep}
          highlight={p.groundLight}
          width={1.25}
          relief={1.3}
          opacity={0.88}
        />
        <path
          d={`M${-rx} ${-ry}H${rx}V${-ry * 0.15}Q0 ${-ry * 0.6} ${-rx} ${-ry * 0.15}Z`}
          fill={p.bowlDeep}
          opacity=".17"
        />
      </g>
      <g clipPath={`url(#${id}-ring)`}>
        {rays.map((d, i) => (
          <NookThread
            key={i}
            d={d}
            color={rim}
            shadow={p.groundShade}
            highlight={p.rimLight}
            width={quiet ? 1.05 : 1.45}
            relief={quiet ? 1.1 : 1.9}
          />
        ))}
      </g>
      <NookThread
        d={outer}
        color={rim}
        shadow={p.groundShade}
        highlight={p.rimLight}
        width={quiet ? 1 : 1.65}
        relief={1.6}
      />
      <NookThread
        d={inner}
        color={p.groundLight}
        shadow={p.bowlDeep}
        highlight={p.rimLight}
        width={quiet ? 0.6 : 1.15}
        relief={1.6}
      />
      <NookThread
        d={outer}
        color={p.rimLight}
        shadow={p.groundShade}
        highlight={p.paper}
        width={quiet ? 0.55 : 0.85}
        dasharray=".8 2.6"
        opacity={quiet ? 0.3 : 0.58}
      />
    </g>
  );
}

const rocks = [
  { x: 78, y: 254, s: 0.72 },
  { x: 153, y: 244, s: 0.5 },
  { x: 323, y: 241, s: 0.65 },
  { x: 250, y: 330, s: 0.76 },
  { x: 91, y: 388, s: 1.2 },
  { x: 321, y: 347, s: 0.9 },
];
function Moonrock({ x, y, s }: { x: number; y: number; s: number }) {
  const p = endwalkerPigments();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <NookThread
        d="M-7 3Q0 6 8 3"
        color={p.groundShade}
        shadow={p.ink}
        highlight={p.groundShade}
        width={2}
        opacity={0.5}
      />
      <LunarCloth
        d="M-6 2Q-7-2-3-5L2-6Q6-4 7 1L4 4-2 4Z"
        color={p.rock}
        bounds={[-8, -8, 17, 14]}
        grain="satin"
        p={p}
        edge={0.9}
      />
      <LunarCloth
        d="M2-6 6-3 7 1 4 4 1 2Z"
        color={p.groundShade}
        bounds={[0, -8, 9, 14]}
        grain="satin"
        p={p}
        edge={0.3}
      />
      <NookThread
        d="M-5-2-2-4 1-4"
        color={p.rockLight}
        shadow={p.groundShade}
        highlight={p.paper}
        width={1.2}
      />
    </g>
  );
}

/** Permanently nocturnal Mare Lamentorum, made from gently cupped lunar cloth. */
export function NookEndwalkerView() {
  const p = endwalkerPigments();
  const thread = (d: string, color: string, width = 1.5, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow={p.groundShade}
      highlight={p.paper}
      width={width}
      opacity={opacity}
      relief={1.7}
    />
  );
  return (
    <g
      className="nook-endwalker-view nook-lunar-view"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The skyline sits below Etheirys; its low ripples are separate cloth layers. */}
      <LunarCloth
        d={farRidge}
        color={p.far}
        bounds={[58, 189, 292, 253]}
        p={p}
        bend={5}
        edge={1.15}
        quiet
      />
      {thread(
        "M71 225Q103 200 132 207M186 202q22-8 45 1M278 208q32-10 60 5",
        p.farLight,
        1.1,
        0.65,
      )}
      <LunarCrater form={craterForms[0]} />
      <LunarCloth
        d={middleRidge}
        color={p.ground}
        bounds={[58, 204, 292, 238]}
        p={p}
        bend={7}
        edge={1.45}
      />
      <LunarCloth
        d={middleFold}
        color={p.groundShade}
        bounds={[58, 234, 292, 208]}
        p={p}
        bend={5}
        edge={0.7}
      />
      {thread(
        "M67 250q31-15 55-7m13 4q22 7 48-1M236 246q31 1 60-7",
        p.groundLight,
        1.4,
        0.7,
      )}
      <LunarCloth
        d="M79 233C86 220 92 210 106 211Q122 209 139 214Q153 220 161 232Q142 231 125 235L103 236Z"
        color={p.ground}
        bounds={[77, 203, 87, 36]}
        p={p}
        bend={4}
        edge={1.15}
      />
      <LunarCloth
        d="M119 214H126Q125 220 124 228L119 230Q120 223 119 214Z"
        color={p.groundLight}
        bounds={[117, 212, 11, 20]}
        p={p}
        grain="satin"
        edge={0.5}
      />
      <LunarCloth
        d="M120 224H126Q124 231 132 237L143 243Q149 250 139 256L126 260 121 258 135 252Q143 249 138 245L127 239Q119 231 120 224Z"
        color={p.groundLight}
        bounds={[118, 222, 34, 41]}
        p={p}
        grain="satin"
        edge={0.6}
      />
      <NookLunarShelter />
      {thread(
        "M120 230h5m0 4 4-1m2 5 4-1m1 5 4-1M139 250l-4 2",
        p.rimLight,
        0.8,
        0.8,
      )}

      {/* Broad front slopes and crater banks carry the clearest padded relief. */}
      <LunarCloth
        d={foreground}
        color={p.near}
        bounds={[58, 246, 292, 196]}
        p={p}
        bend={8}
        edge={1.55}
      />
      <LunarCloth
        d="M59 325C96 307 119 322 148 316C179 309 201 315 224 309C254 301 293 314 348 300V440H59Z"
        color={p.nearShade}
        bounds={[57, 295, 293, 147]}
        p={p}
        bend={8}
        edge={0.7}
      />
      <LunarCrater form={craterForms[1]} />
      <LunarCrater form={craterForms[2]} />
      <LunarCloth
        d={nearFold}
        color={p.ground}
        bounds={[58, 337, 292, 105]}
        p={p}
        bend={10}
        edge={1.45}
      />
      <LunarCrater form={craterForms[3]} />
      {rocks.map((rock) => (
        <Moonrock key={`${rock.x}-${rock.y}`} {...rock} />
      ))}
      {thread(
        "M69 342q13-4 26-1M260 314l14 2m-1 1 6-1M309 362q10-2 21 1M76 418l12-2",
        p.groundLight,
        1.25,
        0.6,
      )}
    </g>
  );
}
