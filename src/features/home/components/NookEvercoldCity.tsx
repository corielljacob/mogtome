import {
  EvercoldPatch,
  type EvercoldBounds,
  type EvercoldGrain,
} from "./NookEvercoldPatch";
import { NookThread } from "./NookThread";
import { evercoldContourStitches } from "./nookEvercoldNeedlework";
import {
  evercoldPigments,
  type EvercoldPigments,
} from "./nookEvercoldPigments";

const mix = (color: string, pigment: string, weight: number) =>
  `color-mix(in srgb, ${color} ${weight}%, ${pigment})`;

// Each narrow binding is wrapped across its own bowed centerline.
const houseCollar = evercoldContourStitches(
  [
    [
      [-27, 41],
      [-11, 49],
      [9, 48],
      [24, 41],
    ],
  ],
  6,
  { across: true, seed: 1991 },
);
const houseEave = evercoldContourStitches(
  [
    [
      [-26, 19],
      [-15, 15],
      [-7, 17],
      [1, 22],
    ],
    [
      [1, 22],
      [9, 17],
      [18, 15],
      [27, 18],
    ],
  ],
  5,
  { across: true, seed: 1993 },
);
const spireEave = evercoldContourStitches(
  [
    [
      [125, 212],
      [137, 206],
      [145, 211],
      [153, 214],
    ],
    [
      [153, 214],
      [162, 209],
      [172, 208],
      [182, 212],
    ],
  ],
  5,
  { across: true, seed: 1995 },
);
const spireCollar = evercoldContourStitches(
  [
    [
      [124, 258],
      [140, 266],
      [166, 268],
      [182, 258],
    ],
  ],
  6,
  { across: true, seed: 1997 },
);
const bridgeBinding = evercoldContourStitches(
  [
    [
      [155, 292],
      [178, 280],
      [217, 286],
      [242, 299],
    ],
  ],
  5,
  { across: true, seed: 1999 },
);

