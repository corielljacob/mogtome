import { useId } from "react";

const pumpkin = "var(--scene-pumpkin, #d88d51)";
const pumpkinLight = "var(--scene-pumpkin-light, #f0bc7d)";
const autumn = "var(--scene-autumn, #ad674b)";
const autumnLight = "var(--scene-autumn-light, #cf965d)";

/** Paper ghosts, carved pumpkins, and a gathered autumn garland for the nook. */
export function NookHalloweenDecor() {
  const id = useId().replace(/:/g, "");
  const ref = (name: string) => `url(#${id}-halloween-${name})`;
  const leaves = [
    [67, 93, -48, 0.9, 0],
    [78, 74, 127, 0.84, 1],
    [93, 61, -55, 1.04, 1],
    [110, 48, 139, 0.9, 0],
    [132, 38, -39, 0.9, 0],
    [151, 31, 151, 0.96, 1],
    [173, 28, -24, 0.76, 1],
    [196, 28, 166, 0.86, 0],
    [218, 28, 31, 0.91, 0],
    [239, 31, -145, 0.86, 1],
    [261, 39, 39, 1.02, 1],
    [280, 47, -140, 0.85, 0],
    [301, 62, 53, 0.91, 0],
    [320, 78, -132, 0.9, 1],
    [337, 99, 48, 0.97, 1],
  ];

  return (
    <g className="nook-halloween-decor" strokeWidth="1.1">
      <defs>
        <linearGradient
          id={`${id}-halloween-pumpkin`}
          x1=".15"
          y1="0"
          x2=".8"
          y2="1"
        >
          <stop stopColor={pumpkinLight} />
          <stop offset=".46" stopColor={pumpkin} />
          <stop offset="1" stopColor={autumn} />
        </linearGradient>
        <linearGradient
          id={`${id}-halloween-pumpkin-center`}
          x1=".1"
          y1=".2"
          x2=".9"
          y2=".8"
        >
          <stop stopColor={pumpkin} />
          <stop offset=".35" stopColor={pumpkinLight} />
          <stop offset=".75" stopColor={pumpkin} />
          <stop offset="1" stopColor={autumn} />
        </linearGradient>
        <linearGradient
          id={`${id}-halloween-ivory`}
          x1=".15"
          y1="0"
          x2=".8"
          y2="1"
        >
          <stop stopColor="var(--scene-paper)" />
          <stop offset=".5" stopColor="var(--scene-paper)" />
          <stop offset="1" stopColor="var(--scene-pot)" />
        </linearGradient>
        <linearGradient id={`${id}-halloween-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={autumnLight} />
          <stop offset="1" stopColor={autumn} />
        </linearGradient>
        <radialGradient id={`${id}-halloween-halo`}>
          <stop stopColor="#ffc978" stopOpacity=".35" />
          <stop offset=".4" stopColor="#f9b65f" stopOpacity=".14" />
          <stop offset="1" stopColor="#f9b65f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-halloween-carving`} x2="0" y2="1">
          <stop stopColor="#ffda88" />
          <stop offset="1" stopColor="#fff1bd" />
        </linearGradient>
        <g id={`${id}-halloween-maple`}>
          <path
            d="M0 0Q-6-3-10-8L-14-10-10-14-14-19-7-18-5-25 0-23 5-29 8-21 14-23 13-16 19-15 13-10 14-6 7-5Z"
            fill={ref("leaf")}
          />
          <path
            d="M0 0 5-22M3-11-7-17M4-15 12-17M0-3-7-9M1-7 10-10"
            fill="none"
            stroke="var(--scene-wood-dark)"
            strokeWidth=".65"
            opacity=".57"
          />
          <path
            d="M-8-17-4-18-3-21"
            fill="none"
            stroke={pumpkinLight}
            strokeWidth="1.1"
            opacity=".65"
          />
        </g>
        <g id={`${id}-halloween-oak`}>
          <path
            d="M0 0C-6-3-12-8-8-11C-16-14-10-20-5-17C-10-24-3-28 1-23C1-35 12-34 10-24C18-27 20-19 12-16C21-14 16-8 10-10C14-3 5 1 0 0Z"
            fill={autumnLight}
          />
          <path
            d="M0 0 6-25M2-9-6-15M3-13 12-18M0-4 9-6"
            fill="none"
            stroke={autumn}
            strokeWidth=".7"
          />
          <path
            d="M3-23q1-6 4-5"
            fill="none"
            stroke={pumpkinLight}
            opacity=".7"
          />
        </g>
      </defs>

      {/* Copper leaves follow the arch in little gathered bunches, with berries. */}
      <path
        d="M60 105C86 61 117 34 160 28Q203 20 244 31Q306 46 346 108"
        fill="none"
        stroke="var(--scene-shadow)"
        strokeWidth="5"
        opacity=".13"
        transform="translate(1 3)"
      />
      <path
        d="M60 103C86 59 117 32 160 26Q203 18 244 29Q306 44 346 106"
        fill="none"
        stroke="var(--scene-wood-dark)"
        strokeWidth="2.3"
      />
      <path
        d="M64 99Q90 80 91 58M114 46q22 2 33-13M173 25q19 9 32 1M250 33q17 15 34 18M316 76q4 19 20 27"
        fill="none"
        stroke={autumn}
        strokeWidth="1.3"
      />
      {leaves.map(([x, y, rotation, scale, variant], index) => (
        <g
          key={index}
          transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}
        >
          <use
            className="nook-autumn-leaf"
            href={`#${id}-halloween-${variant ? "oak" : "maple"}`}
          />
        </g>
      ))}
      {[
        [90, 77],
        [126, 43],
        [164, 36],
        [228, 39],
        [287, 63],
        [329, 95],
      ].map(([x, y], index) => (
        <g
          key={x}
          transform={`translate(${x} ${y}) rotate(${index % 2 ? 18 : -21})`}
        >
          <path
            d="M0 0-3-8M0 0 5-5M0 0 6 3"
            fill="none"
            stroke={autumn}
            strokeWidth=".8"
          />
          <circle cx="-3" cy="-8" r="2.3" fill={autumn} />
          <circle cx="5" cy="-5" r="2.7" fill={pumpkin} />
          <circle cx="6" cy="3" r="2.4" fill={autumn} />
          <path
            d="m4-6 1-.3m-9-3 1-.3"
            stroke={pumpkinLight}
            opacity=".7"
            strokeWidth=".8"
          />
        </g>
      ))}

      {/* A fine web is tucked into one pane, away from the landscape. */}
      <g fill="none" stroke="var(--scene-gold)" strokeWidth=".55" opacity=".42">
        <path d="M81 155 82 109M81 155 96 99M81 155 114 93M81 155 140 101M81 155 148 124M81 155 147 150M81 155 130 178" />
        <path d="M82 120q3 5 11-9q1 9 12 0q2 9 14 9q-1 9 14 11q-7 8-1 17q-10 2-9 11" />
        <path d="M81 135q5 2 8-9q3 6 9 1q3 6 12 6q-2 6 9 7q-5 5-1 12q-6 1-5 8" />
        <path d="M81 145q3 2 5-6q2 4 6 1q1 4 7 4q-2 4 5 4q-4 3-1 7" />
      </g>
      <path
        d="M115 150v27"
        stroke="var(--scene-gold)"
        strokeWidth=".6"
        opacity=".65"
      />
      <g
        transform="translate(115 180)"
        stroke="var(--scene-wood-dark)"
        strokeWidth=".7"
      >
        <path
          d="m-2-1-4-2-2 3m6 0-5 1-1 3m6-1-3 3v2m7-9 4-2 2 3m-6 0 5 1 1 3m-6-1 3 3v2"
          fill="none"
        />
        <ellipse rx="2.6" ry="3.7" fill="var(--scene-wood-dark)" />
        <path
          d="m-1-1 .1 0m1.8 0 .1 0"
          stroke="var(--scene-paper)"
          strokeWidth=".8"
        />
      </g>

      {/* Twine and stitched linen keep the little ghost feeling handmade. */}
      <path
        d="M296 104Q294 132 296 159"
        fill="none"
        stroke="var(--scene-wood)"
        strokeWidth=".85"
      />
      <g className="nook-halloween-ghost">
        <path
          d="M294 162q-5-7 0-8q4 2 2 7q3-8 6-4q1 3-6 5"
          fill="none"
          stroke="var(--scene-wood)"
          strokeWidth=".7"
        />
        <path
          d="M281 182C281 166 286 162 296 162C306 162 311 168 311 181Q310 190 316 193Q311 201 306 195Q301 204 295 197Q288 203 284 195Q278 200 275 195Q281 190 281 182Z"
          fill={ref("ivory")}
        />
        <path
          d="M286 172q-2 8-1 12M308 184q-1 7 2 9M291 188q-2 5-2 9"
          fill="none"
          stroke="var(--scene-pot)"
          strokeWidth=".8"
          opacity=".6"
        />
        <path
          d="M279 194q4 3 7-1q3 6 9 1q6 7 10-1q5 4 8 0"
          fill="none"
          stroke="var(--scene-wood)"
          strokeWidth=".6"
          strokeDasharray="1 2"
          opacity=".7"
        />
        <ellipse
          cx="290"
          cy="179"
          rx="1.2"
          ry="1.8"
          fill="var(--scene-wood-dark)"
          stroke="none"
        />
        <ellipse
          cx="302"
          cy="179"
          rx="1.2"
          ry="1.8"
          fill="var(--scene-wood-dark)"
          stroke="none"
        />
        <path d="M293 184q3 3 6 0" fill="none" strokeWidth=".8" />
        <ellipse
          cx="286.5"
          cy="183"
          rx="2.5"
          ry="1.1"
          fill="var(--scene-rose)"
          stroke="none"
          opacity=".5"
        />
        <ellipse
          cx="305.5"
          cy="183"
          rx="2.5"
          ry="1.1"
          fill="var(--scene-rose)"
          stroke="none"
          opacity=".5"
        />
      </g>

      {/* The pumpkin is carved into the flesh, rather than a face painted on it. */}
      <ellipse
        cx="51"
        cy="438"
        rx="35"
        ry="4.1"
        fill="var(--scene-shadow)"
        stroke="none"
        opacity=".26"
      />
      <ellipse
        className="nook-pumpkin-light"
        cx="51"
        cy="415"
        rx="43"
        ry="38"
        fill={ref("halo")}
        stroke="none"
      />
      <path
        d="M48 391Q42 383 47 375Q50 370 55 374Q54 378 51 380L55 391Z"
        fill="var(--scene-leaf)"
      />
      <path
        d="M49 388q-3-7 0-12"
        fill="none"
        stroke="var(--scene-leaf-light)"
        strokeWidth="1.4"
      />
      <path
        d="M54 390Q63 375 70 381Q75 388 67 389Q61 386 67 382"
        fill="none"
        stroke="var(--scene-leaf)"
        strokeWidth="1.2"
      />
      <path
        d="M50 391C36 383 25 391 22 406C17 423 25 437 37 436Q50 441 63 436C78 439 87 422 81 405C77 390 65 385 50 391Z"
        fill={ref("pumpkin")}
      />
      <path
        d="M49 392C38 388 30 399 30 415Q29 433 41 436M53 392C66 388 74 401 73 416Q73 432 63 436"
        fill="none"
        stroke={autumn}
        opacity=".64"
      />
      <path
        d="M50 391C36 392 36 406 37 417Q38 434 50 438Q65 434 64 416Q65 398 54 391Z"
        fill={ref("pumpkin-center")}
        stroke={autumn}
        strokeWidth=".8"
      />
      <path
        d="M24 406q2-10 8-12M42 396q-3 5-3 11M70 397q4 5 5 12"
        fill="none"
        stroke={pumpkinLight}
        strokeWidth="1.5"
        opacity=".65"
      />
      <path
        d="M30 413q5-10 11-9l-2 9q-4 2-9 0Zm28-9q7 0 11 10q-5 1-9-1Zm-22 17q16 5 31-1q-4 15-16 13q-12 0-15-12Z"
        fill="var(--scene-wood-dark)"
        stroke={autumn}
        strokeWidth="1.4"
      />
      <g className="nook-pumpkin-light" fill={ref("carving")} stroke="none">
        <path d="m32 411 7-5-1 6q-4 1-6-1Zm29-5 6 6-5-1Z" />
        <path d="M38 423q5 2 10 2v3h5v-3q6 0 11-2q-5 8-12 8q-9 1-14-8Z" />
      </g>
      <path
        d="M42 435q9 3 17 0"
        fill="none"
        stroke={autumn}
        strokeWidth=".75"
        opacity=".7"
      />

      {/* A pale little pumpkin and fallen leaves soften the edge of the display. */}
      <ellipse
        cx="98"
        cy="439"
        rx="18"
        ry="2.8"
        fill="var(--scene-shadow)"
        stroke="none"
        opacity=".2"
      />
      <path
        d="M96 414q-3-7 1-9l3 1q-3 3 0 9"
        fill="var(--scene-wood-dark)"
        strokeWidth=".8"
      />
      <path
        d="M97 415C77 406 76 439 90 438Q99 442 107 438C121 438 117 408 99 415Z"
        fill={ref("ivory")}
      />
      <path
        d="M94 415q-9 11-3 22m9-21q7 10 5 20m-7-20q-2 10 0 22"
        fill="none"
        stroke="var(--scene-pot)"
        strokeWidth=".8"
      />
      <path
        d="M84 422q0-5 4-7"
        fill="none"
        stroke="var(--scene-paper)"
        strokeWidth="1.5"
      />
      <use
        href={`#${id}-halloween-maple`}
        transform="translate(70 441) rotate(79) scale(.48)"
        strokeWidth="1.5"
      />

      {/* Tiny companion pumpkins occupy the free sliver beside the lantern. */}
      <ellipse
        cx="419"
        cy="441"
        rx="18"
        ry="2.8"
        fill="var(--scene-shadow)"
        stroke="none"
        opacity=".23"
      />
      <path
        d="M424 418q-3-5 1-8l2 2q-3 2 0 6"
        fill="var(--scene-leaf)"
        strokeWidth=".8"
      />
      <path
        d="M425 419C411 412 411 438 420 438Q427 441 432 436C440 432 437 414 425 419Z"
        fill={ref("ivory")}
        strokeWidth=".85"
      />
      <path
        d="M424 420q-6 8-2 17m5-16q5 7 3 15"
        fill="none"
        stroke="var(--scene-pot)"
        strokeWidth=".65"
      />
      <path
        d="M410 425q-1-6 3-6l1 2-2 4"
        fill="var(--scene-leaf)"
        strokeWidth=".8"
      />
      <path
        d="M411 426C400 420 400 439 408 440Q412 442 417 439C425 435 421 421 411 426Z"
        fill={ref("pumpkin")}
        strokeWidth=".85"
      />
      <path
        d="M410 427q-4 6-1 12m4-12q4 6 2 12"
        fill="none"
        stroke={autumn}
        strokeWidth=".65"
      />
    </g>
  );
}
