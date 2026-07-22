import { useId } from "react";

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
  const middle = width / 2;
  const spring = width * 0.58;
  const arch = `M0 ${height}V${spring}Q0 ${width * 0.25} ${middle} 0Q${width} ${width * 0.25} ${width} ${spring}V${height}Z`;

  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={arch}
        fill="var(--scene-rock)"
        stroke="var(--scene-rock-light)"
        strokeWidth="4"
      />
      <path
        d={arch}
        fill="color-mix(in srgb, var(--scene-roof) 68%, var(--scene-rock))"
        stroke="var(--scene-ink)"
        strokeWidth=".7"
      />
      <g className="nook-shirogane-night" opacity={isDark ? 1 : 0}>
        <path d={arch} fill="var(--scene-window-light)" opacity=".7" />
      </g>
      <path
        d={`M${middle} 1V${height}M1 ${spring + 2}H${width - 1}M${middle} ${spring + 1}Q${middle - 2} 6 3 ${spring - 2}M${middle} ${spring + 1}Q${middle + 2} 6 ${width - 3} ${spring - 2}M${middle} ${spring + 5}L3 ${spring + (height - spring) / 2}L${middle} ${height - 2}L${width - 3} ${spring + (height - spring) / 2}Z`}
        fill="none"
        stroke="var(--scene-plaster)"
        strokeWidth="1.35"
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
      <path
        d="M0 0Q-1 14 1 33"
        fill="none"
        stroke="var(--scene-pine)"
        strokeWidth=".55"
      />
      <path
        d="M0 1C-5 1-6 6-3 9C-7 12-4 17-2 18C-5 22-1 27 0 28Q-1 33 2 35Q5 30 3 27C6 23 5 19 3 17C7 13 6 9 3 8C7 4 4 0 0 1Z"
        fill="color-mix(in srgb, var(--scene-distant) 75%, var(--scene-rose))"
      />
      <path
        d="M-1 4Q-7 1-4 7Q-2 10-1 4M2 9Q7 5 5 11Q3 14 2 9M-1 13Q-6 10-4 16Q-2 19-1 13M2 19Q6 15 4 22Q2 24 2 19M0 24Q-4 21-2 27Q0 29 0 24M2 29Q5 26 3 32Z"
        fill="color-mix(in srgb, var(--scene-distant) 72%, var(--scene-paper))"
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
      stroke="var(--scene-ink)"
      strokeWidth=".75"
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
          <stop stopColor="color-mix(in srgb, var(--scene-plaster) 84%, var(--scene-paper))" />
          <stop offset=".7" stopColor="var(--scene-plaster)" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-plaster) 78%, var(--scene-rock-light))"
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
          <stop stopColor="color-mix(in srgb, var(--scene-rock-light) 66%, var(--scene-roof))" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-rock) 67%, var(--scene-roof))"
          />
        </linearGradient>
        <clipPath id={`${id}-neighbour-front`}>
          <path d={front} />
        </clipPath>
      </defs>

      {/* The long side wall recedes behind the gabled frontage. */}
      <path
        d="M44 220L114 233V333L44 316Z"
        fill="color-mix(in srgb, var(--scene-plaster) 73%, var(--scene-rock-light))"
      />
      <path
        d="M45 243L112 254M45 266L112 275M45 290L112 297M46 313L111 320M62 246V268M85 250V272M74 270V293M99 274V296M57 291V315M88 295V323"
        fill="none"
        stroke="var(--scene-rock)"
        strokeWidth=".55"
        opacity=".4"
      />

      {/* Slate courses follow the same perspective as the ridge and eaves. */}
      <path d="M42 227L88 176L151 171L111 240Z" fill={paint("slate")} />
      <path
        d="M49 220L118 225M57 211L123 213M65 203L130 201M73 194L137 189M81 185L144 178M54 221L62 212M70 222L77 212M86 223L93 213M103 224L109 213M68 212L76 202M85 212L92 202M103 213L110 202M81 201L89 191M99 201L106 190M116 201L124 189M93 191L99 183M113 189L119 180M131 188L136 180"
        fill="none"
        stroke="var(--scene-paper)"
        strokeWidth=".55"
        opacity=".48"
      />
      <path
        d="M43 226L111 239L111 245L42 232ZM86 175L149 169L153 173L90 180Z"
        fill="var(--scene-rock-light)"
      />
      <path d="M46 230L108 241" stroke="var(--scene-paper)" opacity=".36" />

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
          opacity=".6"
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
          opacity=".6"
        />
      </g>

      <path d={front} fill={paint("stone")} />
      <g clipPath={paint("front")}>
        <path
          d="M113 217H208M113 235H208M112 253H208M112 273H208M112 293H208M112 313H208M130 202V217M155 198V217M180 209V217M143 217V235M177 217V235M128 235V253M164 235V253M195 235V253M143 253V273M180 253V273M126 273V293M162 273V293M195 273V293M143 293V313M178 293V313M128 313V334M162 313V334M196 313V334"
          fill="none"
          stroke="var(--scene-rock)"
          strokeWidth=".6"
          opacity=".38"
        />
        <path
          d="M114 236H205M114 274H206M115 314H207"
          stroke="var(--scene-paper)"
          strokeWidth=".6"
          opacity=".38"
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
      <path
        d="M107 239L150 174L213 236"
        fill="none"
        stroke="var(--scene-paper)"
        strokeWidth="1.35"
        opacity=".58"
      />
      <path
        d="M121 232V240H126V224M131 218V225H136V211M142 201V209H147V194M162 193V200H167V201M175 206V215H180V219M187 219V228H192V232M200 232V239H205V243"
        fill="var(--scene-rock-light)"
        stroke="var(--scene-rock)"
        strokeWidth=".55"
      />
      <path
        d="M110 270H209V275H110ZM112 330H209V334H112Z"
        fill="var(--scene-rock-light)"
      />
      <path
        d="M112 271H207M114 331H207"
        stroke="var(--scene-paper)"
        opacity=".45"
      />
      <path
        d="M113 247V269M205 246V270M113 277V329M205 277V329"
        stroke="var(--scene-paper)"
        opacity=".38"
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
      <path
        d="M138 251H193M135 266H197"
        stroke="var(--scene-paper)"
        opacity=".58"
      />

      {/* Wisteria climbs the shaded wing, leaving the front stonework visible. */}
      <path
        d="M53 329Q61 310 63 281Q66 259 82 246M60 306Q82 287 99 290M67 275Q60 254 58 242M79 249Q96 242 106 251"
        fill="none"
        stroke="var(--scene-pine)"
        strokeWidth="1.65"
      />
      <g fill="var(--scene-pine)" stroke="none">
        <path d="M51 243Q46 233 57 232Q60 223 67 230Q77 222 82 231Q91 225 96 232Q108 228 109 239Q119 243 110 251Q98 254 92 248Q85 254 78 246Q68 254 62 246Q56 251 51 243Z" />
        <path d="M51 283Q45 275 53 270Q51 260 60 263Q64 255 70 263Q78 261 81 270Q90 271 84 279Q73 287 63 282ZM69 296Q64 286 75 282Q79 274 86 281Q96 275 101 284Q110 281 114 290Q119 298 108 302Q100 307 93 299Q87 307 79 300Q73 304 69 296Z" />
        <path d="M53 321Q49 310 59 307Q65 301 71 309Q77 307 81 315Q88 322 78 327Q67 331 59 324Z" />
      </g>
      <g fill="var(--scene-leaf-light)" stroke="none" opacity=".68">
        <path d="M54 237Q52 228 61 233Q60 239 54 237M70 235Q69 226 78 231Q77 237 70 235M85 237Q89 228 94 234Q93 240 85 237M101 242Q103 234 110 240Q108 245 101 242M55 272Q52 264 60 267Q63 273 55 272M65 279Q68 270 74 277Q71 282 65 279M79 289Q75 281 84 284Q88 290 79 289M94 292Q96 283 102 290Q101 297 94 292M59 316Q55 308 63 310Q69 315 59 316M72 323Q72 315 80 319Q77 325 72 323Z" />
      </g>
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
