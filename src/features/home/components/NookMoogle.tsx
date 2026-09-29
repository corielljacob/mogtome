import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { NookMoogleHeadwear } from "./NookMoogleHeadwear";
import { NookMoogleBodywear } from "./NookMoogleBodywear";
import { NookMoogleStitches } from "./NookMoogleStitches";
import { NookThread } from "./NookThread";

interface NookMoogleProps {
  className?: string;
  booped?: boolean;
  eventId?: SeasonalEventId | null;
}

// Ivory cotton picks up a little of the room's lamplight; rose and lavender
// details stay soft in every seasonal palette.
const materials = {
  ink: "color-mix(in srgb, var(--scene-ink, #604b3d) 65%, var(--scene-wood-light, #cfb189))",
  furLight:
    "color-mix(in srgb, var(--moogle-fur-light, #fffdf5) 88%, var(--scene-paper, #f8ead5))",
  fur: "color-mix(in srgb, var(--moogle-fur, #f7f3e8) 82%, var(--scene-paper, #f8ead5))",
  furShade:
    "color-mix(in srgb, var(--moogle-fur-shadow, #ddd6ca) 82%, var(--scene-pot, #c3a184))",
  wingLight:
    "color-mix(in srgb, var(--moogle-wing-light, #746477) 82%, var(--scene-paper, #f8ead5))",
  wing: "color-mix(in srgb, var(--moogle-wing, #514656) 75%, var(--scene-rose, #bc8580))",
  pomLight: "color-mix(in srgb, #f7c8ce 72%, var(--scene-paper, #f8ead5))",
  pom: "color-mix(in srgb, #db8e9f 72%, var(--scene-rose, #bc8580))",
  pomShade: "color-mix(in srgb, #b86c87 78%, var(--scene-rose, #bc8580))",
  roseLight:
    "color-mix(in srgb, var(--scene-rose, #bc8580) 53%, var(--scene-paper, #f8ead5))",
  rose: "color-mix(in srgb, var(--scene-rose, #bc8580) 72%, #d9a8b0)",
  roseShade:
    "color-mix(in srgb, var(--scene-rose, #bc8580) 80%, var(--scene-ink, #604b3d))",
};

/** A padded cord with individual wraps catching the light along its edge. */
function StitchedEdge({
  d,
  thread = materials.fur,
  shade = materials.furShade,
  light = materials.furLight,
  width = 2.6,
}: {
  d: string;
  thread?: string;
  shade?: string;
  light?: string;
  width?: number;
}) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={shade} strokeWidth={width + 1.3} opacity=".8" />
      <path d={d} stroke={thread} strokeWidth={width} />
      <path
        d={d}
        stroke={shade}
        strokeWidth={width}
        strokeDasharray=".65 2.6"
        strokeLinecap="butt"
        opacity=".65"
      />
      <path
        d={d}
        stroke={light}
        strokeWidth={width * 0.48}
        strokeDasharray="1.3 1.95"
        transform="translate(-.35 -.45)"
        opacity=".9"
      />
    </g>
  );
}

