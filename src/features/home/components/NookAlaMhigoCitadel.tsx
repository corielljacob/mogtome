import { useId, useMemo } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";
import { stormbloodPigments } from "./nookStormbloodPigments";

type Pigments = ReturnType<typeof stormbloodPigments>;
type Bounds = [number, number, number, number];
type Grain = "stone" | "satin" | "roof" | "strata" | "water";
const n = (value: number) => value.toFixed(2);
const mix = (a: string, b: string, amount: number) =>
  `color-mix(in srgb, ${a} ${amount}%, ${b})`;

function panelStitches([x, y, w, h]: Bounds, grain: Grain, slant: number) {
  const bundles: string[][] = [[], [], []];
  const entries: string[] = [];
  if (grain === "strata" || grain === "water" || grain === "satin") {
    const pitch = grain === "water" ? 2.6 : 1.85;
    const courseY = (sx: number, sy: number) =>
      sy +
      Math.sin((sx - x) / 32 + (sy - y) / 27) *
        (grain === "strata" ? 1.6 : grain === "water" ? 0.65 : 0.3);
    for (let row = 0; row < Math.ceil(h / pitch) + 5; row++) {
      const sy = y - 4 + row * pitch;
      let sx = x - 14 + threadVariation(row, 610) * 10;
      for (let col = 0; sx < x + w + 2; col++) {
        const index = row * 101 + col;
        const length =
          grain === "satin"
            ? w + 4
            : (grain === "water" ? 24 : 15) + threadVariation(index, 611) * 5;
        if (grain === "satin") sx = x - 2;
        const start = courseY(sx, sy) + threadVariation(index, 612) * 0.22;
        const end = courseY(sx + length, sy) + slant;
        const tone = Math.min(
          2,
          Math.floor((threadVariation(index, 613) + 1) * 1.5),
        );
        bundles[tone].push(
          `M${n(sx)} ${n(start)}Q${n(sx + length * 0.48)} ${n((start + end) / 2 - 0.65)} ${n(sx + length)} ${n(end)}`,
        );
        if (grain !== "satin" && threadVariation(index, 614) > 0.35) {
          entries.push(`M${n(sx - 0.15)} ${n(start + 0.4)}l.2 .15`);
        }
        sx += length + 0.95 + threadVariation(index, 615) * 0.35;
      }
    }
  } else {
    const columns = Math.ceil(w / 1.65) + 2;
    for (let col = 0; col < columns; col++) {
      const u = col / (columns - 1);
      const sx = x - 0.5 + u * (w + 1) + threadVariation(col, 616) * 0.17;
      if (grain === "roof") {
        const offset = (u - 0.5) * w;
        bundles[col % 3].push(
          `M${n(x + w * 0.5 + offset * 0.04)} ${y - 1}C${n(x + w * 0.5 + offset * 0.18)} ${n(y + h * 0.35)} ${n(x + w * 0.5 + offset * 0.7)} ${n(y + h * 0.82)} ${n(sx)} ${y + h + 1}`,
        );
      } else {
        for (let row = 0; row < Math.ceil(h / 9) + 2; row++) {
          const index = col * 100 + row;
          const sy =
            y -
            9 +
            row * 9 +
            (col % 3) * 2.9 +
            threadVariation(index, 619) * 0.3;
          const length = 7.9 + threadVariation(index, 617) * 0.65;
          const bow =
            (0.5 - u) * Math.min(w * 0.13, 3.6) +
            threadVariation(index, 618) * 0.3;
          bundles[col % 3].push(
            `M${n(sx + ((sy - y) / h) * slant)} ${n(sy)}q${n(bow + slant * 0.15)} ${n(length * 0.5)} ${n(0.15 + (slant * length) / h)} ${n(length)}`,
          );
        }
      }
    }
  }
  return {
    bundles: bundles.map((bundle) => bundle.join(" ")),
    entries: entries.join(" "),
  };
}

