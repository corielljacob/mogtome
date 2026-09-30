import { useId } from "react";
import { NookThread } from "./NookThread";

// Broad, nearly touching floss reads as embroidery at the window's small size.
const stoneThreads = Array.from({ length: 79 }, (_, row) => {
  const y = 113 + row * 2.85;
  return Array.from({ length: 14 }, (_, column) => {
    const x = 36 + column * 13 + (row % 2) * 6.5;
    return `M${x} ${y}q5 -.45 ${11.4 + ((row + column) % 3) * 0.4} -.2`;
  }).join(" ");
}).join(" ");
// Laid satin bundles turn with the perspective and end in staggered courses.
const roofPoint = (u: number, v: number) => [
  88 + 63 * u + v * (-46 + 6 * u),
  176 - 5 * u + v * (51 + 18 * u),
];
const slateThreads = [0, 1, 2].map((tone) =>
  Array.from({ length: 21 }, (_, column) => {
    const u = column / 20;
    return Array.from({ length: 5 }, (_, row) => {
      if ((column + row * 2) % 3 !== tone) return "";
      const v = (row + (column % 2) * 0.42) / 4;
      const start = roofPoint(u, v - 0.075);
      const middle = roofPoint(u - 0.006, v + 0.065);
      const end = roofPoint(u, v + 0.155);
      return `M${start.join(" ")}Q${middle.join(" ")} ${end.join(" ")}`;
    }).join(" ");
  }).join(" "),
);
const gableWraps = [
  ...Array.from({ length: 23 }, (_, i) => {
    const t = i / 22;
    return `M${105 + 45 * t} ${240 - 69 * t}l5.1 3.9`;
  }),
  ...Array.from({ length: 26 }, (_, i) => {
    const t = i / 25;
    return `M${151 + 63 * t} ${173 + 62 * t}l-3.9 5.2`;
  }),
].join(" ");

interface NookNeighbourHouseProps {
  isDark: boolean;
}

function PointedWindow({
  x,
  y,
  width,
  height,
  isDark,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  isDark: boolean;
}) {
  const paneId = `${useId().replace(/:/g, "")}-pane`;
  const middle = width / 2;
  const spring = width * 0.58;
  const arch = `M0 ${height}V${spring}Q0 ${width * 0.25} ${middle} 0Q${width} ${width * 0.25} ${width} ${spring}V${height}Z`;

  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={paneId}>
          <path d={arch} />
        </clipPath>
      </defs>
      <path
        d={arch}
        fill="var(--scene-rock)"
        stroke="var(--scene-rock-light)"
        strokeWidth="4"
      />
      <path
        d={arch}
        fill="color-mix(in srgb, var(--scene-roof) 68%, var(--scene-rock))"
        stroke="none"
      />
      <g className="nook-shirogane-night" opacity={isDark ? 1 : 0}>
        <path d={arch} fill="var(--scene-window-light)" opacity=".7" />
      </g>
      <g clipPath={`url(#${paneId})`}>
        <NookThread
          relief={1.8}
          d={Array.from(
            { length: 21 },
            (_, i) => `M-1 ${i * 3}l${width + 2} -11`,
          ).join(" ")}
          color="var(--scene-roof)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-rock-light)"
          width={2}
          opacity={isDark ? 0.23 : 0.85}
        />
      </g>
      <NookThread
        relief={1.8}
        d={arch}
        color="var(--scene-plaster)"
        shadow="var(--scene-rock)"
        highlight="var(--scene-paper)"
        width={3.1}
      />
      <NookThread
        relief={1.8}
        d={arch}
        color="var(--scene-rock-light)"
        shadow="var(--scene-plaster)"
        highlight="var(--scene-plaster)"
        width={2.3}
        dasharray="1.1 3"
        opacity={0.8}
      />
      <NookThread
        relief={1.8}
        d={`M${middle} 2V${height}M1 ${spring + 2}H${width - 1}M${middle} ${spring + 5}L3 ${spring + (height - spring) / 2}L${middle} ${height - 2}L${width - 3} ${spring + (height - spring) / 2}Z`}
        color="var(--scene-plaster)"
        shadow="var(--scene-rock)"
        highlight="var(--scene-paper)"
        width={1.65}
      />
      <path
        d={`M-2 ${height + 1}H${width + 2}`}
        stroke="var(--scene-paper)"
        strokeWidth="1.25"
        opacity=".56"
      />
    </g>
  );
}

