import { useId } from "react";
import { NookThread } from "./NookThread";

const stoneThreads = Array.from(
  { length: 27 },
  (_, i) => `M302 ${254 + i * 2.85}q4-.3 ${i % 2 ? 10 : 7} 0m1 0q7-.3 15 0`,
).join(" ");
const boardThreads = Array.from(
  { length: 8 },
  (_, i) => `M${259 + i * 2.8} 292q-.65 25 .25 55`,
).join(" ");
const roofThreads = Array.from(
  { length: 12 },
  (_, i) => `M${254 + i * 2.6} 277q${(i - 6) * 0.4} 7 ${(i - 6) * 0.65} 14`,
).join(" ");

interface NookNeighbourLandmarksProps {
  isDark: boolean;
}

// The board and garden lantern seen from the house, simplified for the window.
export function NookNeighbourLandmarks({
  isDark,
}: NookNeighbourLandmarksProps) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-neighbour-${name})`;

  return (
    <g
      className="nook-neighbour-landmarks"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient
          id={`${id}-neighbour-board`}
          x1="0"
          y1="0"
          x2="1"
          y2=".15"
        >
          <stop stopColor="color-mix(in srgb, var(--scene-timber) 66%, var(--scene-shadow))" />
          <stop offset=".42" stopColor="var(--scene-timber)" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-timber) 78%, var(--scene-rose))"
          />
        </linearGradient>
        <linearGradient
          id={`${id}-neighbour-brass`}
          x1="0"
          y1="0"
          x2="1"
          y2=".3"
        >
          <stop stopColor="color-mix(in srgb, var(--scene-gold) 70%, var(--scene-rock))" />
          <stop
            offset=".48"
            stopColor="color-mix(in srgb, var(--scene-gold) 77%, var(--scene-paper))"
          />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-gold) 65%, var(--scene-brass))"
          />
        </linearGradient>
        <linearGradient
          id={`${id}-neighbour-stone`}
          x1="0"
          y1="0"
          x2="1"
          y2=".12"
        >
          <stop stopColor="color-mix(in srgb, var(--scene-rock) 60%, var(--scene-rock-light))" />
          <stop offset=".48" stopColor="var(--scene-rock-light)" />
          <stop offset="1" stopColor="var(--scene-rock)" />
        </linearGradient>
        <radialGradient id={`${id}-neighbour-lamp`}>
          <stop stopColor="var(--scene-window-light)" stopOpacity=".5" />
          <stop
            offset=".4"
            stopColor="var(--scene-window-light)"
            stopOpacity=".12"
          />
          <stop
            offset="1"
            stopColor="var(--scene-window-light)"
            stopOpacity="0"
          />
        </radialGradient>
        <clipPath id={`${id}-neighbour-lamp-stone`}>
          <path d="M306 316H321L325 324 322 328H303L303 324ZM308 295H318L320 316Q314 318 306 316ZM304 290H322L321 295Q313 297 305 295ZM306 275 320 274 321 291H305Z" />
        </clipPath>
        <clipPath id={`${id}-neighbour-lamp-cap`}>
          <path d="M302 271Q307 269 310 263H318Q321 269 326 271L324 274Q314 277 304 274ZM309 263Q309 260 312 259L312 256Q314 255 316 256V259Q319 260 319 263Z" />
        </clipPath>
        <clipPath id={`${id}-neighbour-board-face`}>
          <path d="M260 294 278 293V341L260 345Z" />
        </clipPath>
        <clipPath id={`${id}-neighbour-board-roof`}>
          <path d="M251 286Q257 284 260 278Q265 279 270 275Q275 280 280 278Q282 284 286 285L285 290Q269 294 252 290Z" />
        </clipPath>
      </defs>

      {/* The square light box rests on a solid stone column and stepped foot. */}
      <ellipse
        cx="314"
        cy="327"
        rx="12"
        ry="2"
        fill="var(--scene-shadow)"
        opacity=".16"
      />
      <g stroke="var(--scene-rock)" strokeWidth=".65">
        <path
          d="M306 316H321L325 324 322 328H303L303 324Z"
          fill={paint("stone")}
        />
        <path d="M306 316H321L323 320H304Z" fill="var(--scene-rock-light)" />
        <path
          d="M304 324H324M313 321v6m-6-3v3m13-3v3"
          fill="none"
          opacity=".18"
        />
        <path d="M308 295H318L320 316Q314 318 306 316Z" fill={paint("stone")} />
        <path
          d="M315 297 316 315 320 316 318 295Z"
          fill="var(--scene-rock)"
          stroke="none"
          opacity=".35"
        />
        <path
          d="M308 303h10m-10 8 11 1m-7-9v5"
          fill="none"
          strokeWidth=".5"
          opacity=".18"
        />
        <path d="M304 290H322L321 295Q313 297 305 295Z" fill={paint("stone")} />
        <path d="M306 275 320 274 321 291H305Z" fill={paint("stone")} />
        <g clipPath={paint("lamp-stone")}>
          <NookThread
            relief={1.8}
            d={stoneThreads}
            color="var(--scene-rock-light)"
            shadow="var(--scene-rock)"
            highlight="var(--scene-plaster)"
            width={2.15}
          />
        </g>
        <NookThread
          relief={1.8}
          d="M307 296l-1 20M318 297l2 19M305 319l-2 7h20M305 289v-12h16v12"
          color="var(--scene-rock-light)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-plaster)"
          width={2}
        />
        <path d="M310 278H318V288H310Z" fill="var(--scene-roof)" />
        <path
          d="M306 278 308 277V288L306 289Z"
          fill="color-mix(in srgb, var(--scene-roof) 75%, var(--scene-shadow))"
        />
        <path
          d="M310 278H318V288H310Z"
          fill="var(--scene-window-light)"
          stroke="none"
          opacity=".14"
        />
        <g
          className="nook-shirogane-night"
          opacity={isDark ? 1 : 0}
          stroke="none"
        >
          <ellipse cx="314" cy="283" rx="15" ry="16" fill={paint("lamp")} />
          <path
            d="M310 278H318V288H310Z"
            fill="var(--scene-window-light)"
            opacity=".85"
          />
          <path
            d="M306 278 308 277V288L306 289Z"
            fill="var(--scene-window-light)"
            opacity=".36"
          />
        </g>
        <NookThread
          relief={1.8}
          d="M314 278v10M310 283h8"
          color="var(--scene-roof)"
          highlight="var(--scene-rock-light)"
          width={1.3}
        />
        <path d="M305 274H321V277H305Z" fill="var(--scene-rock)" />
        <path
          d="M302 271Q307 269 310 263H318Q321 269 326 271L324 274Q314 277 304 274Z"
          fill={paint("stone")}
        />
        <path
          d="M303 271Q314 274 325 271"
          fill="none"
          stroke="var(--scene-rock-light)"
          strokeWidth=".75"
          opacity=".3"
        />
        <path
          d="M309 263Q309 260 312 259L312 256Q314 255 316 256V259Q319 260 319 263Z"
          fill={paint("stone")}
        />
        <g clipPath={paint("lamp-cap")}>
          <NookThread
            relief={1.8}
            d="M309 263l-6 11M311.5 263l-4 12M314 263l-1 13M316.5 263l2 13M319 263l4 11M312 256v7M315 255v8M318 258v5"
            color="var(--scene-rock-light)"
            shadow="var(--scene-rock)"
            highlight="var(--scene-plaster)"
            width={2.1}
          />
        </g>
        <path d="M314 256v-3" fill="none" strokeWidth="1.05" />
        <NookThread
          relief={1.8}
          d="M303 272q11 5 22 0M307 291q7 1 13-1M308 296h9M304 324h20"
          color="var(--scene-rock-light)"
          shadow="var(--scene-rock)"
          highlight="var(--scene-plaster)"
          width={2.4}
        />
        <NookThread
          relief={1.8}
          d="M303 272q11 5 22 0M304 324h20"
          color="var(--scene-plaster)"
          shadow="var(--scene-rock-light)"
          highlight="var(--scene-plaster)"
          width={1.8}
          dasharray="1 2.7"
          opacity={0.75}
        />
      </g>

      {/* A deep red notice panel with the board's familiar brass and tiled cap. */}
      <ellipse
        cx="269"
        cy="359"
        rx="17"
        ry="2.2"
        fill="var(--scene-shadow)"
        opacity=".2"
      />
      <path
        d="M257 353 279 351 283 355 280 360H254L254 357Z"
        fill="var(--scene-roof)"
      />
      <path
        d="M257 353 279 351 283 355 258 357 254 357Z"
        fill="color-mix(in srgb, var(--scene-roof) 70%, var(--scene-rock-light))"
      />
      <path
        d="M260 340 265 339 265 354 259 355ZM275 339H279L278 353 273 354Z"
        fill="color-mix(in srgb, var(--scene-roof) 75%, var(--scene-shadow))"
      />
      <NookThread
        relief={1.8}
        d="M261 343v11M264 342v11M276 342l-1 11M279 342l-1 10M256 357l24-2"
        color="var(--scene-roof)"
        highlight="var(--scene-rock-light)"
        width={2.1}
      />
      <path
        d="M253 289 258 292V346L253 343Z"
        fill="color-mix(in srgb, var(--scene-timber) 42%, var(--scene-shadow))"
      />
      <path
        d="M257 290 281 289V345L257 350Z"
        fill={paint("brass")}
        stroke="var(--scene-brass)"
        strokeWidth=".65"
      />
      <path
        d="M260 294 278 293V341L260 345Z"
        fill={paint("board")}
        stroke="color-mix(in srgb, var(--scene-timber) 62%, var(--scene-shadow))"
        strokeWidth=".85"
      />
      <g clipPath={paint("board-face")}>
        <NookThread
          relief={1.8}
          d={boardThreads}
          color="color-mix(in srgb, var(--scene-timber) 86%, var(--scene-rose))"
          highlight="color-mix(in srgb, var(--scene-timber) 60%, var(--scene-rose))"
          width={2.2}
        />
      </g>
      <NookThread
        relief={1.8}
        d="M258 292v56l22-4V291ZM259 294l19-1M260 345l18-4"
        color="var(--scene-gold)"
        shadow="var(--scene-brass)"
        highlight="color-mix(in srgb, var(--scene-gold) 75%, var(--scene-paper))"
        width={2.4}
      />
      <NookThread
        relief={1.8}
        d="M258 293v54l22-3V292"
        color="var(--scene-brass)"
        shadow="var(--scene-gold)"
        highlight="var(--scene-gold)"
        width={1.7}
        dasharray="1.1 3"
        opacity={0.85}
      />
      <path
        d="M261 295 277 294M261 343l16-3"
        fill="none"
        stroke="var(--scene-gold)"
        strokeWidth=".5"
        opacity=".4"
      />
      <path
        d="M264 298v41m8-43v41"
        fill="none"
        stroke="var(--scene-shadow)"
        strokeWidth=".45"
        opacity=".13"
      />

      {/* Little irregular notices, with just enough marks to suggest writing. */}
      <g fill="var(--scene-paper)">
        <path d="m263 301 5-.7.2 9.5-4.7 1Z" opacity=".74" />
        <path d="m270.5 307 4.5-.3-.2 6.4-4.4.8Z" opacity=".86" />
        <path d="m261.5 317 4.1-.8.5 7.6-4 .9Z" opacity=".56" />
        <path d="m268.5 320 4.4-.8.6 12-4.2.9Z" opacity=".79" />
        <path d="m274 330 2.8-.6-.1 6.1-2.6.8Z" opacity=".58" />
      </g>
      <NookThread
        relief={1.8}
        d="m264 301 .2 9m1.3-9.2 .2 8.7m1.3-9 .2 8.7m4.1-2.1-.1 6m1.5-6.1-.1 5.8m1.3-6 .1 5.8m-11.6 3.8.4 7m1.1-7.2.4 7m1.1-7.3.4 7m4-3.7.6 11m.8-11.2.6 11m.8-11.2.6 11m2.2-2 .1 5.5m1.2-5.8-.1 5.4"
        color="var(--scene-paper)"
        shadow="var(--scene-timber)"
        width={1.15}
        opacity={0.9}
      />
      <path
        d="m264.3 303 2-.2m-1.9 2.2 1.7-.2m5.5 4.1 1.9-.2m-3.8 13.4 2-.3m-1.9 2.4 1.8-.3m-8.7-5.4 1.4-.2"
        fill="none"
        stroke="var(--scene-timber)"
        strokeWidth=".6"
        opacity=".45"
      />

      {/* Raised corner fittings and a single carved curl along the lower rail. */}
      <g fill={paint("brass")} stroke="var(--scene-brass)" strokeWidth=".55">
        <path d="M257 293v10l2-2v-5l4-1 1-3Z" />
        <path d="m281 292-5 1 1 3 2-.2v4l2 2Z" />
        <path d="M258 338v10l8-2-2-3-4 1v-6Z" />
        <path d="M281 332v13l-7 1 1-3 4-1v-8Z" />
        <path d="M263 348q1-7 5-5q2-7 5-4q1 3 4 3l2 2-7 3-2-2-3 4Z" />
        <path d="M265 346q1-3 3-1m1-2q0-4 2-2l1 3" fill="none" />
      </g>
      <NookThread
        relief={1.8}
        d="M253.5 298v41"
        color="var(--scene-brass)"
        shadow="var(--scene-timber)"
        highlight="var(--scene-gold)"
        width={1.9}
      />
      <path
        d="M255 307q-2-2-1-5m0 22q2 3 0 6"
        fill="none"
        stroke="var(--scene-brass)"
        strokeWidth=".8"
      />

      {/* The small cloth tassels sit below the board rather than over its notices. */}
      <path
        d="M257 348v4m22-11v4"
        fill="none"
        stroke="var(--scene-gold)"
        strokeWidth=".8"
      />
      <path
        d="m255.5 352 3-.5 1.3 6-5 .8ZM277.5 345l3-.3 1 6-4.8.6Z"
        fill="color-mix(in srgb, var(--scene-rose) 60%, var(--scene-distant))"
        stroke="color-mix(in srgb, var(--scene-rose) 65%, var(--scene-shadow))"
        strokeWidth=".5"
      />
      <NookThread
        relief={1.8}
        d="m256.6 353-.2 4m1.1-4 .6 4m20.6-10.8-.3 3.8m1.4-3.8.4 3.6"
        color="var(--scene-rose)"
        shadow="var(--scene-distant)"
        highlight="var(--scene-rose)"
        width={1.4}
      />
      <NookThread
        relief={1.8}
        d="m255.5 352 3-.5m19-6.5 3-.3"
        color="var(--scene-gold)"
        shadow="var(--scene-brass)"
        width={1.8}
      />

      {/* Curved roof courses remain legible beneath the brass roundel. */}
      <path
        d="M251 286Q257 284 260 278Q265 279 270 275Q275 280 280 278Q282 284 286 285L285 290Q269 294 252 290Z"
        fill="color-mix(in srgb, var(--scene-roof) 78%, var(--scene-shadow))"
        stroke="var(--scene-roof)"
        strokeWidth=".7"
      />
      <path
        d="M251 286Q258 284 261 279Q267 280 270 277Q275 281 280 279Q282 284 286 285L283 287Q269 291 254 289Z"
        fill="var(--scene-roof)"
      />
      <g clipPath={paint("board-roof")}>
        <NookThread
          relief={1.8}
          d={roofThreads}
          color="color-mix(in srgb, var(--scene-roof) 77%, var(--scene-rock-light))"
          highlight="var(--scene-rock-light)"
          width={2.1}
        />
      </g>
      <path
        d="m258 283-4 5m7-7-3 7m6-8-2 8m10-8 2 8m2-7 3 6m2-4 3 3"
        fill="none"
        stroke="color-mix(in srgb, var(--scene-roof) 70%, var(--scene-rock-light))"
        strokeWidth=".5"
        opacity=".25"
      />
      <NookThread
        relief={1.8}
        d="M252 289q17 4 33-2"
        color="var(--scene-gold)"
        shadow="var(--scene-brass)"
        highlight="color-mix(in srgb, var(--scene-gold) 80%, var(--scene-paper))"
        width={2.1}
      />
      <path
        d="M256 279v-4l3-2 2 6m17 0 1-5 3 2v4"
        fill="none"
        stroke={paint("brass")}
        strokeWidth="1.4"
      />
      <ellipse
        cx="270"
        cy="275.3"
        rx="5.1"
        ry="6.6"
        fill="color-mix(in srgb, var(--scene-roof) 75%, var(--scene-shadow))"
        stroke={paint("brass")}
        strokeWidth="1.05"
      />
      <ellipse
        cx="270"
        cy="275.3"
        rx="3.8"
        ry="5.2"
        fill="none"
        stroke="var(--scene-gold)"
        strokeWidth=".35"
        opacity=".65"
      />
      <NookThread
        relief={1.8}
        d="M270 269C263.5 269 263.5 281.6 270 281.6C276.5 281.6 276.5 269 270 269Z"
        color="var(--scene-gold)"
        shadow="var(--scene-brass)"
        highlight="color-mix(in srgb, var(--scene-gold) 75%, var(--scene-paper))"
        width={1.65}
        dasharray="1.4 .6"
      />
      <NookThread
        relief={1.8}
        d="m270 271-1.4 2.3 1.4 2.1 1.4-2.1Zm-2.7 5.4 1.2 2 1.1-2m.8 0 1.1 2 1.2-2"
        color="var(--scene-gold)"
        shadow="var(--scene-brass)"
        width={1.1}
      />
    </g>
  );
}