/** Sandstone, cliff, and roof pieces share the room's dense padded needlework. */
export function StormbloodPatch({
  d,
  color,
  bounds,
  p,
  grain = "stone",
  edge = 1.65,
  binding = 0.76,
  raised = true,
  slant = 0,
}: {
  d: string;
  color: string;
  bounds: Bounds;
  p: Pigments;
  grain?: Grain;
  edge?: number;
  binding?: number;
  raised?: boolean;
  slant?: number;
}) {
  const id = `${useId().replace(/:/g, "")}-gyr-abania-patch`;
  const [x, y, w, h] = bounds;
  const stitches = useMemo(
    () => panelStitches([x, y, w, h], grain, slant),
    [x, y, w, h, grain, slant],
  );
  const shade = mix(color, p.ink, raised ? 54 : 77);
  const light = mix(color, p.paper, raised ? 52 : 74);
  const dyed = mix(color, p.ink, raised ? 86 : 94);
  const paint = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        <linearGradient
          id={`${id}-padding`}
          gradientUnits="userSpaceOnUse"
          x1={x}
          y1={y + h * 0.15}
          x2={x + w}
          y2={y + h * 0.4}
        >
          <stop stopColor={shade} />
          <stop offset=".18" stopColor={color} />
          <stop offset=".34" stopColor={light} />
          <stop offset=".68" stopColor={color} />
          <stop offset="1" stopColor={shade} />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill={p.ink}
        transform={raised ? "translate(.7 1.15)" : "translate(.3 .5)"}
        opacity={raised ? ".55" : ".3"}
      />
      <path d={d} fill={paint} />
      <g clipPath={`url(#${id})`}>
        {stitches.bundles.map((path, tone) => (
          <NookThread
            key={tone}
            d={path}
            color={tone === 1 ? color : tone === 2 ? dyed : paint}
            shadow={shade}
            highlight={light}
            width={grain === "water" ? 1.65 : tone === 1 ? 1.35 : 1.5}
            relief={raised ? 1.95 : 1.25}
            dasharray={
              grain === "roof"
                ? tone
                  ? "11 .65 7 .5"
                  : "7 .5 14 .7"
                : undefined
            }
          />
        ))}
        <path
          d={stitches.entries}
          fill="none"
          stroke={shade}
          strokeWidth=".65"
          strokeLinecap="round"
          opacity=".48"
        />
      </g>
      {edge > 0 && (
        <>
          <NookThread
            d={d}
            color={paint}
            shadow={shade}
            highlight={light}
            width={edge * (raised ? 1.2 : 1)}
            relief={raised ? 1.8 : 1.3}
          />
          <NookThread
            d={d}
            color={light}
            shadow={shade}
            highlight={light}
            width={edge * 0.8}
            dasharray=".85 2.3 .65 2.7"
            relief={1.1}
            opacity={binding}
          />
        </>
      )}
    </g>
  );
}

