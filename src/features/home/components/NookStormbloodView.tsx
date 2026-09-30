import { useId } from "react";
import { NookThread } from "./NookThread";
import { NookAlaMhigoCitadel, StormbloodPatch } from "./NookAlaMhigoCitadel";
import { threadVariation } from "./nookNeedlework";
import { stormbloodPigments } from "./nookStormbloodPigments";

const distantCrags =
  "M65 250 78 220 84 194Q88 187 93 194L99 208 112 209 127 236 154 221 172 227 198 212 220 231 239 209 261 217 274 211 293 226 318 206 329 215 341 234 355 230V457H65Z";
const easternMesa =
  "M272 311Q281 255 292 220L298 195 308 185 311 174Q316 171 320 182L329 185 345 211V438H256Z";
const easternShade =
  "M312 177 320 185 329 187 345 214V438H310Q318 378 305 324L312 278 307 238Z";
const centralCliff =
  "M64 317 75 286 93 279 99 258Q104 249 111 253L124 249 132 236 143 239 155 261 174 269 186 251 202 259 215 255 230 274 245 271 261 253 276 261 285 250 298 262 310 289 344 294V438H64Z";
const cliffFront =
  "M63 325Q88 306 108 309L116 291 130 287 139 273 148 277 154 298 176 302 187 291 202 296 213 317 234 323 246 311 264 314 276 300 291 311 302 306 319 319 342 321V438H63Z";
const faceCuts =
  "M101 254Q96 282 101 304L95 338 112 357 120 437H139Q124 371 131 334L122 306 126 255ZM187 254 190 287 179 315 197 345 209 437H229L214 346 204 307 208 262ZM265 258 258 286 269 315 260 344 272 438H295Q277 382 287 348L284 302 291 256Z";
const foregroundFolds =
  "M116 291 130 287 124 313 132 337 122 351 136 438H115L105 351 114 324ZM187 291 202 296 199 317 212 338 206 361 224 438H203L186 359 193 340 181 323ZM276 300 291 311 286 333 296 352 288 382 303 438H279L267 379 278 352 267 332Z";
const strataSeams =
  "M69 299q25-8 40-5m7-2q14-7 32-1m8 2q20 8 35 3m19 5q16 3 31-2m39-16 27 7M65 313q24-8 41-4m13-1q15-7 31-2m7 4q20 7 42 0m19 8 24 6m12-4q19-8 31 0m8-4 38 10M65 329q28-9 47-1m14-4 30 5m6 1q17 3 32-1m25 10q18 2 29-6m14-2 29 7m9-4 36 9";
const lake = "M64 343Q126 333 182 344T278 342L343 333V438H64Z";
const leftSalt =
  "M64 337Q102 328 129 341L145 351Q128 362 107 364L89 379 64 382Z";
const rightSalt =
  "M343 329Q315 328 298 343L280 349 275 356 298 364 311 378 343 380Z";
// Looped knots sit on top of the salt-bank stitches, like little tufts of cotton.
const saltKnots = [64, 275].map((left) =>
  Array.from({ length: 140 }, (_, index) => {
    const x = left + (index % 14) * 6 + threadVariation(index, 651) * 1.6;
    const y =
      332 + Math.floor(index / 14) * 5 + threadVariation(index, 652) * 1.2;
    const r = 0.6 + threadVariation(index, 653) * 0.15;
    return `M${x.toFixed(2)} ${y.toFixed(2)}c${-r} ${-r * 1.5} ${r * 1.9} ${-r * 1.6} ${r * 1.5} 0s${-r * 2.2} ${r * 1.3} ${-r * 1.5} 0`;
  }).join(" "),
);