function CanalHouse({
  x,
  y,
  scale = 1,
  tall = false,
  oriel = false,
  p,
}: {
  x: number;
  y: number;
  scale?: number;
  tall?: boolean;
  oriel?: boolean;
  p: EvercoldPigments;
}) {
  const patch = (
    d: string,
    color: string,
    bounds: EvercoldBounds,
    grain: EvercoldGrain = "cotton",
    edge = 0.9,
    crownX?: number,
  ) => (
    <EvercoldPatch
      d={d}
      color={color}
      bounds={bounds}
      grain={grain}
      edge={edge}
      crownX={crownX}
      p={p}
    />
  );
  const thread = (d: string, color: string, width = 1.2, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      width={width}
      shadow={mix(color, p.ink, 68)}
      highlight={mix(color, p.paper, 45)}
      relief={1.7}
      opacity={opacity}
    />
  );
  const peak = tall ? -43 : -32;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {patch(
        "M-19 3Q-1-3 19 2L22 17 19 39Q-1 47-22 39L-19 20Z",
        p.stoneSide,
        [-24, -5, 48, 52],
      )}
      {patch(
        "M10 2Q18 0 19 2L22 17 19 39 10 43Q15 22 10 2Z",
        p.stoneDeep,
        [8, -3, 16, 49],
        "cotton",
        0.45,
      )}
      {/* Curving ribs cradle the tall glazing, with no square timber grid. */}
      <path
        d="M-15 38V28Q-15 24-11 21Q-7 24-7 29V40ZM-3 40V28Q-2 24 2 21Q6 25 6 29V40ZM12 38V29Q12 25 16 23Q19 26 19 29V37Z"
        fill={p.recess}
      />
      <path
        d="M-13 37V28Q-13 26-11 24Q-9 26-9 29V38ZM-1 38V28Q0 26 2 24Q4 27 4 29V38ZM14 36V29L16 26 17 29V36Z"
        fill={p.window}
      />
      {thread(
        "M-12 28v9m2-10v10M0 29v8m2-10v10m1.4-7v7M15 29v6m1.2-5v5",
        p.window,
        1.05,
      )}
      {thread(
        "M-11 25v14M2 25v14M16 27v10M-14 32l6 1m7 0h6m9-1h4",
        p.stoneDeep,
        0.8,
      )}
      {thread(
        "M-18 18Q-15 22-17 40M-5 19Q-3 29-5 41M9 20Q8 32 9 42M21 19Q18 28 21 38",
        p.stoneLight,
        1.5,
      )}
      <EvercoldPatch
        d="M-23 39Q-2 47 22 39L21 44Q0 52-25 44Z"
        color={p.trim}
        bounds={[-27, 37, 51, 18]}
        grain="binding"
        stitches={houseCollar}
        edge={0.8}
        p={p}
      />
      {thread("M-21 44q4 3 8 2m4 1h7m5 0 7-2", p.stoneDeep, 0.85)}
      {patch(
        `M-27 7Q-15 3-9-12Q0-27 1 ${peak}Q7-16 17-9Q22-3 28 0L24 10Q12 19 1 14Q-14 21-27 7Z`,
        p.roof,
        [-29, peak - 2, 59, 22 - peak],
        "roof",
        1.1,
        1,
      )}
      {patch(
        `M1 ${peak}Q7-16 17-9Q22-3 28 0L24 10Q16 15 11 14Q12-7 1 ${peak}Z`,
        p.roofSide,
        [-1, peak - 2, 31, 21 - peak],
        "roof",
        0.45,
        1,
      )}
      {thread(
        `M-27 7Q-15 3-9-12Q0-27 1 ${peak}Q7-16 17-9Q22-3 28 0M-26 8Q-14 19 1 14Q12 19 26 5`,
        p.roofLight,
        1.5,
      )}
      {thread(
        `M1 ${peak - 5}V${peak}M-12 2Q-5-11-1-22M17 4Q11-7 7-14`,
        p.trim,
        0.9,
      )}
      {/* A second, scalloped eave casts a slim shadow over the glazed gallery. */}
      <EvercoldPatch
        d="M-22 15Q-9 12 1 19Q12 12 23 15L26 20Q13 17 2 25Q-8 17-24 22Z"
        color={p.roof}
        bounds={[-26, 10, 54, 18]}
        grain="binding"
        stitches={houseEave}
        edge={0.85}
        p={p}
      />
      {thread(
        "M-23 21Q-9 17 2 24Q13 17 25 20M-18 19l1 3m6-3v3m6-1v3m12-1v3m6-6v3m6-4v3",
        p.roofLight,
        1.05,
      )}
      {patch(
        "M-5 8Q-6-4 1-16Q9-5 9 8L2 12Z",
        p.stone,
        [-8, -18, 20, 32],
        "cotton",
        0.65,
      )}
      <path d="M-2 7Q-3-2 1-10Q6-2 6 7L2 9Z" fill={p.recess} />
      <path d="M0 6V-2L1-6 4-1V6L2 7Z" fill={p.window} />
      {thread("M1-2v8m1.4-5v5", p.window, 1.1)}
      {thread("M-7 7Q-7-4 1-17Q10-4 11 7M2-8V9M-2 2h7", p.trim, 0.85)}
      {thread("M-5 10q7 5 15 0M0-18l1-3 2 3", p.roofLight, 1.1)}
      {oriel && (
        <>
          {patch(
            "M-25 29Q-16 25-7 29L-8 46Q-17 51-24 45Z",
            p.stone,
            [-27, 23, 22, 30],
            "cotton",
            0.8,
          )}
          {patch(
            "M-29 30Q-21 24-16 17Q-14 24-5 28L-8 32Q-18 28-25 34Z",
            p.roof,
            [-31, 15, 28, 22],
            "roof",
            0.7,
            -16,
          )}
          <path
            d="M-21 44V35L-18 32-16 35V46ZM-13 45V35L-10 33V43Z"
            fill={p.window}
          />
          {thread("M-20 36v8m2-9v10m6-8v7", p.window, 1.05)}
          {thread(
            "M-29 30Q-21 24-16 17Q-14 24-5 28M-23 35v11m8-14v15m7-13v10M-24 46q7 5 15 0",
            p.trim,
            0.9,
          )}
        </>
      )}
    </g>
  );
}

