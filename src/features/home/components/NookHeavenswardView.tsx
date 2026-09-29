import { useId } from "react";
import { NookThread } from "./NookThread";
import { NookIshgardCitadel } from "./NookIshgardCitadel";
import { ishgardPigments } from "./nookHeavenswardPigments";
import { threadVariation } from "./nookNeedlework";

const backRange =
  "M65 276Q76 264 89 251Q94 254 98 252L113 229Q115 223 118 230L123 237 142 229Q160 240 173 253L202 239 212 218Q217 219 225 226L239 250V437H65Z";
const westernFold =
  "M89 251Q86 275 93 301Q105 348 103 388L96 437H65V276ZM115 226Q111 253 119 280Q132 330 145 437H177Q151 321 142 277L142 229 123 237Z";
const westernSnow =
  "M65 276Q76 264 89 251Q94 254 98 252L113 229Q115 223 118 230L123 237 130 234 123 247 118 243 114 252 110 247 101 262 94 258 88 264 84 261 75 273 69 274Z";
const westernSnowSeam =
  "M65 276 69 274 75 273 84 261 88 264 94 258 101 262 110 247 114 252 118 243 123 247 130 234";

// The ridge visible to the left of the city is a complete cloth piece too.
// Broad coverage lets its sloping silhouette cut across staggered bowed rows.
const westernSatin = Array.from({ length: 80 }, (_, column) => {
  const x = 57 + column * 2.4 + threadVariation(column, 361) * 0.35;
  return Array.from({ length: 23 }, (_, row) => {
    const index = column * 23 + row;
    const y = 214 + row * 10.1 + (column % 2) * 4.9;
    const length = 9 + threadVariation(index, 362) * 0.9;
    const drift = Math.max(-2.4, Math.min(2.4, (x - 115) * 0.042));
    const bend = drift * 0.35 + threadVariation(index, 363) * 0.45;
    return `M${x.toFixed(2)} ${y.toFixed(2)}q${bend.toFixed(2)} ${(length * 0.48).toFixed(2)} ${drift.toFixed(2)} ${length.toFixed(2)}`;
  }).join(" ");
}).join(" ");
const peaks = [
  {
    name: "high",
    apex: [265, 177],
    base: [201, 327, 312],
    outline:
      "M201 311Q217 267 239 221Q243 211 249 209L259 187Q264 174 267 179Q274 192 279 203Q292 218 299 235Q315 272 327 312L348 437H181Q187 367 201 311Z",
    shade:
      "M265 178Q260 213 269 237Q282 272 281 313Q286 376 306 437H348L327 312Q311 270 296 230L278 203Z",
    cap: "M239 221Q243 211 249 209L259 187Q264 174 267 179Q274 192 279 203L289 217Q282 215 278 210L271 214Q266 212 264 205L258 218 252 216 246 227Z",
    seam: "M239 221 246 227 252 216 258 218 264 205Q266 212 271 214L278 210Q282 215 289 217",
    crosses:
      "M242 222l4-1m-3-2 2 4M252 215l3 4m-3 0 3-3M260 211l4 1m-3-3 1 5M269 211l1 5m-3-2 5-1M279 210l-1 4m-2-2 5 1",
  },
  {
    name: "east",
    apex: [321, 197],
    base: [266, 364, 319],
    outline:
      "M266 319Q279 273 293 248Q301 235 305 223L317 202Q321 194 324 201L339 225Q351 246 364 277V437H239Q250 365 266 319Z",
    shade:
      "M321 198Q316 232 327 252Q343 279 342 319Q340 377 351 437H364V277Q350 243 336 220Z",
    cap: "M300 235 306 221 317 202Q321 194 324 201L339 225 345 238 335 232 329 236 322 224 316 236 310 231 305 240Z",
    seam: "M300 235 305 240 310 231 316 236 322 224 329 236 335 232 345 238",
    crosses:
      "M302 235l4 2m-3 1 2-4M311 231l1 4m-3-2 5 1M319 228l4 2m-3-3 1 5M328 234l3-2m-3-1 3 4M337 232l-1 5m-2-3 5 1",
  },
  {
    name: "fold",
    apex: [247, 232],
    base: [195, 304, 347],
    outline:
      "M195 347Q207 298 221 274Q231 262 239 245L244 235Q247 230 250 234L264 253Q279 268 286 290Q298 319 304 347Q312 399 328 437H174Q184 388 195 347Z",
    shade:
      "M247 232Q250 266 245 287Q244 316 260 347Q257 395 284 437H328Q315 400 304 347Q297 312 280 276L264 253Z",
    cap: "M226 267Q234 257 240 242L244 235Q247 230 250 234L264 253 271 263 261 260 257 265 250 254 244 264 239 260 233 271Z",
    seam: "M226 267 233 271 239 260 244 264 250 254 257 265 261 260 271 263",
    crosses:
      "M230 267l1 5m-3-3 5 1M240 259l2 5m-4-2 5-1M248 256l4 2m-3-3 1 5M257 263l4-1m-3-2 1 5",
  },
];