/** Gyr Abania in layered sandstone cloth, with Ala Mhigo above Loch Seld. */
export function NookStormbloodView({ isDark }: { isDark: boolean }) {
  const id = `${useId().replace(/:/g, "")}-salt-knots`;
  const p = stormbloodPigments(isDark);
  const thread = (d: string, color: string, width = 1.5, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow={p.deep}
      highlight={p.paper}
      width={width}
      relief={1.5}
      opacity={opacity}
    />
  );
  return (
    <g
      className="nook-stormblood-view"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        {[leftSalt, rightSalt].map((d, index) => (
          <clipPath key={index} id={`${id}-${index}`}>
            <path d={d} />
          </clipPath>
        ))}
      </defs>
      {/* Rock strata form broad, hand-cut ledges; the cliff faces stay sewn to the base. */}
      <StormbloodPatch
        d={distantCrags}
        color={p.distant}
        bounds={[64, 183, 282, 255]}
        grain="stone"
        p={p}
        edge={1}
        raised={false}
      />
      {thread(
        "M80 221 86 196l6 7m23 10 13 24M315 215l4-7 9 8",
        p.light,
        1,
        0.5,
      )}
      {/* A little open sky keeps the right tower separate from the distant mesa. */}
      <g transform="translate(15 18)">
        <StormbloodPatch
          d={easternMesa}
          color={p.cliffLight}
          bounds={[255, 173, 92, 265]}
          grain="strata"
          p={p}
          edge={1.7}
        />
        <StormbloodPatch
          d={easternShade}
          color={p.cliff}
          bounds={[302, 174, 45, 264]}
          grain="stone"
          p={p}
          edge={0.9}
        />
        {thread(
          "M301 201q12-5 24 2m-30 11q17-6 39 5m-40 8q25-5 46 9M290 244q21-6 40 2m-42 13q21-6 42 3",
          p.light,
          1.25,
          0.72,
        )}
        {thread(
          "M310 187l2 4m6-3v4m9-2-1 4M301 215l1 4m7-4 1 4m8-2v4m8-2-1 4",
          p.paper,
          0.8,
          0.65,
        )}
      </g>

      <StormbloodPatch
        d={centralCliff}
        color={p.cliff}
        bounds={[62, 234, 284, 204]}
        grain="strata"
        p={p}
        edge={1.65}
      />
      <StormbloodPatch
        d={faceCuts}
        color={p.shadow}
        bounds={[93, 251, 204, 187]}
        grain="stone"
        p={p}
        edge={0.8}
      />
      <StormbloodPatch
        d={cliffFront}
        color={p.cliffLight}
        bounds={[62, 271, 284, 167]}
        grain="strata"
        p={p}
        edge={1.4}
      />
      {/* The broken faces turn away from the light; their grain turns with them. */}
      <StormbloodPatch
        d={foregroundFolds}
        color={isDark ? "#684d62" : "#a86f58"}
        bounds={[103, 284, 202, 155]}
        grain="stone"
        p={p}
        edge={0.65}
      />
      {thread(
        "M116 293 114 322 105 348M187 294 181 322 193 340M277 303 267 330 278 351",
        p.cliffLight,
        2.1,
        0.9,
      )}
      {thread(strataSeams, p.cliff, 2.1, 0.82)}
      {/* Small cross stitches couch the thicker contour yarn onto the cliff cloth. */}
      <NookThread
        d="M77 296l1 4m8-6 1 4m35-6 2 4m9-6 1 4m29-1-1 4m10-1-1 4m47-3-1 4M75 309l1 4m10-6 1 4m37-7 1 4m10-5 1 4m34 0-1 4m11-2-1 4m43 2-1 4m42-6 1 4m11-3 1 4m30 1-1 4M79 324v4m10-4v4m45-4-1 4m12-2-1 4m26-1v4m59 6-1 4m42-8-1 4m39 4-1 4"
        color={p.light}
        shadow={p.shadow}
        highlight={p.paper}
        width={1.05}
        relief={1.7}
        opacity={0.88}
      />
      {thread(
        "M103 267q-4 10-2 19m35-33 6 18m18 29 5 9m26-10-3 15m16 12 3 10m49-41 6 14m33 6-2 14M84 316l-4 9m42 2 2 9m189 4 3 9",
        p.shadow,
        1.5,
        0.75,
      )}
      {thread(
        "M121 297l3 4m4-6 3 4m8-9 3 4M245 322l1 4m6-6 2 4m6-5 2 4M75 308l2 3m6-4 2 3",
        p.paper,
        0.9,
        0.7,
      )}

      {/* Pale salt crusts interrupt the quiet, green-blue water at the foot of the city. */}
      <StormbloodPatch
        d={lake}
        color={p.water}
        bounds={[63, 333, 282, 105]}
        grain="water"
        p={p}
        edge={0}
        raised={false}
      />
      <StormbloodPatch
        d={leftSalt}
        color={p.salt}
        bounds={[63, 328, 84, 55]}
        grain="strata"
        p={p}
        edge={1.3}
      />
      <StormbloodPatch
        d={rightSalt}
        color={p.salt}
        bounds={[274, 328, 71, 53]}
        grain="strata"
        p={p}
        edge={1.3}
      />
      {saltKnots.map((d, index) => (
        <g key={index} clipPath={`url(#${id}-${index})`}>
          <NookThread
            d={d}
            color={p.paper}
            shadow={p.shadow}
            highlight={p.paper}
            width={0.85}
            relief={1.6}
            opacity={0.85}
          />
        </g>
      ))}
      {thread(
        "M91 377q16-15 33-16m9-3 12-8M280 357l16 7 13 13M77 391q30-5 53-2m17 8q22-3 43-1m48-17q26-5 42-1m-61 35q24-4 46-2m-179 5q21-5 42-3",
        p.foam,
        1.15,
        0.7,
      )}
      {thread(
        "M73 362q14-9 31-8m9-1 13-3M307 345q16-8 32-6M315 360l17 5",
        p.paper,
        1.45,
        0.8,
      )}

      {/* The arcade's overhang casts a continuous seam onto the rock beneath it. */}
      <StormbloodPatch
        d="M67 302Q139 289 216 302L282 298 290 310 214 316Q139 302 66 320Z"
        color={isDark ? "#45394e" : "#88604f"}
        bounds={[65, 289, 226, 32]}
        grain="strata"
        p={p}
        edge={0}
      />
      <NookAlaMhigoCitadel isDark={isDark} />
      {/* Two low foreground shelves nestle the wall into the rock beneath its arcades. */}
      <StormbloodPatch
        d="M64 314Q81 304 94 308L100 322 113 327 107 345 92 352 65 349Z"
        color={p.cliff}
        bounds={[63, 304, 52, 49]}
        grain="strata"
        p={p}
      />
      <StormbloodPatch
        d="M94 309 100 322 113 327 107 345 92 352 91 341 99 328Z"
        color={isDark ? "#57465b" : "#976049"}
        bounds={[89, 308, 25, 45]}
        grain="stone"
        p={p}
        edge={0.6}
      />
      <StormbloodPatch
        d="M298 284 311 281 322 291 342 294V334L322 340 309 326 295 319Z"
        color={p.cliffLight}
        bounds={[294, 280, 50, 62]}
        grain="strata"
        p={p}
      />
      <StormbloodPatch
        d="M311 282 322 291 342 294V334L322 340 326 323 315 311Z"
        color={isDark ? "#745363" : "#b07755"}
        bounds={[310, 281, 34, 61]}
        grain="stone"
        p={p}
        edge={0.7}
      />
      {thread(
        "M65 329q16-6 30-2m-28 12q18-7 37-4M303 303q19-3 37 4m-35 7q15-2 35 3",
        p.light,
        1.4,
        0.8,
      )}
      {thread(
        "M77 346q4-13 2-20m1 9 5-6m-5 10-5-4M321 339q-2-13 2-20m-1 11 5-6m-6 11-5-5",
        p.roof,
        1.3,
        0.85,
      )}
    </g>
  );
}