/** Ala Mhigo's broad ramparts and stepped palace rise from the living red rock. */
export function NookAlaMhigoCitadel({ isDark }: { isDark: boolean }) {
  const p = stormbloodPigments(isDark);
  const thread = (d: string, color = p.light, width = 1.25, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow={p.deep}
      highlight={mix(color, p.paper, 67)}
      width={width}
      relief={1.5}
      opacity={opacity}
    />
  );
  const patch = (
    d: string,
    color: string,
    bounds: Bounds,
    grain: Grain = "stone",
    edge = 1.5,
  ) => (
    <StormbloodPatch
      d={d}
      color={color}
      bounds={bounds}
      grain={grain}
      p={p}
      edge={edge}
      binding={0.76}
    />
  );
  const arch = (x: number, y: number, w: number, h: number) =>
    `M${x} ${y + h}V${y + w * 0.6}Q${x} ${y + 3} ${x + w * 0.5} ${y}Q${x + w} ${y + 3} ${x + w} ${y + w * 0.6}V${y + h}Z`;
  const window = (x: number, y: number, w = 3.4, h = 9) => (
    <g key={`${x}-${y}`}>
      <path d={arch(x, y, w, h)} fill={p.recess} />
      {thread(
        `M${x + w * 0.5} ${y + 3}v${h - 4}`,
        p.window,
        Math.min(1.3, w * 0.3),
      )}
      {thread(arch(x, y, w, h), p.trim, 0.65, 0.8)}
    </g>
  );
  const turret = (
    x: number,
    tip: number,
    shoulder: number,
    base: number,
    w: number,
  ) => (
    <g key={`${x}-${tip}`}>
      <path
        d={`M${x + w * 0.25} ${shoulder + 3}l${w * 0.63} 4V${base + 2}l${-w * 0.63} -3Z`}
        fill={p.recess}
        opacity=".48"
      />
      {patch(
        `M${x - w * 0.5} ${shoulder}H${x + w * 0.5}V${base}H${x - w * 0.5}Z`,
        p.tower,
        [x - w * 0.5, shoulder, w, base - shoulder],
        "satin",
      )}
      {patch(
        `M${x + w * 0.12} ${shoulder}h${w * 0.38}V${base}h${-w * 0.38}Z`,
        p.towerSide,
        [x + w * 0.12, shoulder, w * 0.38, base - shoulder],
        "satin",
        0,
      )}
      {thread(`M${x - w * 0.37} ${shoulder + 6}V${base - 2}`, p.tower, 0.8)}
      {patch(
        `M${x - w * 0.62} ${shoulder}Q${x - w * 0.23} ${shoulder - 10} ${x} ${tip}Q${x + w * 0.23} ${shoulder - 10} ${x + w * 0.62} ${shoulder}Z`,
        p.roofLit,
        [x - w * 0.62, tip, w * 1.24, shoulder - tip],
        "roof",
      )}
      {patch(
        `M${x} ${tip}Q${x + w * 0.23} ${shoulder - 10} ${x + w * 0.62} ${shoulder}H${x + 0.4}Z`,
        p.roofShade,
        [x, tip, w * 0.62, shoulder - tip],
        "roof",
        0,
      )}
      <path
        d={`M${x - w * 0.5} ${shoulder + 2}h${w}v3h${-w}Z`}
        fill={p.recess}
        opacity=".5"
      />
      {thread(
        `M${x} ${tip}v-5M${x - w * 0.66} ${shoulder + 1}h${w * 1.32}m${-w * 1.22} 4h${w * 1.12}`,
        p.roofLit,
        1.05,
      )}
      {base - shoulder > 17 && window(x - 1.5, shoulder + 8, 3, 9)}
    </g>
  );
  const griffin = (x: number, y: number, mirrored = false) => (
    <g transform={`translate(${x} ${y}) scale(${mirrored ? -1 : 1} 1)`}>
      <path
        d="M-4 0 4 0 3-4 1-6 2-11 6-13 3-15-1-14-3-10-5-13-8-14-7-8-4-5Z"
        fill={p.deep}
      />
      {thread(
        "M-3-1v-6l-3-5m4 7 2-7 3-1M-5-9l4 3m-4-1 4 3M0-1l1-4",
        p.light,
        0.85,
      )}
      {thread("M-5 1H5", p.copper, 1.9)}
    </g>
  );
  return (
    <g
      className="nook-ala-mhigo-citadel"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The royal palace ascends in broad stacked terraces, never a cathedral spire. */}
      {patch(
        "M127 163V137H143V122H157V110H183V121H198V137H213V163Z",
        p.palace,
        [127, 110, 86, 53],
      )}
      {patch(
        "M139 138V128H155V116H186V128H202V138Z",
        p.gate,
        [139, 116, 63, 22],
      )}
      {patch(
        "M155 117 163 108H179L187 117Z",
        p.roofLit,
        [155, 108, 32, 9],
        "strata",
      )}
      {patch("M163 109V100H178V109Z", p.palace, [163, 100, 15, 9])}
      {patch(
        "M183 111V124H198V139H213V163H203V142H191V129H180V118Z",
        p.terrace,
        [180, 111, 33, 52],
        "stone",
        0,
      )}
      <path
        d="M155 117H187V121H155ZM139 137H202V142H139ZM128 155H212V161H128Z"
        fill={p.wallShade}
        opacity=".67"
      />
      {thread(
        "M160 110h21M145 124h52M139 137h63M129 155h83M171 100v-9m-2 3h4",
        p.palace,
        1.7,
      )}
      {[149, 158, 167, 176, 185, 194].map((x) => window(x, 143, 3.5, 10))}
      {window(168, 101, 4, 7)}
      {turret(137, 118, 141, 171, 9)}
      {turret(205, 121, 144, 173, 9)}

      {/* Tall buttressed walls are attached to the cliffs instead of floating above them. */}
      {patch(
        "M92 166 112 151H220V247L202 270H92Z",
        p.facade,
        [92, 151, 128, 119],
      )}
      {patch("M263 159H291L305 174V261H263Z", p.facade, [263, 159, 42, 102])}
      {patch(
        "M291 160 305 174V261H291Z",
        p.wallShade,
        [291, 160, 14, 101],
        "stone",
        0,
      )}
      {/* Each padded bay has its own grain and a little seam between panels. */}
      {[113, 130, 147, 164, 181, 198].map((x, index) => (
        <StormbloodPatch
          key={x}
          d={`M${x} 164q7-1 14 0v58h-14Z`}
          color={index % 2 ? p.facade : mix(p.facade, p.terrace, 86)}
          bounds={[x, 163, 14, 60]}
          p={p}
          slant={index % 2 ? -1.8 : 1.8}
          edge={0.65}
          binding={0.48}
        />
      ))}
      <path
        d="M111 161H215V167H111ZM109 222H216V229H109ZM94 238H217V243H94ZM266 171H299V177H266Z"
        fill={p.recess}
        opacity=".43"
      />
      {[119, 136, 153, 170, 187, 204].map((x) => (
        <g key={x}>
          {thread(
            `M${x} 168v51m-2-51h4M${x - 5} 175q5-7 10 0`,
            p.trim,
            0.8,
            0.72,
          )}
          {window(x - 1.5, 181, 3.4, 15)}
          {window(x - 1.5, 203, 3.4, 9)}
        </g>
      ))}
      {thread(
        "M97 158H219M110 223H216M94 238H217M266 171h33m-33 47h35",
        p.terrace,
        1.65,
      )}
      {thread("M99 157h119M266 167h27", p.terrace, 1.65)}
      {Array.from({ length: 22 }, (_, index) => (
        <g key={index}>
          {thread(`M${97 + index * 5.5} 152v5`, p.trim, 0.85, 0.8)}
        </g>
      ))}
      {turret(103, 123, 155, 245, 12)}
      {turret(127, 114, 152, 239, 11)}
      {turret(211, 126, 158, 250, 12)}
      {turret(284, 129, 165, 251, 12)}
      {turret(305, 154, 180, 271, 10)}

      {/* Two small griffins guard the deep royal gateway; crimson pennants hang below. */}
      <path
        d="M267 165 274 170V252L265 271 260 269Z"
        fill={p.recess}
        opacity=".5"
      />
      {patch("M221 162H269V250L260 269H223Z", p.gate, [221, 162, 48, 107])}
      {patch(
        "M258 168 269 162V250L260 269 256 249Z",
        p.gateSide,
        [256, 162, 13, 107],
        "stone",
        0,
      )}
      <path d="M221 166H269V171H221Z" fill={p.wallShade} opacity=".55" />
      {patch(arch(233, 172, 23, 58), p.recess, [233, 172, 23, 58], "stone", 0)}
      {patch(
        "M233 230V186Q233 176 244.5 172L247 178Q240 181 239 188V230Z",
        p.gateSide,
        [233, 172, 14, 58],
        "satin",
        0,
      )}
      {patch(arch(240, 179, 13, 48), p.recess, [240, 179, 13, 48], "stone", 0)}
      {thread(arch(233, 172, 23, 58), p.gate, 2.4)}
      {thread(
        "M231 230V185Q231 173 244.5 168Q258 173 258 185V230",
        p.tower,
        1.2,
      )}
      <NookThread
        d="M231 229V185Q231 173 244.5 168Q258 173 258 185V229"
        color={p.paper}
        shadow={p.gateSide}
        highlight={p.paper}
        width={1.25}
        dasharray=".8 2.4"
        opacity={0.8}
      />
      {thread("M244.5 192v33m-4-9h9", p.wallShade, 0.75, 0.7)}
      {[221, 267].map((x) => (
        <g key={x}>
          {patch(`M${x - 3} 164h6v67l-3 9-3-9Z`, p.gate, [x - 3, 164, 6, 76])}
          <path d={`M${x + 1} 169h2v62l-2 5Z`} fill={p.gateSide} opacity=".8" />
          {thread(`M${x - 4} 188h8m-8 4h8`, p.terrace, 1.25)}
          {patch(
            `M${x - 3.5} 194q3.5 1 7 0v19l-3.5-3-3.5 3Z`,
            p.flag,
            [x - 3.5, 194, 7, 19],
            "satin",
            0.7,
          )}
          <NookThread
            d={`M${x - 2.7} 196v15l2.7-2 2.7 2v-15`}
            color={p.copper}
            shadow={p.deep}
            highlight={p.paper}
            width={0.65}
            dasharray="1.2 1"
          />
          {thread(`M${x} 199v7m-1.5-5h3`, p.paper, 0.7)}
        </g>
      ))}
      {griffin(221, 161)}
      {griffin(267, 161, true)}
      {thread("M217 162h54M217 166h54", p.gate, 1.8)}

      {/* A descending approach and arcaded wall tie the gate into the lower city. */}
      {patch(
        "M231 229H256L264 241H224Z",
        p.stairTread,
        [224, 229, 40, 12],
        "strata",
      )}
      {patch(
        "M231 240H255L282 291H206Z",
        p.stairRiser,
        [206, 240, 76, 51],
        "strata",
      )}
      <path
        d="M255 241 261 242 288 291 282 294Z"
        fill={p.recess}
        opacity=".66"
      />
      {thread("M231 242 210 286", p.stairTread, 2.1)}
      {thread("M255 242l23 44", p.gateSide, 2.2)}
      {Array.from({ length: 10 }, (_, row) => {
        const y = 243 + row * 4.4;
        const left = 230 - row * 1.9;
        return (
          <g key={row}>
            <path
              d={`M${left} ${y + 1.4}h${26 + row * 4.1}l1.3 2.5H${left - 1.1}Z`}
              fill={p.recess}
              opacity=".47"
            />
            {thread(`M${left} ${y}h${26 + row * 4.1}`, p.stairTread, 1.65)}
          </g>
        );
      })}
      {patch(
        "M62 284Q167 274 217 287L218 309Q137 294 62 309Z",
        p.terrace,
        [62, 275, 156, 34],
        "strata",
      )}
      {[79, 102, 125, 148, 171, 194].map((x) => (
        <g key={x}>
          <path d={arch(x, 289, 11, 18)} fill={p.recess} />
          {thread(arch(x, 289, 11, 18), p.trim, 1.05)}
        </g>
      ))}
      <path
        d="M63 286Q152 277 216 291V295Q151 282 63 291Z"
        fill={p.recess}
        opacity=".48"
      />
      {thread("M64 283q89-10 149 3", p.stairTread, 2.1)}
      {patch("M210 288H284V305H210Z", p.terrace, [210, 288, 74, 17], "strata")}
      <path d="M211 300H284V305H211Z" fill={p.wallShade} opacity=".75" />
      {thread("M207 288h80M213 300h69", p.stairTread, 1.6)}
    </g>
  );
}