// Like the moogle's padded cotton, staggered stitches bow out along the form.
// Each mountain fans its own threads from its crown toward its broad foothills.
function slopeStitches(
  peak: (typeof peaks)[number],
  seed: number,
  cotton = false,
) {
  const [cx, top] = peak.apex;
  const [left, right, foot] = peak.base;
  const paths: string[] = [];
  const pitch = cotton ? 2.05 : 2.5;
  const rows = cotton ? 8 : Math.ceil((443 - top) / 10.2);
  for (let row = 0; row < rows; row++) {
    const y = top - 5 + row * 10.2;
    const spread = Math.max(0.08, (y - top + 18) / (foot - top));
    const start = cx + (left - cx) * spread - 7;
    const end = cx + (right - cx) * spread + 7;
    for (let x = start, column = 0; x < end; x += pitch, column++) {
      const index = row * 100 + column;
      const sy = y + (column % 2) * 4.8 + threadVariation(index, seed) * 1.1;
      const length = 8.9 + threadVariation(index, seed + 1) * 1.2;
      const drift = ((x - cx) * length * 0.76) / (sy - top + 30);
      const bow = drift * 0.35 + threadVariation(index, seed + 2) * 0.5;
      paths.push(
        `M${x.toFixed(2)} ${sy.toFixed(2)}q${bow.toFixed(2)} ${(length * 0.48).toFixed(2)} ${drift.toFixed(2)} ${length.toFixed(2)}`,
      );
    }
  }
  return paths.join(" ");
}
const mountainPieces = peaks.map((peak, index) => ({
  ...peak,
  satin: slopeStitches(peak, 311 + index * 5),
  cotton: slopeStitches(peak, 331 + index * 5, true),
}));
const mistPatch =
  "M207 300Q216 285 231 286Q239 279 250 286Q268 291 281 281Q294 272 307 278Q324 268 345 276V293Q326 286 311 294Q296 289 280 299Q264 306 245 300Q226 295 211 309Z";
const mistCotton = Array.from({ length: 16 }, (_, row) => {
  const y = 274 + row * 2.25;
  return `M203 ${y}q18-10 34-4t34-2m2-1q16-9 32-4t42-3`;
}).join(" ");

