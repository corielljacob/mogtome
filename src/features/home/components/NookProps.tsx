import { useId } from "react";
import { NookCloth } from "./NookCloth";
import { NookCoffee } from "./NookCoffee";
import { NookPlant } from "./NookPlant";
import { NookLedge } from "./NookLedge";
import { NookLantern } from "./NookLantern";
import { NookThread } from "./NookThread";

const cushionOutline =
  "M123 388Q130 394 134 392Q182 379 229 391Q235 394 242 387Q240 398 244 407Q248 421 242 429Q244 434 240 437Q233 432 226 434Q183 441 138 434Q129 432 122 436Q119 434 123 428Q117 415 122 402Q125 394 123 388Z";
const roseSpine =
  "M24 340Q33 337 43 341V432Q33 435 24 432Q20 430 20 425V348Q20 342 24 340Z";
const blueSpine =
  "M52 362Q60 359 69 362V433Q60 436 52 433Q49 430 49 426V369Q49 364 52 362Z";
const lowerPages = "M80 426 117 423V432L81 435Q77 434 77 431Q77 428 80 426Z";
const upperPages = "M83 413 114 410V417L84 421Q79 421 79 417Q79 414 83 413Z";

interface NookPropsProps {
  isDark: boolean;
}

// Everything shares the room's coordinate space, material palette, and ledge.
export function NookProps({ isDark }: NookPropsProps) {
  const id = useId().replace(/:/g, "");
  const ref = (name: string) => `url(#${id}-prop-${name})`;

  return (
    <g strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <clipPath id={`${id}-prop-cushion-clip`}>
          <path d={cushionOutline} />
        </clipPath>
        <clipPath id={`${id}-prop-rose-clip`}>
          <path d={roseSpine} />
        </clipPath>
        <clipPath id={`${id}-prop-blue-clip`}>
          <path d={blueSpine} />
        </clipPath>
        <clipPath id={`${id}-prop-lower-pages-clip`}>
          <path d={lowerPages} />
        </clipPath>
        <clipPath id={`${id}-prop-upper-pages-clip`}>
          <path d={upperPages} />
        </clipPath>
        <linearGradient id={`${id}-prop-cushion`} x1=".2" y1="0" x2=".6" y2="1">
          <stop stopColor="var(--scene-cushion-light, #d0a09b)" />
          <stop offset=".45" stopColor="var(--scene-cushion, #b27e84)" />
          <stop offset="1" stopColor="var(--scene-cushion, #b27e84)" />
        </linearGradient>
        <linearGradient id={`${id}-prop-book-rose`} x2="1" y2=".08">
          <stop stopColor="var(--scene-book-rose)" />
          <stop
            offset=".25"
            stopColor="color-mix(in srgb, var(--scene-book-rose) 74%, var(--scene-paper))"
          />
          <stop offset=".72" stopColor="var(--scene-book-rose)" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-book-rose) 74%, var(--scene-shadow))"
          />
        </linearGradient>
        <linearGradient id={`${id}-prop-book-blue`} x2="1" y2="0">
          <stop stopColor="color-mix(in srgb, var(--scene-book-blue) 76%, var(--scene-shadow))" />
          <stop
            offset=".28"
            stopColor="color-mix(in srgb, var(--scene-book-blue) 72%, var(--scene-paper))"
          />
          <stop offset=".75" stopColor="var(--scene-book-blue)" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-book-blue) 82%, var(--scene-shadow))"
          />
        </linearGradient>
        <linearGradient
          id={`${id}-prop-book-pages`}
          x1="0"
          y1="0"
          x2=".3"
          y2="1"
        >
          <stop stopColor="var(--scene-paper)" />
          <stop offset=".55" stopColor="var(--scene-paper)" />
          <stop offset="1" stopColor="var(--scene-wood-light)" />
        </linearGradient>
      </defs>

      <NookLedge />

      {/* A soft seat cushion has piped edges and loose, hand-sewn quilting. */}
      <ellipse
        cx="184"
        cy="435"
        rx="64"
        ry="4"
        fill="var(--scene-shadow)"
        opacity=".22"
        stroke="none"
      />
      <path d={cushionOutline} fill={ref("cushion")} />
      <g clipPath={ref("cushion-clip")}>
        {Array.from({ length: 59 }, (_, i) => {
          const x = 104 + i * 2.35;
          return (
            <NookThread
              key={i}
              d={`M${x} 382Q${x + 12} 406 ${x + 24} 441`}
              color={
                i % 3
                  ? "var(--scene-cushion, #b27e84)"
                  : "var(--scene-cushion-light, #d0a09b)"
              }
              width={1.55}
              opacity={0.8}
              dasharray={i % 2 ? "9 .8 13 .7" : "14 .8 8 .7"}
            />
          );
        })}
      </g>
      <NookThread
        d={cushionOutline}
        color="var(--scene-cushion, #b27e84)"
        width={2.2}
      />
      <NookThread
        d="M127 399Q176 382 235 398Q241 412 237 427Q184 439 129 428Q123 414 127 399Z"
        color="var(--scene-cushion-light, #d0a09b)"
        width={1.6}
      />
      <NookThread
        d="M128 400Q176 384 234 399Q239 412 236 426Q184 436 130 427Q125 414 128 400Z"
        color="var(--scene-paper)"
        width={0.85}
        dasharray="2.1 2.3"
        opacity={0.85}
      />
      <path
        d="M128 430Q181 442 236 430"
        stroke="var(--scene-shadow)"
        strokeWidth="2"
        opacity=".14"
      />
      <NookThread
        d="M138 397q12 12 29 33M157 391q13 15 31 44M182 389q14 17 32 42M207 391q12 13 25 31M142 430q15-20 33-40M167 435q20-28 36-43M195 434q17-22 30-37"
        color="var(--scene-cushion-light, #d0a09b)"
        width={1.05}
        dasharray="2.1 1.8"
        opacity={0.94}
      />
      <path
        d="m123 390 9 12m108-12-10 13m-106 29 10-8m105 9-10-9"
        stroke="var(--scene-shadow)"
        opacity=".23"
      />
      <path
        d="M141 392q32-8 65-2m-78 18q-3 9 0 16"
        stroke="var(--scene-cushion-light, #d0a09b)"
        strokeWidth="2"
        opacity=".5"
      />

      <NookCloth />

      {/* Two keepsake volumes rest together beside a low stack of reading books. */}
      <g className="nook-shelf-books" strokeWidth="1.05">
        <ellipse
          cx="68"
          cy="436"
          rx="52"
          ry="3.6"
          fill="var(--scene-shadow)"
          stroke="none"
          opacity=".2"
        />
        <path
          d="M24 434Q36 436 53 434M51 435H76M78 435 115 436"
          stroke="var(--scene-shadow)"
          strokeWidth="2.2"
          opacity=".36"
        />

        {/* The tall volume leans gently against its neighbour, on its lower edge. */}
        <g transform="rotate(4 27 433)">
          <path
            d="M24 339Q35 336 46 339L52 343V430L46 434H24Q20 431 20 425V348Q20 342 24 339Z"
            fill="var(--scene-book-rose)"
          />
          <path
            d="M43 343 50 345V428L44 431Z"
            fill="color-mix(in srgb, var(--scene-book-rose) 78%, var(--scene-shadow))"
            strokeWidth=".75"
          />
          <path
            d="M46 347V427M48 350V425"
            stroke="var(--scene-book-rose)"
            strokeWidth=".55"
            opacity=".56"
          />
          <path d={roseSpine} fill={ref("book-rose")} />
          <g clipPath={ref("rose-clip")}>
            {Array.from({ length: 16 }, (_, i) => (
              <NookThread
                key={i}
                d={`M${20 + i * 1.55} 338Q${19.3 + i * 1.55} 384 ${20.2 + i * 1.55} 435`}
                color="var(--scene-book-rose)"
                width={1.03}
                dasharray={i % 2 ? "10 .8 6 1" : "6 1 11 .8"}
                opacity={0.92}
              />
            ))}
          </g>
          <NookThread
            d="M45 345v84M47 346v82M49 347v79"
            color="var(--scene-book-rose)"
            width={1}
            dasharray="5 .8"
          />
          <NookThread
            d={roseSpine}
            color="var(--scene-book-rose)"
            width={1.65}
          />
          <path
            d="M23 341Q32 338 43 341L50 343M24 431Q33 434 43 431L50 428"
            fill="none"
            stroke="var(--scene-book-rose)"
            strokeWidth="1.8"
          />
          <NookThread
            d="M24 346Q32 344 40 346V426Q32 429 24 426Z"
            color="var(--scene-gold)"
            width={0.85}
            dasharray="2 1.35"
            opacity={0.94}
          />
          <path
            d="M21 353Q31 351 43 353M21 358Q31 356 43 358M21 415Q32 418 43 415M21 421Q32 424 43 421"
            stroke="var(--scene-shadow)"
            strokeWidth="2.2"
            opacity=".22"
          />
          <NookThread
            d="M21 352Q31 350 43 352M21 357Q31 355 43 357M21 414Q32 417 43 414M21 420Q32 423 43 420"
            color="var(--scene-gold)"
            width={1.6}
          />
          <NookThread
            d="M33 396q-4-12 0-23m-1 14q-7-1-7-7q6 1 7 7m0-7q6-2 6-8q-5 2-6 8m0 13q5 0 6-5q-5 0-6 5"
            color="var(--scene-gold)"
            width={1.25}
          />
          <NookThread
            d="m25 350 .4 3m5-3 .2 3m5.4-3-.2 3m5-2.4-.2 3m-15 62 .4 3m5-2.2 .2 3m5.4-3.2-.2 3m5-3.4-.2 3m-11-36 2-1m.1-6.1 2.4.2m-.4 16 2-1"
            color="var(--scene-paper)"
            width={0.65}
            opacity={0.8}
          />
          <path
            d="M28 400q4 2 8 0M24 366l1 0M39 366l1 0M24 404l1 0M39 404l1 0"
            stroke="var(--scene-gold)"
            strokeWidth=".75"
          />
          <path
            d="M22 363V407"
            stroke="var(--scene-paper)"
            strokeWidth=".7"
            opacity=".26"
          />
        </g>

        {/* The moon atlas keeps its rounded spine and a narrow blue cover face. */}
        <path
          d="M52 361Q61 358 70 361L77 364V432L71 435H52Q48 432 48 426V369Q48 364 52 361Z"
          fill="var(--scene-book-blue)"
        />
        <path
          d="M69 364 75 366V429L69 432Z"
          fill="color-mix(in srgb, var(--scene-book-blue) 78%, var(--scene-shadow))"
          strokeWidth=".75"
        />
        <path
          d="M71 368V429M73 372V426"
          stroke="var(--scene-book-blue)"
          strokeWidth=".55"
          opacity=".56"
        />
        <path d={blueSpine} fill={ref("book-blue")} />
        <g clipPath={ref("blue-clip")}>
          {Array.from({ length: 14 }, (_, i) => (
            <NookThread
              key={i}
              d={`M${49 + i * 1.6} 360Q${48.5 + i * 1.6} 397 ${49.2 + i * 1.6} 436`}
              color="var(--scene-book-blue)"
              width={1.05}
              dasharray={i % 2 ? "8 .8 12 1" : "13 .8 7 1"}
              opacity={0.95}
            />
          ))}
        </g>
        <NookThread
          d="M70.5 366v64M72.5 367v61M74.5 368v59"
          color="var(--scene-book-blue)"
          width={1.1}
          dasharray="5 .8"
        />
        <NookThread d={blueSpine} color="var(--scene-book-blue)" width={1.7} />
        <path
          d="M53 366Q60 364 66 366M53 430Q60 432 66 430"
          stroke="var(--scene-paper)"
          strokeWidth=".85"
          opacity=".65"
        />
        <NookThread
          d="M54 375V421M64 375V421"
          color="var(--scene-gold)"
          width={0.8}
          dasharray="1.8 1.8"
          opacity={0.86}
        />
        <NookThread
          d="M49 372Q60 374 69 372M49 426Q60 428 69 426"
          color="var(--scene-gold)"
          width={1.65}
        />
        <path
          d="M61 389C54 390 53 401 61 404C49 405 49 390 61 389Z"
          fill="var(--scene-gold)"
          strokeWidth=".55"
          stroke="var(--scene-gold)"
        />
        <NookThread
          d="m55 391 2.8 .8m-4.2 1.3 2.6 .7m-3.3 1.5 2.4 .6m-2.6 1.4 2.3 .6m-2 1.3 2.3 .6m-1.3 1.3 2.7 .6m-1 1.2 3 .7"
          color="var(--scene-gold)"
          width={1}
        />
        <NookThread
          d="m52 371 .4 3m4-2.6 .3 3m4-3 .2 3m4-3.1-.2 3m-12 50 .2 3m4-2.6 .3 3m4-3 .2 3m4-3.1-.2 3"
          color="var(--scene-paper)"
          width={0.7}
          opacity={0.75}
        />
        <path
          d="M63 383v4m-2-2h4M59 412v2m-1-1h2"
          stroke="var(--scene-gold)"
          strokeWidth=".75"
          opacity=".85"
        />
        <path
          d="M70 363h3v13l-1.5-1.8L70 376Z"
          fill="var(--scene-rose)"
          strokeWidth=".65"
        />

        {/* Flat books have projecting covers and softly uneven, exposed pages. */}
        <path
          d="M76 423 111 419 118 423V434L82 437Q76 436 75 432Z"
          fill="var(--scene-leaf)"
        />
        <path d={lowerPages} fill={ref("book-pages")} strokeWidth=".8" />
        <g clipPath={ref("lower-pages-clip")}>
          {Array.from({ length: 7 }, (_, i) => (
            <NookThread
              key={i}
              d={`M77 ${426.3 + i * 1.5}Q95 ${425.3 + i * 1.5} 118 ${422.3 + i * 1.5}`}
              color="var(--scene-paper)"
              width={0.95}
              dasharray={i % 2 ? "13 .7 9 .6" : "8 .6 14 .7"}
            />
          ))}
        </g>
        <path
          d="M76 423 111 419 118 422 82 427Q77 427 76 423Z"
          fill="var(--scene-leaf-light)"
          strokeWidth=".8"
        />
        <NookThread
          d="M79 423.4 111 419.8M80.5 424.7 114 421M82 426 115.5 422.2"
          color="var(--scene-leaf-light)"
          width={1.05}
          dasharray="5 .7"
        />
        <NookThread
          d="M76 424Q73 431 78 435Q80 437 84 436L118 433"
          color="var(--scene-leaf)"
          width={2.7}
        />
        <NookThread
          d="m75.8 427 2.3 .7m-2.5 2 2.3 .5m-1.8 2.3 2.4-.4m.2 3 1.5-2m3 3.3-.3-2.5m3.7 2.2-.3-2.5m3.7 2.2-.3-2.5m3.7 2.2-.3-2.5m3.7 2.2-.3-2.5m3.7 2.2-.3-2.5m3.7 2.2-.3-2.5m3.7 2.2-.3-2.5m3.7 2.2-.3-2.5"
          color="var(--scene-leaf-light)"
          width={0.78}
        />
        <path
          d="M80 423 111 421M82 436 115 433"
          stroke="var(--scene-paper)"
          strokeWidth=".65"
          opacity=".43"
        />

        <path
          d="M79 410 109 407 116 410V419L85 423Q78 423 77 419V414Q77 411 79 410Z"
          fill="var(--scene-book-rose)"
        />
        <path d={upperPages} fill={ref("book-pages")} strokeWidth=".75" />
        <g clipPath={ref("upper-pages-clip")}>
          {Array.from({ length: 6 }, (_, i) => (
            <NookThread
              key={i}
              d={`M79 ${413.2 + i * 1.5}Q96 ${412.2 + i * 1.5} 115 ${409 + i * 1.5}`}
              color="var(--scene-paper)"
              width={0.95}
              dasharray={i % 2 ? "10 .7 6 .8" : "6 .8 11 .7"}
            />
          ))}
        </g>
        <path
          d="M79 410 109 406 116 409 85 414Q80 414 79 410Z"
          fill="color-mix(in srgb, var(--scene-book-rose) 66%, var(--scene-paper))"
          strokeWidth=".8"
        />
        <NookThread
          d="M81.5 410.2 109 406.8M83 411.7 112 408M84.5 413 113.5 409.2"
          color="var(--scene-book-rose)"
          width={1}
          dasharray="5 .7"
        />
        <NookThread
          d="M83 410 107 407.5 111 409 87 412Z"
          color="var(--scene-gold)"
          width={0.7}
          dasharray="1.6 1.2"
          opacity={0.9}
        />
        <NookThread
          d="M79 411Q75 419 81 422Q83 423 87 422L116 418"
          color="var(--scene-book-rose)"
          width={2.3}
        />
        <NookThread
          d="m78.2 414 2.2 .6m-2.7 1.9 2.3 .4m-1.8 2.3 2.1-.7m-.2 3 1.6-1.7m2.1 2.8-.2-2.2m3.7 1.8-.2-2.2m3.7 1.8-.2-2.2m3.7 1.8-.2-2.2m3.7 1.8-.2-2.2m3.7 1.8-.2-2.2m3.7 1.8-.2-2.2m3.7 1.8-.2-2.2m3.7 1.8-.2-2.2"
          color="var(--scene-gold)"
          width={0.7}
        />
        <path
          d="m96 420 1 9 2-2 2 2-1-9"
          fill="var(--scene-rose)"
          strokeWidth=".65"
        />
        <NookThread
          d="m97.2 420.3.8 6.6m1.6-6.7.7 6.5"
          color="var(--scene-rose)"
          width={0.85}
          dasharray="1.1 .7"
        />
        <path
          d="M87 423 114 420"
          stroke="var(--scene-shadow)"
          strokeWidth="1"
          opacity=".28"
        />
      </g>

      <NookPlant />

      <NookCoffee />

      <NookLantern isDark={isDark} />
    </g>
  );
}
