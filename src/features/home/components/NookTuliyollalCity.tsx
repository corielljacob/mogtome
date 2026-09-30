import { useId } from "react";
import {
  DawntrailPatch,
  type DawntrailBounds,
  type DawntrailGrain,
} from "./NookDawntrailPatch";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import {
  dawntrailPigments,
  type DawntrailPigments,
} from "./nookDawntrailPigments";

const mix = (color: string, pigment: string, weight: number) =>
  `color-mix(in srgb, ${color} ${weight}%, ${pigment})`;

const eave = "M-37-8-31 1-23 4H23L29 2 38-8 32 3 29 6 23 8H-23L-32 4Z";
const eaveSections = [
  [-37, -8, -37, -8],
  [-34, -3.5, -34, -0.8],
  [-31, 1, -32, 4],
  [-23, 4, -23, 8],
  [23, 4, 23, 8],
  [29, 2, 29, 6],
  [34, -3.6, 34, -0.7],
  [38, -8, 38, -8],
];
const eaveSatin = (() => {
  const tones: string[][] = [[], [], []];
  eaveSections.slice(0, -1).forEach((a, section) => {
    const b = eaveSections[section + 1];
    const dx = (b[0] + b[2] - a[0] - a[2]) * 0.5;
    const dy = (b[1] + b[3] - a[1] - a[3]) * 0.5;
    const length = Math.hypot(dx, dy);
    const count = Math.ceil(length / 1.35);
    for (let stitch = 0; stitch < count; stitch++) {
      const t =
        (stitch + 0.3 + threadVariation(stitch, 1540 + section) * 0.12) / count;
      const x1 = a[0] + (b[0] - a[0]) * t,
        y1 = a[1] + (b[1] - a[1]) * t;
      const x2 = a[2] + (b[2] - a[2]) * t,
        y2 = a[3] + (b[3] - a[3]) * t;
      tones[(section + stitch) % 3].push(
        `M${x1.toFixed(2)} ${y1.toFixed(2)}Q${((x1 + x2) * 0.5 + (dx / length) * 0.9).toFixed(2)} ${((y1 + y2) * 0.5 + (dy / length) * 0.9).toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      );
    }
  });
  return tones.map((paths) => paths.join(" "));
})();

/** Gold couching turns over the actual upturned hem, including both corners. */
function TuraliEave({ p }: { p: DawntrailPigments }) {
  const id = `${useId().replace(/:/g, "")}-turali-eave`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={eave} />
        </clipPath>
        <linearGradient id={`${id}-padding`} x1="0" y1=".1" x2=".1" y2="1">
          <stop stopColor={p.goldLight} />
          <stop offset=".48" stopColor={p.gold} />
          <stop offset="1" stopColor={mix(p.gold, p.terracottaSide, 63)} />
        </linearGradient>
      </defs>
      <path d={eave} fill={p.ink} opacity=".4" transform="translate(.4 .85)" />
      <path d={eave} fill={`url(#${id}-padding)`} />
      <g clipPath={`url(#${id})`}>
        {eaveSatin.map((d, tone) => (
          <NookThread
            key={tone}
            d={d}
            color={tone === 1 ? p.goldLight : `url(#${id}-padding)`}
            shadow={p.terracottaSide}
            highlight={p.paper}
            width={1.3}
            relief={1.8}
          />
        ))}
      </g>
      <NookThread
        d={eave}
        color={p.gold}
        shadow={p.terracottaSide}
        highlight={p.goldLight}
        width={1.1}
        relief={1.6}
      />
      <NookThread
        d="M-36-7-31 2-23 6H23L29 4 37-7"
        color={p.goldLight}
        shadow={p.gold}
        highlight={p.paper}
        width={0.65}
        dasharray=".7 2.6"
        relief={1.3}
      />
    </g>
  );
}

/** A little open pavilion: coral upswept eaves and a broad golden sun crown. */
function TuraliPavilion({
  x,
  y,
  scale = 1,
  p,
}: {
  x: number;
  y: number;
  scale?: number;
  p: DawntrailPigments;
}) {
  const patch = (
    d: string,
    color: string,
    bounds: DawntrailBounds,
    grain: DawntrailGrain = "cotton",
    edge = 1,
    slant = 0,
    crownX?: number,
    ridge?: [number, number],
  ) => (
    <DawntrailPatch
      d={d}
      color={color}
      bounds={bounds}
      grain={grain}
      edge={edge}
      slant={slant}
      crownX={crownX}
      ridge={ridge}
      p={p}
    />
  );
  const thread = (d: string, color: string, width = 1.3, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      width={width}
      shadow={mix(color, p.ink, 67)}
      highlight={mix(color, p.paper, 45)}
      relief={1.8}
      opacity={opacity}
    />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {patch(
        "M-24 2-18-2H17L24 3V30L19 35H-24Z",
        p.cliffSide,
        [-26, -4, 52, 41],
      )}
      {patch(
        "M16-1 24 3V30L19 35H14Z",
        p.foliageShade,
        [12, -3, 14, 40],
        "cotton",
        0.4,
      )}
      <path
        d="M-18 27V8L-15 5H-10L-7 8V27ZM-5 27V8L-2 4H3L6 8V27ZM8 27V8L11 5H15L18 8V27Z"
        fill={p.recess}
      />
      {thread(
        "M-16 10v15m2-16v16m2-16v16m2-15v15M-3 10v15m2-18v18m2-18v18m2-16v16M10 10v15m2-16v16m2-16v16m2-15v15",
        p.window,
        1.05,
        0.9,
      )}
      {/* The openings are cut from one thick cloth facade; the piers carry their
          own laid fibers and binding instead of reading as thin drawn columns. */}
      {patch(
        "M-21 3H21V29H-21ZM-17 26V10L-14 7H-11L-8 10V26ZM-4 26V10L-1 6H2L5 10V26ZM9 26V10L12 7H14L17 10V26Z",
        p.stone,
        [-23, 1, 46, 30],
        "cotton",
        0.85,
      )}
      {thread("M-19 5v22M-6 5v22M7 5v22M20 5v22", p.stoneLight, 1.15)}
      {patch("M-23 3H23V8H-23Z", p.roof, [-25, 1, 50, 9], "binding", 0.65)}
      {thread("M-20 5h4v2h4V5h4m10 0h4v2h4V5h4", p.goldLight, 0.95)}
      {patch(
        "M-28 25Q0 28 28 25V31L23 35H-24L-28 31Z",
        p.trim,
        [-30, 23, 60, 15],
        "binding",
        1.15,
      )}
      {patch(
        "M-25 28Q0 31 25 28V32Q0 35-25 32Z",
        p.roof,
        [-27, 26, 54, 11],
        "binding",
        0.6,
      )}
      {thread("M-27 26Q0 29 27 26M-24 34H23", p.goldLight, 1.3)}
      {thread(
        "M-21 30l2-2 3 3-3 2ZM-11 31l3-2 3 3-3 2ZM1 32l3-2 3 2-3 2ZM13 31l3-2 3 2-3 2Z",
        p.goldLight,
        1.05,
      )}

      {/* The curved shoulders open into wide, square-cut eaves. */}
      {patch(
        "M-37-8Q-26-1-14-19L-7-23H9L17-18Q28-1 38-8L29 5 23 7H-23L-31 3Z",
        p.terracotta,
        [-39, -25, 79, 34],
        "roof",
        1.3,
        -2,
        undefined,
        [-7, 9],
      )}
      {patch(
        "M-7-23-14-19Q-20-6-23 5L-31 3-37-8Q-26-1-14-19Z",
        p.terracottaLight,
        [-39, -25, 34, 32],
        "roof",
        0.6,
        -3,
        -7,
      )}
      {patch(
        "M9-23 17-18Q28-1 38-8L29 5 23 7Q19-4 9-23Z",
        p.terracottaSide,
        [8, -25, 32, 34],
        "roof",
        0.7,
        3,
        9,
      )}
      <TuraliEave p={p} />
      {thread("M-24-6Q0 0 26-5", p.terracottaSide, 1.15, 0.8)}
      {thread(
        "M-8-22Q-13-10-14 5M8-22Q12-9 15 5M0-22V5",
        p.terracottaLight,
        1.1,
      )}
      {thread(
        "M-27-1l3 3m5-4 2 4m5-3 1 4m5-3v4m6-4v4m6-4-1 4m6-5-2 4m6-6-2 4",
        p.goldLight,
        0.85,
      )}
      {patch(
        "M-10-25H11L14-21H-13Z",
        p.gold,
        [-15, -27, 31, 9],
        "binding",
        0.65,
      )}
      {patch(
        "M-16-24-20-30-15-29-14-37-10-33-7-42-3-35 0-44 4-35 8-42 10-33 15-37 15-29 20-30 16-24Z",
        p.gold,
        [-22, -46, 44, 24],
        "cotton",
        1,
      )}
      {thread(
        "M-15-26-17-29m3 3-1-7m5 7 2-11m5 11 2-14m3 14 4-11m2 11 5-7m-2 7 3-3",
        p.goldLight,
        1.5,
      )}
      {patch(
        "M-6-25a6 6 0 1 1 12 0Z",
        p.goldLight,
        [-7, -32, 14, 9],
        "cotton",
        0.7,
      )}
      {thread("M-3-25a3 3 0 0 1 6 0", p.terracottaSide, 1.15)}
      {thread("M-5-27h.1m2-3h.1m4 0h.1m2 3h.1", p.goldLight, 1.05)}
    </g>
  );
}

/** Tuliyollal's palace and stair-bound, terracotta harbor terraces in sewn cloth. */
export function NookTuliyollalCity({ isDark }: { isDark: boolean }) {
  const p = dawntrailPigments(isDark);
  const patch = (
    d: string,
    color: string,
    bounds: DawntrailBounds,
    grain: DawntrailGrain = "cotton",
    edge = 1,
    slant = 0,
    crownX?: number,
    ridge?: [number, number],
  ) => (
    <DawntrailPatch
      d={d}
      color={color}
      bounds={bounds}
      grain={grain}
      edge={edge}
      slant={slant}
      crownX={crownX}
      ridge={ridge}
      p={p}
    />
  );
  const thread = (d: string, color: string, width = 1.3, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      width={width}
      shadow={mix(color, p.ink, 67)}
      highlight={mix(color, p.paper, 45)}
      relief={1.8}
      opacity={opacity}
    />
  );
  return (
    <g className="nook-tuliyollal-city">
      {/* Nested terraces rise behind the palace without hiding its open galleries. */}
      {patch(
        "M82 258H100V248H114V239H177V248H188V274H82Z",
        p.cliffSide,
        [80, 237, 110, 40],
        "cotton",
        0.8,
      )}
      {patch("M106 245H174L181 251V266H103Z", p.cliff, [101, 243, 82, 26])}
      {patch(
        "M174 245 181 251V266H171Z",
        p.cliffSide,
        [169, 243, 14, 26],
        "cotton",
        0.45,
      )}
      {patch(
        "M105 248H178L179 254H104Z",
        p.terracottaSide,
        [102, 246, 79, 11],
        "binding",
        0.75,
      )}
      {thread("M105 248h73M104 254h75M108 265h68", p.trim, 1.3)}
      {thread(
        "M110 251h4v2h4v-2h4m4 0h4v2h4m25-2h4v2h4v-2h5",
        p.goldLight,
        1.05,
      )}
      {patch(
        "M104 255H111V265L114 269H102ZM174 255H180V267L184 270H173Z",
        p.cliffSide,
        [100, 253, 86, 20],
        "cotton",
        0.75,
      )}
      {thread("M106 256v9M176 256v10M105 259h4m66 0h4", p.stoneLight, 1.25)}
      {patch(
        "M116 238H176L180 244H112Z",
        p.stoneLight,
        [110, 236, 72, 11],
        "binding",
        1,
      )}
      {/* The summit clears the fixed window rail; these upper stairs join its
          foundation to the lower terraces, keeping the city rooted in the hill. */}
      <TuraliPavilion x={146} y={207} p={p} />
      {patch(
        "M138 241H154L159 271H132Z",
        p.stoneSide,
        [130, 239, 31, 35],
        "cotton",
        0.8,
      )}
      {thread(
        "M138 245h17M137 249h19M136 253h21M135 257h23M134 261h24M134 265h25M133 269h26",
        p.stoneLight,
        1.35,
      )}
      {thread("M137 242 132 271M155 242 160 271", p.trim, 1.8)}
      <TuraliPavilion x={96} y={259} scale={0.57} p={p} />
      {patch(
        "M114 271H177L187 280H109Z",
        p.stoneLight,
        [107, 269, 82, 13],
        "binding",
        1.1,
      )}
      {patch(
        "M108 278H184L189 282V288H103V282Z",
        p.cliffSide,
        [101, 276, 90, 15],
      )}
      {patch(
        "M107 280H185V286H107Z",
        p.roof,
        [105, 278, 82, 10],
        "binding",
        0.7,
      )}
      {thread("M107 280h78M104 288h84", p.gold, 1.7)}
      {thread(
        "M112 283l3-2 3 2-3 2ZM123 283l3-2 3 2-3 2ZM164 283l3-2 3 2-3 2ZM176 283l3-2 3 2-3 2Z",
        p.goldLight,
        1.1,
      )}

      {/* A steep central stair gives the hillside its distinctive layered silhouette. */}
      {patch(
        "M134 270H157L169 303H119Z",
        p.stoneSide,
        [117, 268, 55, 38],
        "cotton",
        0.8,
      )}
      {thread(
        "M133 274h26M131 278h29M130 282h32M128 286h35M126 290h39M124 294h43M123 298h45",
        p.stoneLight,
        1.5,
      )}
      {thread("M132 271 120 302M159 271 172 303", p.trim, 2.2)}
      {patch("M120 303H175V310H117Z", p.path, [115, 301, 63, 11], "binding", 1)}

      {/* Houses, patterned parapets and shop awnings descend toward the harbor. */}
      {patch(
        "M73 284 80 280H107L113 285V307L107 312H73Z",
        p.terracotta,
        [71, 278, 44, 36],
      )}
      {patch(
        "M105 280 113 285V307L107 312H104Z",
        p.terracottaSide,
        [102, 278, 13, 36],
        "cotton",
        0.4,
      )}
      {patch(
        "M74 280H95V273H107L111 277V286H72Z",
        p.terracottaLight,
        [70, 271, 43, 18],
        "binding",
        0.8,
      )}
      {thread("M73 283h25v-7h9M73 286h37", p.trim, 1.2)}
      {patch(
        "M165 279H191L197 285V309L190 315H165Z",
        p.terracotta,
        [163, 277, 36, 40],
      )}
      {patch(
        "M190 279 205 285V315H190Z",
        p.terracottaSide,
        [188, 277, 19, 40],
        "cotton",
        0.6,
      )}
      {patch(
        "M163 279 171 269H189L198 280Z",
        p.roof,
        [161, 267, 40, 16],
        "roof",
        1,
        -2,
        undefined,
        [171, 189],
      )}
      {patch(
        "M189 269 198 280 193 281Z",
        p.roofSide,
        [187, 267, 13, 16],
        "roof",
        0.45,
        1,
        189,
      )}
      {patch(
        "M163 278H197L200 281 195 284H166L162 281Z",
        p.gold,
        [160, 276, 42, 11],
        "binding",
        0.8,
      )}
      {thread("M164 280h35M169 274h24M168 282h27", p.goldLight, 1.1)}
      {thread("M172 268v-7m16 7v-7", p.gold, 1.2)}
      <path
        d="M80 307V293L83 289H87L90 293V307ZM99 307V292L102 289H106L109 292V307ZM170 307V291L172 287H176L179 291V307ZM184 307V291L186 287H189L192 291V307Z"
        fill={p.recess}
      />
      {thread(
        "M82 294v11m2-13v13m2-13v13m2-11v11M101 294v11m2-13v13m2-13v13m2-11v11M172 292v13m2-15v15m2-13v13M186 292v13m2-14v14m2-12v12",
        p.window,
        1.05,
      )}
      {patch(
        "M78 287H93V309H78ZM81 306V294L84 290H87L90 294V306ZM97 287H112V309H97ZM100 306V293L103 290H106L109 293V306Z",
        p.stone,
        [76, 285, 38, 27],
        "cotton",
        0.65,
      )}
      {patch(
        "M168 286H181V309H168ZM171 306V292L174 289 178 293V306ZM182 286H195V309H182ZM185 306V292L188 289 192 293V306Z",
        p.stone,
        [166, 284, 31, 27],
        "cotton",
        0.65,
      )}
      {thread(
        "M79 289h12m8 0h11M169 287h11m3 0h11M169 310h25",
        p.stoneLight,
        1.15,
      )}
      {/* Separate dyed cloth strips turn over the scalloped market awning hem. */}
      {patch(
        "M74 295H109L116 301V303Q110 307 104 303Q97 307 90 303Q83 307 76 303L71 302Z",
        p.terracottaLight,
        [69, 293, 49, 16],
        "cotton",
        0.9,
        2,
      )}
      {patch(
        "M80 295H86L90 303Q83 307 78 303ZM93 295H99L104 303Q100 306 97 304Z",
        p.roof,
        [76, 293, 30, 16],
        "cotton",
        0.5,
        2,
      )}
      {thread("M74 295h35M72 302l4 1q7 4 14 0q7 4 14 0q7 4 12 0", p.gold, 1.35)}
      {thread("M77 296l3 4m8-4 3 4m9-4 3 4m7-2 3 3", p.goldLight, 0.8)}
      {thread("M76 305v6M112 305v6", p.wood, 1.6)}

      {patch(
        "M66 311 106 307H169L209 315 215 326 167 321H110L66 323Z",
        p.stone,
        [64, 305, 153, 23],
        "rock",
        1.2,
      )}
      {thread(
        "M66 314 108 310H169L209 318M68 320 110 315H166L209 323",
        p.trim,
        1.4,
      )}
      {thread(
        "M75 313v9m12-11v9m12-11v9M179 314v8m12-6v9m11-6v8",
        p.stoneDeep,
        1,
        0.7,
      )}

      {/* Broad shaded steps turn down the coast alongside the window mullion. */}
      {patch(
        "M202 298H221L246 337 234 343 208 315Z",
        p.stoneSide,
        [200, 296, 48, 50],
        "cotton",
        1,
      )}
      {thread(
        "M205 302h19m-16 5h19m-16 5h19m-16 5h19m-16 5h19m-16 5h19m-16 5h19m-16 5h19",
        p.stoneLight,
        1.7,
      )}
      {thread("M201 297 230 342M224 298 249 337", p.trim, 2.4)}
      {thread("M199 298h7m15 0h7M227 343h7m13-6h6", p.gold, 2.3)}

      {/* A carved feather crest is sewn into the front of the palace terrace. */}
      {thread("M121 253v9m0-3-5-5m5 2 5-5m-5 11-5-5m5 2 5-5", p.goldLight, 1.1)}
      {thread("M83 279h5v-4h5m78-30h4v5h5", p.goldLight, 1.05)}
      {thread(
        "M112 311v-10m-2 0h4M205 319v-10m-2 0h4M238 339v-11m-2 0h4",
        p.wood,
        1.4,
      )}
      {thread("M111 299h2M204 307h2M237 326h2", p.window, 2.3)}
    </g>
  );
}
