import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";

interface NookMoogleProps {
  className?: string;
  booped?: boolean;
  eventId?: SeasonalEventId | null;
}

// Ivory plush picks up a little of the room's lamplight; rose and lavender
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

function Flower({
  x,
  y,
  summer = false,
}: {
  x: number;
  y: number;
  summer?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`} strokeWidth=".75">
      <path
        d="M-2 5Q-15 7-14-4Q-4-6-2 5M3 4Q7-9 15-5Q15 5 3 4"
        fill="#879878"
        stroke="#64755c"
      />
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cy="-5"
          rx={summer ? "5.4" : "4.2"}
          ry="6"
          transform={`rotate(${angle})`}
          fill={summer ? "#df927a" : "#efc7c9"}
          stroke={summer ? "#b67565" : "#bf949b"}
        />
      ))}
      <circle r="3" fill="#edcc79" stroke="#bda066" />
      {summer && <path d="M0 0Q5 2 8-3" stroke="#f6dba1" strokeWidth="1.4" />}
    </g>
  );
}

function Headwear({
  eventId,
  paint,
}: {
  eventId?: SeasonalEventId | null;
  paint: (name: string) => string;
}) {
  switch (eventId) {
    case "all-saints-wake":
      return (
        <g className="nook-moogle__hat" stroke="#695360" strokeWidth="1.05">
          <path
            d="M28 83C42 75 90 74 113 82C129 88 106 99 77 97C51 96 24 91 28 83Z"
            fill="#ab805d"
          />
          <path
            d="M47 81C51 68 54 50 49 42C45 37 39 39 31 39C35 28 50 23 61 30C78 40 79 59 95 79C83 91 59 91 47 81Z"
            fill={paint("hat")}
          />
          <path
            d="M47 40C56 35 62 40 65 47C70 60 70 70 78 83"
            stroke="#a58aa1"
            opacity=".48"
            fill="none"
          />
          <path
            d="M49 69C61 76 78 74 87 69L95 80C85 89 62 91 47 81Z"
            fill="#b67a5b"
            stroke="#79564f"
          />
          <path
            d="M28 83C49 92 82 93 107 84C117 80 126 84 116 89C101 99 60 103 36 94C27 91 23 86 28 83Z"
            fill="#756078"
          />
          <path
            d="M37 87C58 94 86 92 99 88"
            stroke="#bba0b2"
            strokeWidth="1.1"
            opacity=".45"
          />
          <path
            d="M80 72A6 6 0 1 0 87 80A5 5 0 0 1 80 72Z"
            fill="#ddbf8c"
            stroke="#8f6c4b"
            strokeWidth=".8"
          />
          <path
            d="M55 48L56 51L59 52L56 53L55 56L54 53L51 52L54 51Z"
            fill="#d4b27d"
            stroke="none"
            opacity=".9"
          />
        </g>
      );
    case "little-ladies":
      return <Flower x={139} y={94} />;
    case "moonfire-faire":
      return <Flower x={139} y={94} summer />;
    case "make-it-rain":
      return (
        <g transform="rotate(-9 64 82)" stroke="#64544f" strokeWidth="1.1">
          <ellipse cx="65" cy="85" rx="27" ry="6" fill="#665b65" />
          <path
            d="M45 81L47 56Q65 51 83 56L85 81Q65 87 45 81Z"
            fill="#776a77"
          />
          <path d="M46 74Q65 80 84 74L85 81Q65 87 45 81Z" fill="#d8b775" />
          <ellipse cx="65" cy="56" rx="18" ry="4" fill="#93818c" />
          <circle cx="73" cy="77" r="4" fill="#ecd294" stroke="#a0834e" />
        </g>
      );
    case "heavensturn":
      return (
        <g
          transform="translate(139 95) rotate(15)"
          stroke="#a16761"
          strokeWidth="1"
        >
          <path
            d="M0 0C-19-3-17-17-10-14L0-6C10-21 20-12 14-4L5 1L10 13L4 11L0 3L-6 12L-10 10Z"
            fill="#c98579"
          />
          <path d="M-10-10L-3-4M5-4L11-9" stroke="#f0be9c" />
          <circle r="3.5" fill="#e6c077" />
          <path d="M1 4L2 17" stroke="#b59662" />
          <circle cx="2" cy="18" r="3.7" fill="#e5c68a" stroke="#a48755" />
        </g>
      );
    default:
      return null;
  }
}

function Bodywear({
  eventId,
  paint,
}: {
  eventId?: SeasonalEventId | null;
  paint: (name: string) => string;
}) {
  switch (eventId) {
    case "all-saints-wake":
      return (
        <g stroke="#695360" strokeWidth="1.05">
          <path
            d="M67 160C51 171 46 193 48 214C67 213 74 201 81 180L99 176L128 178C135 199 144 209 155 209C153 187 142 168 130 162Z"
            fill={paint("hat")}
          />
          <path
            d="M58 179C53 191 51 204 51 210C61 206 65 197 68 187M137 181C145 191 149 201 151 205L140 199"
            fill="#b98b65"
            stroke="none"
            opacity=".75"
          />
          <path
            d="M66 167C82 179 116 181 133 169L137 180C121 195 79 192 62 178Z"
            fill="#806880"
          />
          <path
            d="M71 175C87 185 115 187 129 178"
            fill="none"
            stroke="#b798a5"
            opacity=".55"
          />
          <circle cx="103" cy="185" r="4.5" fill="#e0bb78" stroke="#9b7953" />
          <path
            d="M105 182A3 3 0 1 0 106 187A3 3 0 0 1 105 182Z"
            fill="#72536f"
            stroke="none"
          />
        </g>
      );
    case "starlight":
      return (
        <g stroke="#9b6163" strokeWidth="1.1">
          <path d="M73 173L91 181L85 215Q78 218 70 212Z" fill="#b77a7d" />
          <path
            d="M73 197L86 202M72 204L85 208"
            stroke="#e3beb0"
            strokeWidth="3"
          />
          <path d="M70 211L69 216M75 214L74 219M81 215L80 220" />
          <path
            d="M65 163C83 176 117 178 135 166L139 176C119 191 86 190 66 179Z"
            fill="#c98b87"
          />
          <path d="M75 177C91 184 114 184 128 177" stroke="#edc3ad" />
          <path
            d="M126 178L119 167L125 168L129 163L131 170L138 172L130 178M129 177L139 178L137 182L140 187L133 186L130 190Z"
            fill="#657f65"
            stroke="#53684f"
          />
          <circle cx="129" cy="179" r="3" fill="#aa6067" />
          <circle cx="125" cy="182" r="2.5" fill="#bd7775" />
        </g>
      );
    case "valentiones":
      return (
        <g
          transform="translate(104 192) rotate(6)"
          stroke="#ad747e"
          strokeWidth="1.1"
        >
          <path
            d="M-2 0C-17-15-26-8-20 2C-18 9-8 7-2 3M2 0C17-15 26-8 20 2C18 9 8 7 2 3"
            fill="#d9a3ac"
          />
          <path
            d="M-4 3L-13 20L-7 18L-3 21L2 6L8 19L12 16L17 17L6 2"
            fill="#c78f9c"
          />
          <path d="M0 1C-7-6-10 1 0 8C10 1 7-6 0 1Z" fill="#ebbcc3" />
        </g>
      );
    case "hatching-tide":
      return (
        <g transform="rotate(9 106 207)" stroke="#ab9879" strokeWidth="1.1">
          <path
            d="M90 211C89 199 98 184 106 184C115 184 123 199 122 211C121 227 91 227 90 211Z"
            fill="#dbdfc1"
          />
          <path
            d="M92 202Q106 209 121 203M90 213Q105 219 122 213"
            stroke="#c39297"
            strokeWidth="3"
          />
          <circle cx="100" cy="195" r="2" fill="#f4e6ba" stroke="none" />
          <circle cx="113" cy="199" r="2" fill="#f4e6ba" stroke="none" />
        </g>
      );
    case "make-it-rain":
      return (
        <g transform="translate(112 190)" stroke="#a38b57" strokeWidth=".85">
          <path d="M-8-2L-7 14L0 10L7 14L8-2" fill="#9f987b" />
          <circle r="8" fill="#e6ca8b" />
          <circle r="5.5" stroke="#b3975f" />
          <path
            d="M0-4L1-1L4 0L1 1L0 4L-1 1L-4 0L-1-1Z"
            fill="#b38e52"
            stroke="none"
          />
        </g>
      );
    case "the-rising":
      return (
        <g stroke="#74758a" strokeWidth="1">
          <path
            d="M66 165C85 178 114 180 133 169L131 180L113 184L112 209L103 204L98 209L99 184C85 183 74 179 66 175Z"
            fill="#8c91a6"
          />
          <path d="M74 174Q92 181 123 178" stroke="#cbc6c2" />
          <path
            d="M107 189L109 193L113 194L110 197L111 201L107 199L103 201L104 197L101 194L105 193Z"
            fill="#e4c994"
            stroke="#aa956e"
            strokeWidth=".7"
          />
        </g>
      );
    default:
      return null;
  }
}

// Code-authored SVG; resting feet stay at y=244, independently of the breathing belly.
export function NookMoogle({
  className = "",
  booped = false,
  eventId = null,
}: NookMoogleProps) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-${name})`;
  const bodyOutline =
    "M80 155C65 161 57 177 53 197C49 218 65 237 88 239C113 243 140 235 146 216C153 196 142 171 124 159Z";
  const headOutline =
    "M99 82C71 79 46 88 37 108C32 119 32 130 34 139L28 143L33 146L29 151L36 153C43 171 69 181 99 180C129 182 155 173 164 156L171 153L167 149L172 145L166 141C169 124 164 108 153 98C140 86 119 81 99 82Z";
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
          <g stroke={materials.wingLight} strokeWidth=".85" opacity=".65">
            <path d="M25 154Q31 176 61 181M25 154Q32 173 43 187" />
            <path d="M178 156Q167 177 140 182M178 156Q167 174 160 187" />
          </g>
          <path
            d="M29 160Q38 170 49 172M174 162Q165 172 153 174"
            stroke="#b1a0b2"
            opacity=".28"
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
        </g>

        <Bodywear eventId={eventId} paint={paint} />

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
            <ellipse
              cx="100"
              cy="148"
              rx="11.5"
              ry="8"
              fill={paint("nose")}
              stroke={materials.roseShade}
              strokeWidth=".7"
            />
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
          <Headwear eventId={eventId} paint={paint} />
        </g>

        <g className="nook-moogle__paws" fill={paint("fur")}>
          <path
            d={
              booped
                ? "M65 202C53 195 42 176 48 167C54 159 63 165 68 177L82 195C87 205 74 211 65 202Z"
                : "M65 180C54 180 52 192 60 204C66 214 79 217 84 209C89 201 78 190 75 188"
            }
          />
          <path
            d={
              booped
                ? "M136 203C149 196 158 178 153 169C147 160 137 167 132 180L120 197C116 208 129 213 136 203Z"
                : "M137 182C147 181 151 193 144 205C137 215 124 217 119 209C115 202 125 193 128 190"
            }
          />
          <path
            d={booped ? "M49 175l4 1m94 1 4-2" : "m72 205 3 3m51-1 4-2"}
            stroke={materials.furShade}
            strokeWidth=".75"
          />
          <path d="M70 216C58 212 47 220 47 232C46 240 58 244 72 244C86 244 94 239 90 230C87 223 80 218 70 216Z" />
          <path d="M130 216C141 211 152 220 153 231C155 240 142 244 128 244C114 244 108 239 111 231C114 223 121 219 130 216Z" />
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