/** Hand-cut Coerthan peaks share the room's padded cotton and raised seams. */
export function NookHeavenswardView({ isDark }: { isDark: boolean }) {
  const id = `${useId().replace(/:/g, "")}-coerthas`;
  const p = ishgardPigments(isDark);
  const ridge = isDark ? "#3d526d" : "#a4b4c4";
  const near = isDark ? "#536e88" : "#9fb4c5";
  const paint = (name: string) => `url(#${id}-${name})`;
  const stitch = (d: string, color: string, width = 1.4, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow={p.deep}
      highlight={p.snow}
      width={width}
      opacity={opacity}
      relief={1.3}
    />
  );
  return (
    <g
      className="nook-heavensward-view"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-mist`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={p.mist} stopOpacity="0" />
          <stop offset=".6" stopColor={p.mist} stopOpacity=".45" />
          <stop offset="1" stopColor={p.mist} stopOpacity=".88" />
        </linearGradient>
        <clipPath id={`${id}-mist-patch`}>
          <path d={mistPatch} />
        </clipPath>
        <clipPath id={`${id}-west`}>
          <path d={backRange} />
        </clipPath>
        <clipPath id={`${id}-west-fold`}>
          <path d={westernFold} />
        </clipPath>
        <clipPath id={`${id}-west-snow`}>
          <path d={westernSnow} />
        </clipPath>
        <linearGradient
          id={`${id}-west-padding`}
          gradientUnits="userSpaceOnUse"
          x1="65"
          y1="270"
          x2="156"
          y2="323"
        >
          <stop stopColor={ridge} />
          <stop offset=".36" stopColor={near} />
          <stop offset=".65" stopColor={ridge} />
          <stop offset="1" stopColor={p.shadow} />
        </linearGradient>
        {mountainPieces.map((peak, index) => (
          <g key={peak.name}>
            <clipPath id={`${id}-${peak.name}`}>
              <path d={peak.outline} />
            </clipPath>
            <clipPath id={`${id}-${peak.name}-shade`}>
              <path d={peak.shade} />
            </clipPath>
            <clipPath id={`${id}-${peak.name}-cap`}>
              <path d={peak.cap} />
            </clipPath>
            <linearGradient
              id={`${id}-${peak.name}-padding`}
              x1="0"
              y1=".1"
              x2="1"
              y2=".65"
            >
              <stop stopColor={ridge} />
              <stop offset=".36" stopColor={index === 2 ? near : p.light} />
              <stop offset=".62" stopColor={index === 2 ? near : ridge} />
              <stop offset="1" stopColor={p.shadow} />
            </linearGradient>
            <linearGradient
              id={`${id}-${peak.name}-snow`}
              x1="0"
              y1="0"
              x2=".85"
              y2="1"
            >
              <stop stopColor={p.light} />
              <stop offset=".28" stopColor={p.snow} />
              <stop offset=".68" stopColor={p.snow} />
              <stop offset="1" stopColor={p.light} />
            </linearGradient>
          </g>
        ))}
      </defs>
      <path d={backRange} fill={paint("west-padding")} />
      <g clipPath={paint("west")}>
        <NookThread
          d={westernSatin}
          color={paint("west-padding")}
          shadow={p.shadow}
          highlight={p.light}
          width={1.8}
          relief={1.5}
        />
        <path d={westernFold} fill={p.deep} opacity=".18" />
        <g clipPath={paint("west-fold")}>
          <NookThread
            d={westernSatin}
            color={ridge}
            shadow={p.deep}
            highlight={near}
            width={1.7}
            relief={1.4}
          />
        </g>
        <path
          d={westernSnow}
          fill={p.light}
          transform="translate(.25 .8)"
          opacity=".8"
        />
        <path d={westernSnow} fill={p.snow} />
        <g clipPath={paint("west-snow")}>
          <NookThread
            d={westernSatin}
            color={p.snow}
            shadow={p.light}
            highlight={p.snow}
            width={1.8}
            relief={1.5}
          />
        </g>
      </g>
      <NookThread
        d={westernSnowSeam}
        color={p.light}
        shadow={ridge}
        highlight={p.snow}
        width={1.25}
        relief={1.5}
      />
      <NookThread
        d="M73 272l2 3m8-15 2 3m8-6 1 4m7-1 2 2m7-15 1 4m6-7 3 2m3-1 2 2"
        color={p.snow}
        shadow={p.shadow}
        highlight={p.snow}
        width={0.9}
        relief={1.25}
      />
      {mountainPieces.map((peak, index) => (
        <g key={peak.name}>
          <path
            d={peak.outline}
            fill={p.deep}
            opacity=".25"
            transform="translate(.6 1.2)"
          />
          <path d={peak.outline} fill={paint(`${peak.name}-padding`)} />
          <g clipPath={paint(peak.name)}>
            <NookThread
              d={peak.satin}
              color={paint(`${peak.name}-padding`)}
              shadow={p.shadow}
              highlight={p.snow}
              width={1.85}
              relief={1.65}
            />
            <path
              d={peak.shade}
              fill={p.deep}
              opacity={index === 2 ? ".28" : ".2"}
            />
            <g clipPath={paint(`${peak.name}-shade`)}>
              <NookThread
                d={peak.satin}
                color={index === 2 ? ridge : p.shadow}
                shadow={p.deep}
                highlight={near}
                width={1.75}
                relief={1.5}
                opacity={0.86}
              />
            </g>
          </g>
          <NookThread
            d={peak.outline}
            color={index === 2 ? near : ridge}
            shadow={p.deep}
            highlight={p.light}
            width={1.5}
            relief={1.5}
          />
          <path
            d={peak.cap}
            fill={p.deep}
            opacity=".28"
            transform="translate(.3 1)"
          />
          <path d={peak.cap} fill={paint(`${peak.name}-snow`)} />
          <g clipPath={paint(`${peak.name}-cap`)}>
            <NookThread
              d={peak.cotton}
              color={p.snow}
              shadow={p.light}
              highlight={p.snow}
              width={1.72}
              relief={1.45}
            />
          </g>
          <NookThread
            d={peak.cap}
            color={p.light}
            shadow={p.shadow}
            highlight={p.snow}
            width={1.35}
            relief={1.4}
          />
          <NookThread
            d={peak.seam}
            color={p.snow}
            shadow={p.shadow}
            highlight={p.snow}
            width={1.65}
            relief={1.4}
          />
          <NookThread
            d={peak.crosses}
            color={p.snow}
            shadow={p.shadow}
            highlight={p.snow}
            width={0.85}
            relief={1.2}
          />
        </g>
      ))}
      {/* Loose cotton drifts curl over the lower slopes without a tiled weave. */}
      <path d={mistPatch} fill={p.mist} opacity=".64" />
      <g clipPath={paint("mist-patch")}>
        <NookThread
          d={mistCotton}
          color={p.mist}
          shadow={ridge}
          highlight={p.light}
          width={1.85}
          relief={1.45}
          opacity={0.82}
        />
      </g>
      {stitch(
        "M211 300q15-13 31-10t30-2m4-1q17-10 30-4m7-2q14-8 29-2",
        p.light,
        1.7,
        0.58,
      )}
      <NookIshgardCitadel isDark={isDark} />
      {/* A low cloud sea softens the ends of the immense foundations. */}
      <path
        d="M65 365Q90 350 117 368T178 374T238 379T299 391T341 372V438H65Z"
        fill={paint("mist")}
      />
      {stitch(
        "M63 372q24-8 43-2m-34 10q29-9 51 0M213 394q15-8 31-4m-5 13q33-12 55-2t51-1",
        p.mist,
        4,
        0.65,
      )}
      {stitch(
        "M65 418q22-11 42-7t33 4M207 425q24-9 42-5t51 0 40 2",
        p.light,
        2,
        0.5,
      )}
    </g>
  );
}