// Code-authored SVG; resting feet stay at y=244, independently of the breathing belly.
export function NookMoogle({
  className = "",
  booped = false,
  eventId = null,
}: NookMoogleProps) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-${name})`;
  const scarfInFront = eventId === "starlight" || eventId === "the-rising";
  const bodyOutline =
    "M80 155C65 161 57 177 53 197C49 218 65 237 88 239C113 243 140 235 146 216C153 196 142 171 124 159Z";
  const headOutline =
    "M99 82C71 79 46 88 37 108C32 119 32 130 34 139L28 143L33 146L29 151L36 153C43 171 69 181 99 180C129 182 155 173 164 156L171 153L167 149L172 145L166 141C169 124 164 108 153 98C140 86 119 81 99 82Z";
  const leftPaw = booped
    ? "M65 202C53 195 42 176 48 167C54 159 63 165 68 177L82 195C87 205 74 211 65 202Z"
    : "M65 180C54 180 52 192 60 204C66 214 79 217 84 209C89 201 78 190 75 188";
  const rightPaw = booped
    ? "M136 203C149 196 158 178 153 169C147 160 137 167 132 180L120 197C116 208 129 213 136 203Z"
    : "M137 182C147 181 151 193 144 205C137 215 124 217 119 209C115 202 125 193 128 190";
  const feet =
    "M70 216C58 212 47 220 47 232C46 240 58 244 72 244C86 244 94 239 90 230C87 223 80 218 70 216ZM130 216C141 211 152 220 153 231C155 240 142 244 128 244C114 244 108 239 111 231C114 223 121 219 130 216Z";
  return (
    <svg
      className={`nook-moogle-art ${className}`.trim()}
      viewBox="0 0 200 250"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-booped={booped || undefined}
      data-holiday={eventId || undefined}
    >
      <defs>
        <clipPath id={`${id}-paws-shape`}>
          <path d={leftPaw} />
          <path d={rightPaw} />
          <path d={feet} />
        </clipPath>
        <clipPath id={`${id}-nose-shape`}>
          <ellipse cx="100" cy="148" rx="11.5" ry="8" />
        </clipPath>
        <clipPath id={`${id}-wing-shape`}>
          <path d="M64 169C47 168 32 161 24 150C21 161 20 177 23 188C31 181 37 182 43 189C49 182 57 185 65 190ZM139 171C157 169 170 161 179 153C183 164 185 178 181 190C173 181 165 183 160 190C154 183 145 186 137 190Z" />
        </clipPath>
        <clipPath id={`${id}-head-shape`}>
          <path d={headOutline} />
        </clipPath>
        <clipPath id={`${id}-belly-shape`}>
          <path d={bodyOutline} />
        </clipPath>
        <radialGradient id={`${id}-fur`} cx=".3" cy=".24" r=".9">
          <stop stopColor={materials.furLight} />
          <stop offset=".62" stopColor={materials.fur} />
          <stop offset="1" stopColor={materials.furShade} />
        </radialGradient>
        <radialGradient id={`${id}-muzzle`} cx=".42" cy=".35" r=".63">
          <stop stopColor={materials.furLight} stopOpacity=".8" />
          <stop offset="1" stopColor={materials.furLight} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-wing`} x1=".2" y1="0" x2=".7" y2="1">
          <stop stopColor={materials.wingLight} />
          <stop offset="1" stopColor={materials.wing} />
        </linearGradient>
        <radialGradient id={`${id}-pom`} cx=".32" cy=".24" r=".8">
          <stop stopColor={materials.pomLight} />
          <stop offset=".65" stopColor={materials.pom} />
          <stop offset="1" stopColor={materials.pomShade} />
        </radialGradient>
        <radialGradient id={`${id}-nose`} cx=".3" cy=".2" r=".88">
          <stop stopColor={materials.roseLight} />
          <stop offset=".68" stopColor={materials.rose} />
          <stop offset="1" stopColor={materials.roseShade} />
        </radialGradient>
        <radialGradient id={`${id}-blush`}>
          <stop
            stopColor={materials.rose}
            stopOpacity={booped ? ".85" : ".65"}
          />
          <stop offset=".5" stopColor={materials.rose} stopOpacity=".28" />
          <stop offset="1" stopColor={materials.rose} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-hat`} x1=".15" y1="0" x2=".8" y2="1">
          <stop stopColor="#957e8e" />
          <stop offset=".48" stopColor="#806879" />
          <stop offset="1" stopColor="#635363" />
        </linearGradient>
      </defs>
      <g
        stroke={materials.ink}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g className="nook-moogle__wings" fill={paint("wing")}>
          <path d="M64 169C47 168 32 161 24 150C21 161 20 177 23 188C31 181 37 182 43 189C49 182 57 185 65 190Z" />
          <path d="M139 171C157 169 170 161 179 153C183 164 185 178 181 190C173 181 165 183 160 190C154 183 145 186 137 190Z" />
          <g clipPath={paint("wing-shape")}>
            <NookMoogleStitches
              part="wings"
              color={materials.wingLight}
              shade={materials.wing}
              light="#b9a7bf"
            />
          </g>
          <g stroke={materials.wingLight} strokeWidth=".85" opacity=".65">
            <path d="M25 154Q31 176 61 181M25 154Q32 173 43 187" />
            <path d="M178 156Q167 177 140 182M178 156Q167 174 160 187" />
          </g>
          <path
            d="M29 160Q38 170 49 172M174 162Q165 172 153 174"
            stroke="#b1a0b2"
            opacity=".28"
          />
          <StitchedEdge
            d="M24 150C21 161 20 177 23 188C31 181 37 182 43 189C49 182 57 185 65 190M179 153C183 164 185 178 181 190C173 181 165 183 160 190C154 183 145 186 137 190"
            thread={materials.wingLight}
            shade={materials.wing}
            light="#b9a7bf"
            width={1.7}
          />
        </g>

        <g className="nook-moogle__belly">
          <path d={bodyOutline} fill={paint("fur")} />
          <path
            d="M85 181C71 187 68 204 77 219C86 232 117 233 128 218C138 204 127 184 115 181C104 178 96 177 85 181Z"
            fill={paint("muzzle")}
            stroke="none"
          />
          <path
            d="M140 207C140 222 129 232 118 234"
            stroke={materials.furShade}
            strokeWidth="1.5"
            opacity=".5"
          />
          <path
            d="M95 226Q100 229 105 226"
            stroke={materials.furShade}
            strokeWidth=".75"
            opacity=".5"
          />
          <g clipPath={paint("belly-shape")}>
            <NookMoogleStitches
              part="belly"
              color={materials.fur}
              shade={materials.furShade}
              light={materials.furLight}
            />
          </g>
          <StitchedEdge d={bodyOutline} />
          <g
            clipPath={paint("belly-shape")}
            stroke={materials.furShade}
            strokeWidth=".8"
            opacity=".6"
          >
            <path d="M100 185Q104 207 99 230" strokeDasharray="2.3 3.2" />
          </g>
        </g>

        {!scarfInFront && (
          <NookMoogleBodywear eventId={eventId} paint={paint} />
        )}

        <g className="nook-moogle__head" transform="rotate(-6 100 142)">
          <g className="nook-moogle__ears" fill={paint("fur")}>
            <path d="M48 108C40 96 40 76 47 64C61 66 77 80 80 95Z" />
            <path d="M124 95C130 81 144 70 154 70C162 83 158 100 148 112Z" />
            <path
              d="M48 76Q46 91 54 101L72 94Q61 80 48 76Z"
              fill={materials.roseLight}
              stroke="none"
            />
            <path
              d="M151 80Q155 92 145 104L132 96Q139 85 151 80Z"
              fill={materials.roseLight}
              stroke="none"
            />
            <path
              d="M52 99L58 95L57 90L63 93L65 89L69 96M133 100L137 94L138 99L144 95L143 104"
              fill={materials.furLight}
              stroke="none"
            />
            <StitchedEdge
              d="M48 108C40 96 40 76 47 64C61 66 77 80 80 95M124 95C130 81 144 70 154 70C162 83 158 100 148 112"
              width={2}
            />
            <NookThread
              d="M47 70q2 13 10 25M51 71q3 13 11 24M55 73q3 10 11 20M151 75q-2 14-9 24M147 77q-2 12-9 20M143 80l-9 14"
              color={materials.roseLight}
              shadow={materials.rose}
              highlight={materials.furLight}
              width={2}
            />
          </g>
          <path
            d="M67 157C70 168 80 177 91 179L94 176L100 179L104 176L110 177C123 173 133 164 137 155Z"
            fill={paint("fur")}
            stroke="none"
          />
          <path d={headOutline} fill={paint("fur")} />
          <path
            d="M153 108C163 133 157 156 138 168C124 175 113 176 101 178C129 182 155 172 163 156L170 153L166 149L171 145L165 141C168 126 164 114 159 108Z"
            fill={materials.furShade}
            stroke="none"
            opacity=".3"
          />
          <path
            d="M46 116C50 102 62 93 79 91"
            stroke={materials.furLight}
            strokeWidth="1.6"
            opacity=".55"
          />
          <ellipse
            cx="72"
            cy="150"
            rx="31"
            ry="24"
            fill={paint("muzzle")}
            stroke="none"
          />
          <ellipse
            cx="130"
            cy="150"
            rx="32"
            ry="24"
            fill={paint("muzzle")}
            stroke="none"
          />
          <path
            d="m86 89 5 3 2-5 5 4"
            stroke={materials.furLight}
            strokeWidth="2"
            opacity=".8"
          />
          <g clipPath={paint("head-shape")}>
            <NookMoogleStitches
              part="face"
              color={materials.fur}
              shade={materials.furShade}
              light={materials.furLight}
            />
          </g>
          <StitchedEdge d={headOutline} width={3} />
          {/* Short laid stitches fan around the cheeks, following the padding. */}
          <g
            clipPath={paint("head-shape")}
            stroke={materials.furShade}
            strokeWidth=".9"
            opacity=".7"
          >
            <path d="m39 131 6-3m-6 9 7-3m-7 10 7-3m-5 10 7-4m-3 10 7-5m-1 10 7-5m1 9 6-5m3 8 6-6M156 122l6 3m-7 3 7 3m-7 3 7 3m-8 3 7 3m-8 3 7 3m-9 3 6 4m-9 2 5 4m-10 1 5 5" />
          </g>
          <g className="nook-moogle__face">
            <ellipse
              cx="54"
              cy="151"
              rx="19"
              ry="12"
              fill={paint("blush")}
              stroke="none"
            />
            <ellipse
              cx="147"
              cy="151"
              rx="19"
              ry="12"
              fill={paint("blush")}
              stroke="none"
            />
            <g stroke={materials.ink} strokeWidth="2.5">
              <path
                d={booped ? "M56 137Q66 124 77 137" : "M55 133Q65 142 77 135"}
              />
              <path
                d={
                  booped
                    ? "M124 137Q134 124 145 137"
                    : "M124 135Q135 142 146 133"
                }
              />
            </g>
            <g
              stroke={materials.furLight}
              strokeWidth=".65"
              strokeDasharray=".8 2.2"
              opacity=".7"
            >
              <path
                d={booped ? "M56 137Q66 124 77 137" : "M55 133Q65 142 77 135"}
              />
              <path
                d={
                  booped
                    ? "M124 137Q134 124 145 137"
                    : "M124 135Q135 142 146 133"
                }
              />
            </g>
            <ellipse
              cx="100"
              cy="148"
              rx="11.5"
              ry="8"
              fill={paint("nose")}
              stroke={materials.roseShade}
              strokeWidth=".7"
            />
            <g clipPath={paint("nose-shape")}>
              <NookThread
                d="M90 139q-2 9 2 19m1-19q-2 9 2 19m1-19q-2 9 2 19m1-19q-2 9 2 19m1-19q-2 9 2 19m1-19q-2 9 2 19m1-19q-2 9 2 19"
                color={materials.rose}
                shadow={materials.roseShade}
                highlight={materials.roseLight}
                width={1.8}
              />
            </g>
            <path
              d="M95 145Q98 143 101 144"
              stroke={materials.furLight}
              strokeWidth="1"
              opacity=".7"
            />
            {booped ? (
              <g>
                <path
                  d="M92 160Q100 164 109 159C109 174 94 175 92 160Z"
                  fill="#896471"
                  strokeWidth=".9"
                />
                <path
                  d="M96 168Q102 164 106 167Q102 173 96 168Z"
                  fill="#e5aeb8"
                  stroke="none"
                />
              </g>
            ) : (
              <path
                d="M91 160Q96 166 100 160Q104 166 110 159"
                stroke={materials.ink}
                strokeWidth="1.3"
              />
            )}
            <g stroke={materials.rose} strokeWidth="1.1" opacity=".6">
              <path d="m48 150-1 3m6-2-1 3m95-3-1 3m6-4-1 3" />
            </g>
          </g>
          <NookMoogleHeadwear eventId={eventId} paint={paint} />
        </g>

        {scarfInFront && <NookMoogleBodywear eventId={eventId} paint={paint} />}

        <g className="nook-moogle__paws" fill={paint("fur")}>
          <path d={leftPaw} />
          <path d={rightPaw} />
          <path
            d={booped ? "M49 175l4 1m94 1 4-2" : "m72 205 3 3m51-1 4-2"}
            stroke={materials.furShade}
            strokeWidth=".75"
          />
          <path d={feet} />
          <g clipPath={paint("paws-shape")}>
            <NookThread
              d={Array.from(
                { length: 13 },
                (_, i) =>
                  `M${46 + i * 3.4} 159q-9 26 8 53M${114 + i * 3.4} 159q9 26-8 53M${46 + i * 3.4} 215q-4 15 5 30M${111 + i * 3.4} 215q4 15-5 30`,
              ).join(" ")}
              color={materials.fur}
              shadow={materials.furShade}
              highlight={materials.furLight}
              width={2}
            />
          </g>
          <StitchedEdge d={leftPaw} width={1.5} />
          <StitchedEdge d={rightPaw} width={1.5} />
          <StitchedEdge
            d="M70 216C58 212 47 220 47 232C46 240 58 244 72 244C86 244 94 239 90 230C87 223 80 218 70 216ZM130 216C141 211 152 220 153 231C155 240 142 244 128 244C114 244 108 239 111 231C114 223 121 219 130 216Z"
            width={2}
          />
          <g fill={materials.roseLight} stroke="none" opacity=".65">
            <ellipse
              cx="69"
              cy="235"
              rx="7.5"
              ry="4.8"
              transform="rotate(12 69 235)"
            />
            <ellipse
              cx="131"
              cy="235"
              rx="7.5"
              ry="4.8"
              transform="rotate(-12 131 235)"
            />
            <circle cx="60" cy="228" r="2.4" />
            <circle cx="67" cy="225" r="2.5" />
            <circle cx="74" cy="226" r="2.1" />
            <circle cx="140" cy="228" r="2.4" />
            <circle cx="133" cy="225" r="2.5" />
            <circle cx="126" cy="226" r="2.1" />
          </g>
          <path
            d="M52 229Q52 221 59 220M143 221Q148 224 148 231"
            stroke={materials.furLight}
            strokeWidth="1.2"
            opacity=".65"
          />
          <path
            d="M60 237L60 240M67 238L68 242M133 238L133 242M140 235L141 239"
            stroke={materials.furShade}
            strokeWidth=".8"
          />
        </g>

        <g className="nook-moogle__bobble">
          <g className="nook-moogle__antenna">
            <path
              d="M101 84C98 73 103 64 116 57C125 52 129 45 129 38"
              stroke={materials.ink}
              strokeWidth="1.8"
            />
          </g>
          <g className="nook-moogle__pom">
            <circle
              cx="131"
              cy="29"
              r="27"
              fill={paint("pom")}
              stroke={materials.pomShade}
              strokeWidth=".9"
            />
            <ellipse
              cx="121"
              cy="17"
              rx="9"
              ry="5.5"
              transform="rotate(-32 121 17)"
              fill={materials.pomLight}
              stroke="none"
              opacity=".7"
            />
            <path
              d="M109 30Q108 21 113 15"
              stroke={materials.pomLight}
              strokeWidth="1.3"
              opacity=".5"
            />
            <path
              d="M151 32C149 44 142 50 133 52"
              stroke={materials.pomShade}
              strokeWidth="1"
              opacity=".3"
            />
            <g transform="rotate(-30 131 29)">
              <NookMoogleStitches
                part="pom"
                color={materials.pom}
                shade={materials.pomShade}
                light={materials.pomLight}
              />
            </g>
            <StitchedEdge
              d="M158 29A27 27 0 1 1 104 29A27 27 0 1 1 158 29Z"
              thread={materials.pom}
              shade={materials.pomShade}
              light={materials.pomLight}
              width={2.6}
            />
            <path
              d="M129 5C112 17 112 37 128 53M136 6C122 20 124 38 139 52"
              stroke={materials.pomLight}
              strokeWidth="1"
              strokeDasharray="2.6 2"
              opacity=".65"
            />
          </g>
        </g>
        {booped && (
          <g
            className="nook-moogle__affection"
            fill={materials.pom}
            stroke={materials.pomShade}
            strokeWidth=".7"
          >
            <path d="M20 106C6 99 7 89 14 90Q18 90 20 95Q25 86 30 91C37 97 26 103 20 106Z" />
            <path d="M178 91C168 83 170 77 175 78Q178 78 180 82Q185 76 188 80C192 86 182 91 178 91Z" />
            <path
              d="m167 63 1.5 4.5L173 69l-4.5 1.5L167 75l-1.5-4.5L161 69l4.5-1.5Z"
              fill="var(--scene-gold)"
              stroke="none"
            />
          </g>
        )}
      </g>
    </svg>
  );
}
