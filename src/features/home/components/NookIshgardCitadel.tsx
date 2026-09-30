import { useId, useMemo } from "react";
import { NookThread } from "./NookThread";
import { ishgardPigments } from "./nookHeavenswardPigments";

type Pigments = ReturnType<typeof ishgardPigments>;
type PanelBounds = [number, number, number, number];
type Grain = "stone" | "roof" | "bridge";
const mix = (a: string, b: string, amount: number) =>
  `color-mix(in srgb, ${a} ${amount}%, ${b})`;
const n = (value: number) => value.toFixed(2);

// Each panel is sewn in its own coordinates: dense long-and-short cotton on
// rounded walls, silk fanning down each spire, and wraps across the bridge deck.
function panelStitches([x, y, w, h]: PanelBounds, grain: Grain) {
  const columns = Math.ceil(w / 1.4);
  return [0, 1].map((tone) =>
    Array.from({ length: columns + 1 }, (_, column) => {
      if (column % 2 !== tone) return "";
      const u = column / columns;
      const sx = x + u * w;
      if (grain === "roof") {
        const offset = (u - 0.5) * w;
        return `M${n(x + w / 2 + offset * 0.03)} ${n(y - 1)}C${n(x + w / 2 + offset * 0.12)} ${n(y + h * 0.39)} ${n(x + w / 2 + offset * 0.68)} ${n(y + h * 0.84)} ${n(sx)} ${n(y + h + 1)}`;
      }
      if (grain === "bridge") {
        const sy = y + u * (h - 12);
        return `M${n(sx)} ${n(sy - 2)}q-.7 6 .5 16`;
      }
      const bow = (0.5 - u) * Math.min(w * 0.18, 4);
      const length = 16 + (column % 3) * 2;
      const rows = Math.ceil(h / length) + 1;
      return Array.from({ length: rows }, (_, row) => {
        const sy = y + row * length - (column % 2) * length * 0.45;
        return `M${n(sx)} ${n(sy)}q${n(bow)} ${n(length * 0.48)} .15 ${n(length - 0.45)}`;
      }).join(" ");
    }).join(" "),
  );
}

function CitadelPatch({
  d,
  color,
  bounds: [x, y, w, h],
  grain,
  p,
}: {
  d: string;
  color: string;
  bounds: PanelBounds;
  grain: Grain;
  p: Pigments;
}) {
  const id = `${useId().replace(/:/g, "")}-ishgard-patch`;
  const stitches = useMemo(
    () => panelStitches([x, y, w, h], grain),
    [x, y, w, h, grain],
  );
  const gilt = color === p.gold;
  const shade = mix(color, p.ink, gilt ? 65 : 79);
  const light = gilt ? p.goldLight : mix(color, p.snow, 56);
  const edgeWidth = w < 10 ? 1.2 : 1.75;
  const paint = `url(#${id}-padding)`;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        <linearGradient id={`${id}-padding`} x1="0" y1=".1" x2="1" y2=".25">
          <stop stopColor={shade} />
          <stop offset=".19" stopColor={color} />
          <stop offset={gilt ? ".34" : ".3"} stopColor={light} />
          <stop offset=".57" stopColor={color} />
          <stop offset=".88" stopColor={shade} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <path d={d} fill={shade} transform="translate(.35 .65)" opacity=".48" />
      <path d={d} fill={paint} />
      <g clipPath={`url(#${id})`}>
        {stitches.map((path, tone) => (
          <NookThread
            key={tone}
            d={path}
            color={paint}
            shadow={shade}
            highlight={light}
            width={tone ? 1.17 : 1.25}
            dasharray={
              grain === "roof"
                ? tone
                  ? "9 .45 13 .55"
                  : "14 .5 8 .5"
                : undefined
            }
            relief={1.65}
          />
        ))}
      </g>
      <NookThread
        d={d}
        color={paint}
        shadow={shade}
        highlight={light}
        width={edgeWidth}
        relief={1.5}
      />
      <NookThread
        d={d}
        color={light}
        shadow={color}
        highlight={light}
        width={edgeWidth * 0.75}
        dasharray=".8 2.8"
        relief={1.1}
        opacity={0.65}
      />
    </g>
  );
}