/** Steep slate spires and open canal arcades, based on the revealed sheltered city. */
export function NookEvercoldCity({ isDark }: { isDark: boolean }) {
  const p = evercoldPigments(isDark);
  const patch = (
    d: string,
    color: string,
    bounds: EvercoldBounds,
    grain: EvercoldGrain = "cotton",
    edge = 1,
    slant = 0,
    crownX?: number,
  ) => (
    <EvercoldPatch
      d={d}
      color={color}
      bounds={bounds}
      grain={grain}
      edge={edge}
      slant={slant}
      crownX={crownX}
      p={p}
    />
  );
  const thread = (d: string, color: string, width = 1.3, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      width={width}
      shadow={mix(color, p.ink, 68)}
      highlight={mix(color, p.paper, 45)}
      relief={1.75}
      opacity={opacity}
    />
  );
  return (
    <g className="nook-evercold-city">
      {/* A lower arcade recedes into the pearl-lit center behind the nearer spire. */}
      {patch(
        "M163 249Q202 232 244 255V281H163ZM174 277V259Q181 245 188 259V277ZM195 276V254Q202 241 209 254V276ZM218 280V260Q225 247 232 260V280Z",
        p.stoneSide,
        [161, 230, 85, 54],
        "cotton",
        0.8,
      )}
      {thread(
        "M162 248Q202 232 245 255M169 251Q173 260 169 279M192 243Q196 259 192 277M213 247Q210 263 213 279M239 257Q235 267 239 283",
        p.stoneLight,
        1.35,
        0.8,
      )}
      {thread(
        "M173 248q4-5 8-2m4-5q4-3 8 0m4-1q4-2 8 1m5 1q4-1 8 3m5 2q4 0 8 4",
        p.trim,
        0.85,
        0.7,
      )}
      {patch(
        "M131 213Q152 208 174 214L177 245 172 263Q151 271 127 260L131 238Z",
        p.stone,
        [125, 206, 54, 67],
      )}
      {patch(
        "M163 212 174 214 177 245 172 263 162 267Q168 241 163 212Z",
        p.stoneSide,
        [160, 210, 19, 60],
        "cotton",
        0.5,
      )}
      {patch(
        "M119 211Q133 204 141 188L147 176H162Q170 201 188 210L182 218Q171 215 163 222L153 218 143 221Q131 213 121 217Z",
        p.roof,
        [117, 174, 73, 50],
        "roof",
        1.2,
        -1.5,
        155,
      )}
      {patch(
        "M159 176H162Q170 201 188 210L182 218Q171 215 163 222Q168 198 159 176Z",
        p.roofSide,
        [157, 174, 33, 50],
        "roof",
        0.6,
        2,
        159,
      )}
      {thread(
        "M119 211Q133 204 141 188L147 176H162Q170 201 188 210M121 217Q131 213 143 221L153 218 163 222Q171 215 182 218",
        p.roofLight,
        1.6,
      )}
      {thread(
        "M132 207Q143 194 147 183M172 207Q165 194 162 184M126 212q8-2 15 2m24 1q9-5 17-2",
        p.trim,
        0.9,
        0.9,
      )}
      <EvercoldPatch
        d="M130 209Q139 204 151 210Q165 206 178 210L181 214Q165 210 153 217Q140 210 126 215Z"
        color={p.roof}
        bounds={[124, 202, 59, 18]}
        grain="binding"
        stitches={spireEave}
        edge={0.75}
        p={p}
      />
      {thread(
        "M127 215Q140 210 153 217Q165 210 181 214M133 214v3m6-3v3m7-1v3m14-2v3m7-5v3m7-4v3",
        p.roofLight,
        0.9,
      )}

      {/* The narrow needle and its stepped slate collars stay above the window rail. */}
      {patch(
        "M147 176Q155 172 163 176L165 193 160 201H150L145 193Z",
        p.stoneSide,
        [143, 170, 24, 34],
        "cotton",
        0.8,
      )}
      {patch(
        "M142 179Q150 172 152 159L155 149 159 164Q162 174 170 179L163 184 155 182 149 184Z",
        p.roof,
        [140, 147, 31, 39],
        "roof",
        1,
        0,
        155,
      )}
      {patch(
        "M155 149 159 164Q162 174 170 179L163 184Q162 170 155 149Z",
        p.roofSide,
        [153, 147, 18, 39],
        "roof",
        0.45,
        0,
        155,
      )}
      {thread(
        "M155 149v-6M148 173q8 3 15 0M143 179q13 5 26 0M148 184q7 3 15 0",
        p.roofLight,
        1.15,
      )}
      <path
        d="M149 194V188L152 184 155 188 158 184 161 188V194L155 198Z"
        fill={p.recess}
      />
      {thread("M152 188v6m6-6v6", p.window, 1.75)}
      {thread("M147 193q8 10 16 0M155 184v14M152 171h6", p.trim, 0.9)}
      {thread(
        "M135 207q3-5 2-14m-3 12q3-7 6 0M179 206q-3-5-2-14m-3 13q3-7 6-1",
        p.roofLight,
        1.35,
      )}
      {patch(
        "M146 210Q146 203 153 197Q160 203 160 210L153 214Z",
        p.stone,
        [144, 195, 18, 21],
        "cotton",
        0.65,
      )}
      <path
        d="M149 209Q149 204 153 200Q157 204 157 209L153 211Z"
        fill={p.window}
      />
      {thread("M151 205v4m1.4-6v7m1.4-7v7m1.4-5v4", p.window, 1.05)}
      {thread(
        "M144 210Q145 202 153 196Q161 202 162 210M153 201v10M149 207h8",
        p.trim,
        0.9,
      )}

      <path
        d="M137 249Q137 236 138 230Q139 223 144 219Q150 225 150 232V249ZM155 249V231Q156 224 160 221Q166 227 167 234L166 249Z"
        fill={p.recess}
      />
      <path
        d="M140 247V231Q141 226 144 223Q147 227 147 232V247ZM158 247V232Q158 229 161 226Q164 231 164 235V247Z"
        fill={p.window}
      />
      {thread(
        "M141 231v15m1.6-19v19m1.6-19v19m1.6-14v14M159 233v13m1.7-17v17m1.6-13v13",
        p.window,
        1.05,
      )}
      {thread(
        "M136 250Q134 229 144 217Q153 226 152 250M154 250Q152 233 160 219Q169 229 168 250",
        p.stoneLight,
        1.2,
      )}
      {thread("M144 225v22M161 228v19M140 238l7 1m11-1 6 1", p.stoneDeep, 0.9)}
      {thread(
        "M132 222Q138 239 130 256M173 222Q167 240 176 255M132 251q21 8 43 0",
        p.trim,
        1.4,
      )}
      <EvercoldPatch
        d="M126 255Q152 263 180 255V262Q153 271 126 263Z"
        color={p.trim}
        bounds={[124, 253, 58, 20]}
        grain="binding"
        stitches={spireCollar}
        edge={1}
        p={p}
      />
      {thread(
        "M130 259q23 7 46 0M136 259v5m8-3v5m9-4v5m9-5v5m9-7v5",
        p.stoneSide,
        0.85,
      )}
      {thread(
        "M133 253q3 4 6 1m5 2q3 3 6 0m5 0q3 3 6-1m5-1q3 2 6-2",
        p.stoneLight,
        0.8,
      )}

      <CanalHouse x={99} y={261} scale={0.88} tall p={p} />
      <CanalHouse x={309} y={267} scale={1.03} oriel p={p} />
      <CanalHouse x={335} y={293} scale={0.6} tall p={p} />
      {patch(
        "M119 267Q149 262 181 267L184 297H119ZM137 297V282Q137 276 149 268Q161 276 161 282V297Z",
        p.stone,
        [117, 265, 66, 35],
        "cotton",
        1.1,
      )}
      {thread(
        "M135 298V282Q135 275 149 266Q163 275 163 282V298M124 271Q128 284 124 296M175 271Q171 284 175 296",
        p.stoneLight,
        1.55,
      )}
      {thread(
        "M130 294h4m-4-7h4m-2-8 4 1m0-8 4 3m3-9 3 4m7-4-2 4m9-1-3 4m9 1-4 3m6 4h-4m4 7h-4",
        p.trim,
        0.9,
        0.85,
      )}
      {patch(
        "M114 265H184L187 271H112Z",
        p.path,
        [110, 263, 79, 11],
        "binding",
        1.1,
      )}
      {thread("M115 272h70", p.stoneDeep, 1.5)}
      {thread(
        "M118 266v-6m11 6q-2-3 0-6m12 6q-2-3 0-6m12 6q2-3 0-6m12 6q2-3 0-6m12 6v-6M116 260q31 3 63 0",
        p.trim,
        1.1,
      )}

      {/* A curved open bridge crosses the vanishing point of the canal. */}
      {patch(
        "M161 290Q197 279 235 296L242 313H159ZM176 311V299Q185 283 194 299V311ZM205 314V302Q214 289 223 304V314Z",
        p.stoneSide,
        [157, 276, 87, 41],
        "cotton",
        1,
      )}
      <EvercoldPatch
        d="M158 288Q197 277 237 294L240 299Q197 283 157 294Z"
        color={p.path}
        bounds={[155, 275, 88, 27]}
        grain="binding"
        stitches={bridgeBinding}
        edge={1}
        p={p}
      />
      {thread(
        "M163 291v-8m11 6q-3-4 0-9m11 6q-3-4 0-9m11 7q-3-4 0-9m11 8q3-4 0-9m11 12q3-5 0-10m11 13v-9M163 283Q197 274 229 288",
        p.trim,
        1.05,
      )}
      {thread(
        "M175 311V298Q185 282 195 298V312M204 314V301Q214 287 224 303V314",
        p.stoneLight,
        1.25,
      )}
      {thread(
        "M170 302h4m0-9 4 2m4-8 1 4m7-3-1 4M202 302h3m3-9 2 3m7-4-1 4m8 0-3 3",
        p.trim,
        0.8,
        0.85,
      )}

      {/* Small terrace steps remain distinct from the long reflection seams. */}
      {patch(
        "M104 303H127L138 332H102Z",
        p.stoneSide,
        [100, 301, 40, 34],
        "cotton",
        0.8,
      )}
      {thread(
        "M104 307h24m-24 4h26m-26 4h28m-28 4h30m-30 4h32m-32 4h33",
        p.path,
        1.35,
      )}
      {thread("M102 303v28M128 303l12 29", p.trim, 2)}
      {patch(
        "M283 318H306L299 344H270Z",
        p.stoneSide,
        [268, 316, 41, 31],
        "cotton",
        0.8,
      )}
      {thread("M282 322h23m-24 4h23m-25 4h24m-25 4h24m-26 4h25", p.path, 1.3)}
      {thread("M281 318l-12 26M308 318l-7 26", p.trim, 1.8)}
      {thread("M119 288v-12M230 299v-12M304 308v-12", p.stoneDeep, 1.3)}
      {thread("M118 275h2M229 286h2M303 295h2", p.amberLight, 2.4)}
    </g>
  );
}