function WisteriaCluster({
  x,
  y,
  length,
}: {
  x: number;
  y: number;
  length: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(1 ${length / 35})`} stroke="none">
      <NookThread
        relief={1.8}
        d="M0 0Q-1 14 1 33"
        color="var(--scene-pine)"
        width={1.8}
        opacity={0.9}
      />
      <path
        d="M0 1C-5 1-6 6-3 9C-7 12-4 17-2 18C-5 22-1 27 0 28Q-1 33 2 35Q5 30 3 27C6 23 5 19 3 17C7 13 6 9 3 8C7 4 4 0 0 1Z"
        fill="color-mix(in srgb, var(--scene-distant) 75%, var(--scene-rose))"
      />
      <NookThread
        relief={1.8}
        d="M-1 4Q-7 1-4 7Q-2 10-1 4M2 9Q7 5 5 11Q3 14 2 9M-1 13Q-6 10-4 16Q-2 19-1 13M2 19Q6 15 4 22Q2 24 2 19M0 24Q-4 21-2 27Q0 29 0 24M2 29Q5 26 3 32Z"
        color="color-mix(in srgb, var(--scene-distant) 64%, var(--scene-rose))"
        shadow="var(--scene-distant)"
        highlight="color-mix(in srgb, var(--scene-rose) 55%, var(--scene-paper))"
        width={2.25}
      />
      <NookThread
        relief={1.8}
        d="M-2 3-3 7M3 8l1 3M-2 13l-1 3M3 18v4M-1 24v3M2 29v3"
        color="color-mix(in srgb, var(--scene-distant) 48%, var(--scene-rose))"
        shadow="var(--scene-distant)"
        highlight="var(--scene-rose)"
        width={1.75}
        opacity={0.9}
      />
    </g>
  );
}

// The pale gabled neighbour, balcony and wisteria are drawn from the FC's view.
// Its lights remain mounted so the room's day/night crossfade can reverse.
export function NookNeighbourHouse({ isDark }: NookNeighbourHouseProps) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-neighbour-${name})`;
  const front = "M111 238L151 179L208 237V333H111Z";

  return (
    <g
      className="nook-neighbour-house"
      stroke="var(--scene-rock)"
      strokeWidth=".45"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient
          id={`${id}-neighbour-stone`}
          gradientUnits="userSpaceOnUse"
          x1="115"
          y1="200"
          x2="207"
          y2="320"
        >
          <stop stopColor="color-mix(in srgb, var(--scene-plaster) 50%, var(--scene-rock-light))" />
          <stop offset=".7" stopColor="var(--scene-rock-light)" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-plaster) 35%, var(--scene-rock))"
          />
        </linearGradient>
        <linearGradient
          id={`${id}-neighbour-slate`}
          gradientUnits="userSpaceOnUse"
          x1="68"
          y1="181"
          x2="119"
          y2="236"
        >
          <stop stopColor="color-mix(in srgb, var(--scene-rock) 50%, var(--scene-roof))" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-rock) 67%, var(--scene-roof))"
          />
        </linearGradient>
        <clipPath id={`${id}-neighbour-front`}>
          <path d={front} />
        </clipPath>
        <clipPath id={`${id}-neighbour-side`}>
          <path d="M44 220L114 233V333L44 316Z" />
        </clipPath>
        <clipPath id={`${id}-neighbour-roof`}>
          <path d="M42 227L88 176L151 171L111 240Z" />
        </clipPath>
        <clipPath id={`${id}-neighbour-gable-edge`}>
          <path d="M105 240L150 171L215 235V242L151 181L111 246Z" />
        </clipPath>
        <clipPath id={`${id}-neighbour-chimneys`}>
          <path d="M101 188V132L114 128L121 132V185ZM98 128L113 124L124 128V134L109 139L98 135ZM169 222V120L181 117L191 122V229ZM167 117L180 113L193 118V125L180 128L167 123Z" />
        </clipPath>
      </defs>

      {/* The long side wall recedes behind the gabled frontage. */}
      <path
        d="M44 220L114 233V333L44 316Z"
        fill="color-mix(in srgb, var(--scene-plaster) 73%, var(--scene-rock-light))"
      />
      <g clipPath={paint("side")}>
        <NookThread
          relief={1.8}
          d={stoneThreads}
          color="color-mix(in srgb, var(--scene-plaster) 65%, var(--scene-rock-light))"
          shadow="var(--scene-rock)"
          highlight="var(--scene-plaster)"
          width={2.25}
        />
      </g>
      <path
        d="M45 266L112 275M46 313L111 320"
        fill="none"
        stroke="var(--scene-rock)"
        strokeWidth=".55"
        opacity=".17"
      />

      {/* Short raised slate floss covers the roof, with sewn ridge and eaves. */}
      <path d="M42 227L88 176L151 171L111 240Z" fill={paint("slate")} />
      <g clipPath={paint("roof")}>
        {slateThreads.map((d, tone) => (
          <NookThread
            key={tone}
            relief={2.5}
            d={d}
            color={
              tone === 0
                ? "color-mix(in srgb, var(--scene-roof) 54%, var(--scene-rock-light))"
                : tone === 1
                  ? "color-mix(in srgb, var(--scene-roof) 74%, var(--scene-rock-light))"
                  : "color-mix(in srgb, var(--scene-roof) 64%, var(--scene-rock-light))"
            }
            shadow="var(--scene-roof)"
            highlight="color-mix(in srgb, var(--scene-rock-light) 75%, var(--scene-plaster))"
            width={2.65}
          />
        ))}
      </g>
      <NookThread
        d="M43 227 88 176 150 171M44 228 110 241"
        color="color-mix(in srgb, var(--scene-roof) 60%, var(--scene-rock-light))"
        shadow="var(--scene-roof)"
        highlight="var(--scene-rock-light)"
        width={3}
        relief={2.3}
      />
      <path
        d="M43 226L111 239L111 245L42 232ZM86 175L149 169L153 173L90 180Z"
        fill="var(--scene-rock-light)"
      />
      <NookThread
        relief={2.3}
        d="M44 230L110 242M89 176L149 171"
        color="var(--scene-rock-light)"
        shadow="var(--scene-rock)"
        highlight="var(--scene-plaster)"
        width={3.6}
      />
      <NookThread
        relief={2.3}
        d="M44 230L110 242M89 176L149 171"
        color="var(--scene-plaster)"
        shadow="var(--scene-rock-light)"
        width={2.6}
        dasharray="1.3 3.3"
        opacity={0.9}
      />

      {/* Tall square chimneys, with offset capstones and visible corner planes. */}
      <g fill={paint("stone")}>
        <path d="M101 188V132L114 128L121 132V185Z" />
        <path
          d="M114 129L121 132V185L114 190Z"
          fill="var(--scene-rock-light)"
        />
        <path d="M98 128L113 124L124 128V134L109 139L98 135Z" />
        <path d="M98 128L109 132L124 128M109 132V139" fill="none" />
        <path
          d="M101 147L114 151L121 148M101 164L114 168L121 165M107 149V165M116 133V149M109 135V150M114 170V188"
          fill="none"
          stroke="var(--scene-rock)"
          strokeWidth=".55"
          opacity=".14"
        />
        <path d="M169 222V120L181 117L191 122V229Z" />
        <path
          d="M181 118L191 122V229L181 223Z"
          fill="var(--scene-rock-light)"
        />
        <path d="M167 117L180 113L193 118V125L180 128L167 123Z" />
        <path d="M168 117L180 122L193 118M180 122V128" fill="none" />
        <path
          d="M169 139L181 142L191 139M169 157L181 160L191 157M169 174L181 178L191 175M175 125V140M184 142V158M175 158V176M186 177V197"
          fill="none"
          stroke="var(--scene-rock)"
          strokeWidth=".55"
          opacity=".14"
        />
      </g>
      <g clipPath={paint("chimneys")}>
        <NookThread
          relief={1.8}
          d={stoneThreads}
          color="var(--scene-plaster)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-paper)"
          width={2.25}
        />
      </g>
      <NookThread
        relief={1.8}
        d="M102 185V138M120 136V182M169 216V124M190 126V221M99 129l10 4 14-4M168 118l12 5 12-4"
        color="var(--scene-rock-light)"
        shadow="var(--scene-rock)"
        highlight="var(--scene-plaster)"
        width={2.3}
      />
      <NookThread
        relief={1.8}
        d="M102 184V140M169 215V128M99 129l10 4 14-4M168 118l12 5 12-4"
        color="var(--scene-plaster)"
        shadow="var(--scene-rock-light)"
        width={1.8}
        dasharray="1.1 3.2"
        opacity={0.7}
      />

      <path d={front} fill={paint("stone")} />
      <g clipPath={paint("front")}>
        <NookThread
          relief={1.8}
          d={stoneThreads}
          color="var(--scene-plaster)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-paper)"
          width={2.25}
        />
        <path
          d="M113 217H208M112 253H208M112 293H208M143 217V235M180 253V273M162 293V313"
          fill="none"
          stroke="var(--scene-rock)"
          strokeWidth=".6"
          opacity=".15"
        />
        <path
          d="M114 236H205M114 274H206M115 314H207"
          stroke="var(--scene-paper)"
          strokeWidth=".6"
          opacity=".12"
        />
        <path
          d="M113 239L151 186L206 242V249L151 194L113 247Z"
          fill="var(--scene-ink)"
          stroke="none"
          opacity=".12"
        />
      </g>

      {/* A projecting stone verge and small stepped corbels frame the gable. */}
      <path
        d="M105 240L150 171L215 235V242L151 181L111 246Z"
        fill="var(--scene-rock-light)"
      />
      <g clipPath={paint("gable-edge")}>
        <NookThread
          d={gableWraps}
          color="var(--scene-plaster)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-paper)"
          width={2.4}
          relief={2.3}
        />
      </g>
      <NookThread
        relief={2.3}
        d="M107 239L150 174L213 236"
        color="var(--scene-plaster)"
        shadow="var(--scene-rock)"
        highlight="var(--scene-paper)"
        width={2.1}
      />
      <NookThread
        relief={2.3}
        d="M111 243L151 180L212 240"
        color="var(--scene-rock-light)"
        shadow="var(--scene-plaster)"
        highlight="var(--scene-plaster)"
        width={1.85}
        opacity={0.9}
      />
      <path
        d="M121 232V240H126V224M131 218V225H136V211M142 201V209H147V194M162 193V200H167V201M175 206V215H180V219M187 219V228H192V232M200 232V239H205V243"
        fill="var(--scene-rock-light)"
        stroke="var(--scene-rock)"
        strokeWidth=".35"
      />
      <path
        d="M110 270H209V275H110ZM112 330H209V334H112Z"
        fill="var(--scene-rock-light)"
      />
      <NookThread
        relief={1.8}
        d="M112 272H207M114 332H207M112 247V269M207 246V270M112 277V329M207 277V329"
        color="var(--scene-rock-light)"
        shadow="var(--scene-rock)"
        highlight="var(--scene-plaster)"
        width={2.7}
      />
      <NookThread
        relief={1.8}
        d="M112 272H207M114 332H207M112 247V269M207 246V270M112 277V329M207 277V329"
        color="var(--scene-plaster)"
        shadow="var(--scene-rock-light)"
        width={1.9}
        dasharray="1 3"
        opacity={0.7}
      />

      <PointedWindow x={150} y={209} width={28} height={42} isDark={isDark} />
      <PointedWindow x={130} y={286} width={19} height={42} isDark={isDark} />
      <PointedWindow x={178} y={284} width={19} height={44} isDark={isDark} />

      {/* Turned balusters, a shallow stone tray and little flowers at the sill. */}
      <path
        d="M136 263L197 264L194 274L147 275Z"
        fill="var(--scene-ink)"
        stroke="none"
        opacity=".16"
      />
      <path d="M141 247H191L189 254H143Z" fill="var(--scene-rock)" />
      <path
        d="M142 247Q140 241 146 244Q147 239 151 244Q156 238 160 244Q162 240 166 243Q171 237 175 243Q180 238 184 243Q190 241 191 247Z"
        fill="var(--scene-pine)"
        stroke="none"
      />
      {[
        [145, 243],
        [153, 242],
        [160, 245],
        [173, 241],
        [184, 243],
        [189, 245],
      ].map(([x, y], i) => (
        <path
          key={x}
          d={`M${x} ${y - 2}q-2-2-3 1q-2 2 1 3q1 3 3 0q3-1 1-3Z`}
          fill={i % 2 ? "var(--scene-distant)" : "var(--scene-rose)"}
          stroke="var(--scene-paper)"
          strokeWidth=".3"
        />
      ))}
      <path d="M137 251H195V254H137Z" fill={paint("stone")} />
      <g fill={paint("stone")} strokeWidth=".5">
        <path d="M137 253H141V266H137ZM191 253H195V266H191Z" />
        {[147, 155, 163, 171, 179, 187].map((x) => (
          <path
            key={x}
            d={`M${x - 1.3} 254H${x + 1.3}L${x + 1} 256Q${x + 3} 259 ${x + 1} 262L${x + 1.6} 265H${x - 1.6}L${x - 1} 262Q${x - 3} 259 ${x - 1} 256Z`}
          />
        ))}
      </g>
      <path d="M134 265H199V269H134Z" fill={paint("stone")} />
      <NookThread
        relief={1.8}
        d="M138 252H194M135 266H198M138 254V264M194 254V264M147 255q-2 5 0 9M155 255q-2 5 0 9M163 255q-2 5 0 9M171 255q-2 5 0 9M179 255q-2 5 0 9M187 255q-2 5 0 9"
        color="var(--scene-plaster)"
        shadow="var(--scene-rock)"
        highlight="var(--scene-paper)"
        width={2.1}
      />
      <NookThread
        relief={1.8}
        d="M138 252H194M135 267H198"
        color="var(--scene-rock-light)"
        shadow="var(--scene-plaster)"
        highlight="var(--scene-plaster)"
        width={1.8}
        dasharray="1 2.8"
        opacity={0.8}
      />

      {/* Wisteria climbs the shaded wing, leaving the front stonework visible. */}
      <NookThread
        relief={1.8}
        d="M53 329Q61 310 63 281Q66 259 82 246M60 306Q82 287 99 290M67 275Q60 254 58 242M79 249Q96 242 106 251"
        color="var(--scene-pine)"
        highlight="var(--scene-leaf-light)"
        width={2.3}
        dasharray="3.4 .5"
      />
      <g fill="var(--scene-pine)" stroke="none">
        <path d="M51 243Q46 233 57 232Q60 223 67 230Q77 222 82 231Q91 225 96 232Q108 228 109 239Q119 243 110 251Q98 254 92 248Q85 254 78 246Q68 254 62 246Q56 251 51 243Z" />
        <path d="M51 283Q45 275 53 270Q51 260 60 263Q64 255 70 263Q78 261 81 270Q90 271 84 279Q73 287 63 282ZM69 296Q64 286 75 282Q79 274 86 281Q96 275 101 284Q110 281 114 290Q119 298 108 302Q100 307 93 299Q87 307 79 300Q73 304 69 296Z" />
        <path d="M53 321Q49 310 59 307Q65 301 71 309Q77 307 81 315Q88 322 78 327Q67 331 59 324Z" />
      </g>
      <g fill="var(--scene-leaf-light)" stroke="none" opacity=".68">
        <path d="M54 237Q52 228 61 233Q60 239 54 237M70 235Q69 226 78 231Q77 237 70 235M85 237Q89 228 94 234Q93 240 85 237M101 242Q103 234 110 240Q108 245 101 242M55 272Q52 264 60 267Q63 273 55 272M65 279Q68 270 74 277Q71 282 65 279M79 289Q75 281 84 284Q88 290 79 289M94 292Q96 283 102 290Q101 297 94 292M59 316Q55 308 63 310Q69 315 59 316M72 323Q72 315 80 319Q77 325 72 323Z" />
      </g>
      <NookThread
        relief={1.8}
        d="M54 237q0-7 6-4q1 5-6 4M70 235q0-7 7-4q-1 5-7 4M85 237q6-8 9-3q-2 5-9 3M101 242q2-7 8-2q-2 5-8 2M55 272q-3-7 5-5q2 5-5 5M65 279q5-9 9-2q-3 5-9 2M79 289q-5-7 5-5q3 5-5 5M94 292q3-8 8-2q-1 6-8 2M59 316q-6-7 4-6q6 5-4 6M72 323q1-8 8-4q-3 6-8 4"
        color="var(--scene-leaf-light)"
        shadow="var(--scene-pine)"
        highlight="var(--scene-leaf-light)"
        width={2}
        opacity={0.9}
      />
      {[
        [56, 240, 28],
        [65, 237, 38],
        [75, 241, 30],
        [84, 237, 40],
        [96, 242, 30],
        [106, 246, 25],
        [57, 275, 33],
        [74, 289, 31],
        [86, 287, 38],
        [99, 293, 30],
        [107, 295, 22],
        [62, 311, 16],
      ].map(([x, y, length]) => (
        <WisteriaCluster key={`${x}-${y}`} x={x} y={y} length={length} />
      ))}
    </g>
  );
}