/** Exterior massing follows the official Ishgard art: a needle-crowned city,
 * stacked tracery, and the Steps of Faith above a chasm. See SOURCES.md. */
export function NookIshgardCitadel({ isDark }: { isDark: boolean }) {
  const id = `${useId().replace(/:/g, "")}-citadel`;
  const p = ishgardPigments(isDark);
  const thread = (d: string, color: string, width = 1, opacity = 1) => (
    <NookThread
      d={d}
      color={color}
      shadow={mix(color, p.ink, 68)}
      highlight={mix(color, p.snow, 45)}
      width={width}
      opacity={opacity}
      relief={1.6}
    />
  );
  const fabric = (
    d: string,
    color: string,
    bounds: PanelBounds,
    grain: Grain = "stone",
  ) => <CitadelPatch d={d} color={color} bounds={bounds} grain={grain} p={p} />;
  const pointed = (x: number, y: number, width: number, height: number) =>
    `M${x} ${y + height}V${y + width * 0.8}Q${x} ${y + width * 0.35} ${x + width / 2} ${y}Q${x + width} ${y + width * 0.35} ${x + width} ${y + width * 0.8}V${y + height}Z`;
  const lancet = (x: number, y: number, w: number, h: number, lit = true) => (
    <g key={`${x}-${y}`}>
      <path d={pointed(x, y, w, h)} fill={`url(#${id}-pane)`} />
      <path
        d={pointed(x + w * 0.28, y + 2, w * 0.44, h - 3)}
        fill={lit ? p.window : p.shadow}
      />
      {thread(
        `M${x + w * 0.44} ${y + 4}q-.35 ${(h - 5) * 0.5} .1 ${h - 5}`,
        lit ? p.window : p.shadow,
        Math.min(w * 0.22, 1.2),
      )}
      {thread(pointed(x, y, w, h), p.light, w < 5 ? 1.05 : 1.45)}
      <NookThread
        d={pointed(x, y, w, h)}
        color={p.stone}
        shadow={p.shadow}
        highlight={p.light}
        width={w < 5 ? 0.7 : 1}
        dasharray=".6 2"
        relief={1.2}
        opacity={0.8}
      />
      {h > 12 && thread(`M${x} ${y + h * 0.65}q${w / 2} .3 ${w} 0`, p.stone, 1)}
    </g>
  );
  const turret = (
    x: number,
    tip: number,
    shoulder: number,
    bottom: number,
    w: number,
    gilded = true,
  ) => {
    const roof = `M${x - w / 2 - 1} ${shoulder}Q${x - w / 3} ${shoulder - 7} ${x - 1.4} ${tip + 11}L${x} ${tip}L${x + 1.4} ${tip + 11}Q${x + w / 3} ${shoulder - 7} ${x + w / 2 + 1} ${shoulder}Z`;
    const body = `M${x - w / 2} ${shoulder}H${x + w / 2}V${bottom}L${x} ${bottom + 3}L${x - w / 2} ${bottom}Z`;
    return (
      <g key={`${x}-${tip}`}>
        {fabric(body, p.stone, [x - w / 2, shoulder, w, bottom - shoulder + 3])}
        <path
          d={`M${x} ${shoulder}h${w / 2}V${bottom}l${-w / 2} 3Z`}
          fill={p.shadow}
          opacity=".16"
        />
        {fabric(
          roof,
          gilded ? p.gold : p.roof,
          [x - w / 2 - 1, tip, w + 2, shoulder - tip],
          "roof",
        )}
        {thread(
          `M${x} ${tip + 2}Q${x - 0.7} ${shoulder - 12} ${x - w / 2 + 1} ${shoulder - 1}`,
          gilded ? p.goldLight : p.snow,
          0.8,
        )}
        {thread(
          `M${x - w / 2 - 1} ${shoulder + 1}h${w + 2}M${x - w / 2} ${bottom - 3}q${w / 2} 3 ${w} 0`,
          p.light,
          1.1,
        )}
        {Array.from(
          { length: Math.floor((bottom - shoulder - 5) / 20) },
          (_, row) => lancet(x - 1.8, shoulder + 7 + row * 20, 3.6, 9),
        )}
      </g>
    );
  };
  const medallion = (x: number, y: number, radius: number) => (
    <g>
      <circle cx={x} cy={y} r={radius + 2} fill={`url(#${id}-rosette)`} />
      {thread(
        Array.from({ length: 32 }, (_, stitch) => {
          const angle = (stitch / 32) * Math.PI * 2;
          const sx = x + Math.cos(angle) * (radius - 1);
          const sy = y + Math.sin(angle) * (radius - 1);
          return `M${sx} ${sy}q${Math.cos(angle + 0.14) * 1.2} ${Math.sin(angle + 0.14) * 1.2} ${Math.cos(angle) * 3} ${Math.sin(angle) * 3}`;
        }).join(" "),
        p.light,
        1.2,
      )}
      <circle cx={x} cy={y} r={radius - 0.2} fill={`url(#${id}-pane)`} />
      {thread(
        `M${x + radius} ${y}a${radius} ${radius} 0 1 1 ${-2 * radius} 0a${radius} ${radius} 0 1 1 ${2 * radius} 0`,
        p.gold,
        1.3,
      )}
      {thread(
        `M${x} ${y - radius}v${radius * 2}M${x - radius} ${y}h${radius * 2}M${x - radius * 0.7} ${y - radius * 0.7}l${radius * 1.4} ${radius * 1.4}m${-radius * 1.4} 0l${radius * 1.4} ${-radius * 1.4}`,
        p.goldLight,
        0.85,
      )}
      {thread(
        `M${x - 0.7} ${y}q-.8-1.5 .8-1.4q1.8 .2 .8 1.7q-1.6 1.4-1.6-.3`,
        p.window,
        1.4,
      )}
    </g>
  );
  const flyingButtress = (x: number, y: number, direction: number) => {
    const path = `M${x} ${y}q${direction * 16} 2 ${direction * 20} 22v37l${direction * 5} 8v-49q${-direction * 3}-23 ${-direction * 25}-25Z`;
    return (
      <g key={`${x}-${y}`}>
        {fabric(path, p.stone, [
          Math.min(x, x + direction * 25),
          y - 7,
          25,
          74,
        ])}
        {thread(
          `M${x} ${y - 6}q${direction * 25} 5 ${direction * 25} 30v22`,
          p.light,
          1.3,
        )}
        {thread(`M${x + direction * 20} ${y + 12}v-14`, p.gold, 0.9)}
      </g>
    );
  };

  return (
    <g
      className="nook-ishgard-citadel"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id={`${id}-pane`} x2=".8" y2="1">
          <stop stopColor={p.ink} />
          <stop offset=".5" stopColor={p.deep} />
          <stop offset="1" stopColor={p.shadow} />
        </linearGradient>
        <radialGradient id={`${id}-rosette`} cx=".3" cy=".3" r=".85">
          <stop stopColor={p.light} />
          <stop offset=".65" stopColor={p.stone} />
          <stop offset="1" stopColor={p.shadow} />
        </radialGradient>
      </defs>

      {/* A sheer foundation, with its ribs disappearing far below the bridge. */}
      {fabric(
        "M96 437 102 338 112 310 120 273 199 257 218 308 216 356 228 417 234 437Z",
        p.shadow,
        [96, 257, 138, 180],
      )}
      <path
        d="m106 437 12-106 11-16-5 95 16-31 5-66 10-17 8 92 11-34 9-57 12 112 6 18Z"
        fill={p.deep}
        opacity=".4"
      />
      {thread(
        "M115 349 109 419M129 344 125 379M153 363l5 45M191 366l6 52M208 367l7 43",
        p.stone,
        1.2,
      )}

      {/* Many unequal pinnacles merge into one steep, mountainous silhouette. */}
      {turret(119, 161, 194, 315, 9, false)}
      {turret(137, 114, 156, 282, 13)}
      {turret(183, 102, 147, 282, 13)}
      {turret(206, 137, 174, 316, 12)}
      {turret(224, 194, 222, 330, 8, false)}
      {fabric(
        "M107 358V232l12-10v-33l15-8v-27l12-5v-16l17-8 26 14 11 38 14 9v43l17 9v128l-35 24-57-9Z",
        p.stone,
        [107, 125, 124, 265],
      )}
      {fabric(
        "M107 358V232l12-10v-33l15-8v-27l12-5v160l-11 56Z",
        p.shadow,
        [107, 149, 39, 216],
      )}
      {fabric(
        "M190 155 200 177l14 9v43l17 9v128l-35 24Z",
        p.shadow,
        [190, 155, 41, 235],
      )}

      {/* The central needle is narrow, curved at its foot, and banded in gold. */}
      {fabric(
        "M144 155Q155 139 159 109L164 78 169 111Q174 140 184 155Z",
        p.gold,
        [144, 78, 40, 77],
        "roof",
      )}
      {thread(
        "M164 81 162 112Q160 137 149 154M164 105l3 20 10 26M156 132h15M153 142h23",
        p.goldLight,
        1.1,
      )}
      {fabric(
        "M145 157 164 150 184 157v44l-20 8-19-8Z",
        p.light,
        [145, 150, 39, 59],
      )}
      {fabric("M164 150 184 157v44l-20 8Z", p.stone, [164, 150, 20, 59])}
      {thread("M144 159q20 9 41 0M146 197q18 8 37 0", p.gold, 1.6)}
      {lancet(149, 166, 6, 24)}
      {lancet(160, 161, 7, 28)}
      {lancet(173, 166, 6, 24)}
      {turret(144, 123, 149, 213, 6)}
      {turret(185, 119, 148, 212, 6)}
      {turret(153, 109, 137, 165, 4.5)}
      {turret(175, 106, 136, 165, 4.5)}
      {turret(130, 155, 184, 227, 7)}
      {turret(195, 143, 176, 228, 8)}

      {/* Stacked curved façades and dark Gothic recesses replace a chapel gable. */}
      {fabric(
        "M141 210Q163 194 187 210L193 256Q170 272 142 258Z",
        p.light,
        [141, 202, 52, 64],
      )}
      {fabric("M166 202q12 0 21 8l6 46-25 10Z", p.stone, [166, 202, 27, 64])}
      {thread("M140 211q25-15 48 0M142 258q25 11 50-2", p.gold, 1.3)}
      {fabric(pointed(150, 209, 29, 44), p.deep, [150, 209, 29, 44])}
      {thread(pointed(150, 209, 29, 44), p.gold, 1.8)}
      {thread("M151 251v-25q0-8 13-16 13 8 13 16v25", p.light, 1.2)}
      {lancet(154, 222, 6, 27)}
      {lancet(163, 215, 6, 34)}
      {lancet(171, 224, 4, 25, false)}
      {medallion(165, 205, 6.5)}
      {thread("M141 215v39M184 217l5 33", p.light, 2.2)}
      {flyingButtress(141, 215, -1)}
      {flyingButtress(188, 215, 1)}
      {turret(115, 211, 234, 306, 6, false)}
      {turret(214, 208, 233, 315, 7)}

      {fabric(
        "M140 273Q170 258 199 272V333Q169 350 138 334Z",
        p.stone,
        [138, 264, 61, 80],
      )}
      <path d="M179 266q11 0 20 6v61l-20 11Z" fill={p.shadow} opacity=".2" />
      {thread("M140 274q29-13 59-1M138 333q30 12 61 0", p.light, 2)}
      {medallion(166, 274, 8)}
      {fabric(pointed(154, 288, 25, 47), p.deep, [154, 288, 25, 47])}
      {thread(pointed(154, 288, 25, 47), p.light, 2)}
      {thread("M157 331v-25q0-8 9-14 10 6 10 14v25M166 294v39", p.gold, 1.2)}
      {lancet(143, 292, 5, 25)}
      {lancet(185, 289, 5, 26)}
      {flyingButtress(139, 274, -1)}
      {flyingButtress(198, 271, 1)}
      {turret(130, 242, 267, 350, 7, false)}
      {turret(203, 253, 279, 364, 9, false)}

      {/* Thin supporting columns, repeated arcades, and projecting balconies. */}
      {[112, 124, 136, 197, 212, 226].map((x, index) => (
        <g key={x}>
          {thread(
            `M${x} ${250 + (index % 3) * 12}V${379 + index * 4}`,
            index < 3 ? p.stone : p.light,
            1.9,
          )}
          {lancet(x + 2, 314 + (index % 3) * 9, 4, 21, index % 2 === 0)}
          {lancet(x + 2, 351 + (index % 3) * 9, 4, 26, false)}
        </g>
      ))}
      {thread(
        "M112 297q18 7 28 0M107 345q18 7 30 2M203 313q13 4 25-1M207 345q14 2 23-4",
        p.snow,
        1.6,
      )}
      {fabric(
        "M140 348Q170 338 194 347V408h-54Z",
        p.shadow,
        [140, 342, 54, 66],
      )}
      {fabric(pointed(152, 350, 27, 60), p.deep, [152, 350, 27, 60])}
      {thread(pointed(152, 350, 27, 60), p.stone, 2)}
      {thread("M155 408v-41q0-8 11-13 10 6 10 13v41M166 357v53", p.light, 1.1)}

      {/* The Steps of Faith recede to a gatehouse on the right. Its voids show
          the cloud bank behind, rather than making a solid wall across it. */}
      {fabric(
        "M208 294 340 348v81h-8v-55q0-11-10-20-10 2-10 14v62h-9v-67q0-14-12-22-11 3-11 16v77h-10v-84q0-16-13-23-12 4-12 18v93h-11v-99q0-19-14-26-7 1-12 12Z",
        p.shadow,
        [208, 294, 132, 143],
      )}
      {thread(
        "M219 312q18 5 20 28v72M252 327q21 8 23 28v63M287 342q20 8 20 26v50M320 356q17 11 17 22v42",
        p.stone,
        1.8,
      )}
      {fabric(
        "M207 284 343 340v12l-136-54Z",
        p.stone,
        [207, 284, 136, 68],
        "bridge",
      )}
      {thread("M207 283 343 339M208 296 342 349", p.light, 2.1)}
      {thread("M207 285 343 341", p.snow, 1.2)}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = 214 + i * 16;
        const y = 287 + i * 6.55;
        return (
          <g key={i}>
            <path
              d={`M${x} ${y}v-9l1-5 1 5v10`}
              stroke={p.ink}
              strokeWidth="1"
            />
            {thread(`M${x + 1} ${y - 11}v11`, p.gold, 0.7)}
          </g>
        );
      })}
      {fabric("M280 327v-29l9-9 17 7v42l-14 5Z", p.stone, [280, 289, 26, 54])}
      {fabric("M289 289v-12l7-6 10 8v17Z", p.shadow, [289, 271, 17, 25])}
      {turret(296, 250, 278, 294, 10, false)}
      {lancet(287, 304, 8, 20)}
      {thread("M281 302 292 297l14 5M280 328l12 8 14-4", p.snow, 1.3)}
      {turret(279, 283, 300, 326, 4)}
      {turret(309, 290, 306, 339, 4)}
    </g>
  );
}
