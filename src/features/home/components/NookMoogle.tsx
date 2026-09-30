import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { NookMoogleHeadwear } from "./NookMoogleHeadwear";
import { NookMoogleBodywear } from "./NookMoogleBodywear";
import { NookMoogleStitches } from "./NookMoogleStitches";
import type { MoogleModel } from "./NookMoogleStitches";
import {
  NookMoogleMouthStitches,
  NookMoogleNoseStitches,
} from "./NookMoogleFaceStitches";
import { NookMooglePawPads } from "./NookMooglePawPads";
import { NookThread } from "./NookThread";
import "./nook-moogle-models.css";

interface NookMoogleProps {
  className?: string;
  booped?: boolean;
  eventId?: SeasonalEventId | null;
}

// Character-owned cotton and floss colors, resolved from the original light
// palette. Room themes and color mode should never dye the moogle's materials.
const materials = {
  ink: "#876f58",
  furLight: "#fefbf1",
  fur: "#f7f1e5",
  furShade: "#d8ccbd",
  wingLight: "#8c7c88",
  wing: "#6c5661",
  wingHighlight: "#b9a7bf",
  wingGlint: "#b1a0b2",
  pomLight: "#f7d2d0",
  pom: "#d28b96",
  pomShade: "#b97285",
  roseLight: "#d8b4a8",
  rose: "#c48f8d",
  roseShade: "#aa7973",
} as const;

/** Padded cotton binding, with uneven wraps and soft catches of light. */
function StitchedEdge({
  d,
  thread = materials.fur,
  shade = materials.furShade,
  light = materials.furLight,
  width = 2.6,
  model = 0,
}: {
  d: string;
  thread?: string;
  shade?: string;
  light?: string;
  width?: number;
  model?: MoogleModel;
}) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={shade} strokeWidth={width + 1.3} opacity=".8" />
      <path d={d} stroke={thread} strokeWidth={width} />
      <path
        d={d}
        stroke={shade}
        strokeWidth={width}
        strokeDasharray={
          [
            ".55 2.9 .8 2.35 .62 2.7 .73 2.4",
            ".8 2.15 .6 3.05 .9 2.3 .55 2.7",
            ".65 2.55 .9 2.1 .5 3.1 .8 2.2",
          ][model]
        }
        strokeLinecap="butt"
        opacity=".65"
      />
      <path
        d={d}
        stroke={light}
        strokeWidth={width * 0.4}
        strokeDasharray={
          [
            "1.1 2.1 1.45 1.8 .95 2.35 1.25 2.05",
            "1.5 1.9 .85 2.6 1.2 1.65 1.4 2.3",
            ".9 2.4 1.6 1.7 1.15 2.2 1.3 1.8",
          ][model]
        }
        transform="translate(-.35 -.45)"
        opacity=".55"
      />
    </g>
  );
}

// The same character sewn three times: padding bulges and seam routes differ
// slightly, while the face placement and grounded feet preserve its identity.
const modelOutlines = [
  {
    body: "M80 155C65 161 57 177 53 197C49 218 65 237 88 239C113 243 140 235 146 216C153 196 142 171 124 159Z",
    head: "M99 82C71 79 46 88 37 108C32 119 32 130 34 139L28 143L33 146L29 151L36 153C43 171 69 181 99 180C129 182 155 173 164 156L171 153L167 149L172 145L166 141C169 124 164 108 153 98C140 86 119 81 99 82Z",
    pom: "M158 29A27 27 0 1 1 104 29A27 27 0 1 1 158 29Z",
    cheeks:
      "m39 131 6-3m-6 9 7-3m-7 10 7-3m-5 10 7-4m-3 10 7-5m-1 10 7-5m1 9 6-5m3 8 6-6M156 122l6 3m-7 3 7 3m-7 3 7 3m-8 3 7 3m-8 3 7 3m-9 3 6 4m-9 2 5 4m-10 1 5 5",
  },
  {
    body: "M80 155C64 163 56 178 52 198C50 220 67 237 89 239C112 242 141 234 147 215C152 194 141 171 124 159Z",
    head: "M99 82C73 78 47 89 36 109C31 120 33 131 34 139L28 144L34 146L30 151L36 154C45 172 71 182 99 180C130 181 155 174 165 155L171 152L166 148L171 145L166 140C170 123 163 107 152 97C140 87 119 80 99 82Z",
    pom: "M158 29C158.5 45 146 55 131 56C115 55.5 104.5 44 104 29C104 14 116 2 131 2C147 1.5 158 15 158 29Z",
    cheeks:
      "M39 130l7-2m-8 9 8-4m-7 11 6-3m-4 10 8-5m-4 11 7-4m1 10 6-6m3 9 7-5M157 122l5 4m-8 3 8 2m-7 4 7 3m-8 4 7 3m-8 4 7 3m-10 3 6 5m-11 1 6 4m-12 1 5 5",
  },
  {
    body: "M80 155C66 160 57 176 54 197C48 217 64 236 87 239C114 244 139 235 145 217C154 197 143 172 124 159Z",
    head: "M99 82C70 80 45 87 38 107C33 118 31 130 34 140L29 143L33 147L28 151L37 153C42 170 68 180 99 180C128 183 156 172 163 156L170 154L167 150L173 145L166 142C168 125 165 109 154 99C139 85 118 82 99 82Z",
    pom: "M158 29C157.5 44 145 56 131 56C116 56.5 103.5 43 104 29C103 13 117 2.5 131 2C145 1 158.5 13 158 29Z",
    cheeks:
      "M40 129l5-3m-7 10 7-3m-7 9 8-2m-5 10 6-5m-3 11 7-4m-1 10 8-6m1 10 6-5m3 8 6-5M156 121l7 3m-8 4 6 4m-7 2 8 3m-9 4 8 2m-9 4 7 4m-10 3 6 3m-9 3 5 5m-11 1 6 4",
  },
] as const;

function NookMoogleModel({
  model,
  booped = false,
  eventId = null,
}: Omit<NookMoogleProps, "className"> & { model: MoogleModel }) {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-${name})`;
  const scarfInFront = eventId === "starlight" || eventId === "the-rising";
  const pleased = booped && model === 2;
  const headLift = (booped ? [0, 0.8, -0.15] : [0, -0.2, -0.55])[model];
  const headTurn = (booped ? [0, -1.3, 1.2] : [0, 1, 2.2])[model];
  const {
    body: bodyOutline,
    head: headOutline,
    pom: pomOutline,
    cheeks,
  } = modelOutlines[model];
  const leftPaw =
    "M65 180C54 180 52 192 60 204C66 214 79 217 84 209C89 201 78 190 75 188";
  const rightPaw =
    "M137 182C147 181 151 193 144 205C137 215 124 217 119 209C115 202 125 193 128 190";
  const leftEye = pleased ? "M55 135Q65 130 77 135" : "M55 133Q65 142 77 135";
  const rightEye = pleased
    ? "M124 135Q135 130 146 133"
    : "M124 135Q135 142 146 133";
  const feet =
    "M70 216C58 212 47 220 47 232C46 240 58 244 72 244C86 244 94 239 90 230C87 223 80 218 70 216ZM130 216C141 211 152 220 153 231C155 240 142 244 128 244C114 244 108 239 111 231C114 223 121 219 130 216Z";
  return (
    <g
      className={`nook-moogle__model nook-moogle__model--${model}`}
      data-sewn-model={model}
      data-boop-pose={booped ? ["rest", "dip", "smile"][model] : undefined}
    >
      <defs>
        <clipPath id={`${id}-pom-shape`}>
          <path d={pomOutline} />
        </clipPath>
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
            stopOpacity={pleased ? ".75" : ".65"}
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
              model={model}
              part="wings"
              color={materials.wingLight}
              shade={materials.wing}
              light={materials.wingHighlight}
            />
          </g>
          <g stroke={materials.wingLight} strokeWidth=".85" opacity=".65">
            <path d="M25 154Q31 176 61 181M25 154Q32 173 43 187" />
            <path d="M178 156Q167 177 140 182M178 156Q167 174 160 187" />
          </g>
          <path
            d="M29 160Q38 170 49 172M174 162Q165 172 153 174"
            stroke={materials.wingGlint}
            opacity=".28"
          />
          <StitchedEdge
            model={model}
            d="M24 150C21 161 20 177 23 188C31 181 37 182 43 189C49 182 57 185 65 190M179 153C183 164 185 178 181 190C173 181 165 183 160 190C154 183 145 186 137 190"
            thread={materials.wingLight}
            shade={materials.wing}
            light={materials.wingHighlight}
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
              model={model}
              part="belly"
              color={materials.fur}
              shade={materials.furShade}
              light={materials.furLight}
            />
          </g>
          <StitchedEdge model={model} d={bodyOutline} />
          <g
            clipPath={paint("belly-shape")}
            stroke={materials.furShade}
            strokeWidth=".8"
            opacity=".6"
          >
            <path
              d={
                [
                  "M100 185Q104 207 99 230",
                  "M101 186Q102 207 98.5 230",
                  "M99 184Q105 208 100 231",
                ][model]
              }
              strokeDasharray={["2.3 3.2", "2.7 3.6", "2.1 3.1"][model]}
            />
          </g>
        </g>

        {!scarfInFront && (
          <NookMoogleBodywear eventId={eventId} paint={paint} />
        )}

        <g
          className="nook-moogle__head"
          transform={`translate(0 ${headLift}) rotate(${-6 + headTurn} 100 142)`}
        >
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
              model={model}
              d="M48 108C40 96 40 76 47 64C61 66 77 80 80 95M124 95C130 81 144 70 154 70C162 83 158 100 148 112"
              width={2}
            />
            <NookThread
              d={
                [
                  "M47 70q2 13 10 25M51 71q3 13 11 24M55 73q3 10 11 20M151 75q-2 14-9 24M147 77q-2 12-9 20M143 80l-9 14",
                  "M47.5 70q1 14 10 26M52 72q2 12 10 22M56 74q2 9 10 19M151 76q-1 12-8 24M147 77q-1 12-9 20M143 81l-8 14",
                  "M46.5 71q3 13 11 24M50.5 72q4 12 11 23M55 73q4 11 11 20M151 75q-3 15-10 24M147 78q-3 13-10 20M143 81l-10 14",
                ][model]
              }
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
              model={model}
              part="face"
              color={materials.fur}
              shade={materials.furShade}
              light={materials.furLight}
            />
          </g>
          <StitchedEdge model={model} d={headOutline} width={3} />
          {/* Short laid stitches fan around the cheeks, following the padding. */}
          <g
            clipPath={paint("head-shape")}
            stroke={materials.furShade}
            strokeWidth=".9"
            opacity=".7"
          >
            <path d={cheeks} />
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
              <path d={leftEye} />
              <path d={rightEye} />
            </g>
            <g
              stroke={materials.furLight}
              strokeWidth=".65"
              strokeDasharray=".8 2.2"
              opacity=".7"
            >
              <path d={leftEye} />
              <path d={rightEye} />
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
              <NookMoogleNoseStitches
                model={model}
                color={materials.rose}
                shade={materials.roseShade}
                light={materials.roseLight}
                padding={paint("nose")}
              />
            </g>
            <NookMoogleMouthStitches
              model={model}
              pleased={pleased}
              color={materials.ink}
              shade={materials.ink}
              light={materials.furShade}
            />
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
            d="m72 205 3 3m51-1 4-2"
            stroke={materials.furShade}
            strokeWidth=".75"
          />
          <path d={feet} />
          <g clipPath={paint("paws-shape")}>
            <NookMoogleStitches
              model={model}
              part="paws"
              color={materials.fur}
              shade={materials.furShade}
              light={materials.furLight}
            />
          </g>
          <StitchedEdge model={model} d={leftPaw} width={1.5} />
          <StitchedEdge model={model} d={rightPaw} width={1.5} />
          <StitchedEdge
            model={model}
            d="M70 216C58 212 47 220 47 232C46 240 58 244 72 244C86 244 94 239 90 230C87 223 80 218 70 216ZM130 216C141 211 152 220 153 231C155 240 142 244 128 244C114 244 108 239 111 231C114 223 121 219 130 216Z"
            width={2}
          />
          <NookMooglePawPads
            model={model}
            color={materials.roseLight}
            shade={materials.roseShade}
            light={materials.furLight}
          />
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

        <g transform={`translate(0 ${headLift}) rotate(${headTurn} 100 142)`}>
          <g className="nook-moogle__bobble">
            <g className="nook-moogle__antenna">
              <path
                d="M101 84C98 73 103 64 116 57C125 52 129 45 129 38"
                stroke={materials.ink}
                strokeWidth="1.8"
              />
            </g>
            <g className="nook-moogle__pom">
              <path
                d={pomOutline}
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
              <g clipPath={paint("pom-shape")}>
                <g transform={`rotate(${[-30, -33, -27][model]} 131 29)`}>
                  <NookMoogleStitches
                    model={model}
                    part="pom"
                    color={materials.pom}
                    shade={materials.pomShade}
                    light={materials.pomLight}
                  />
                </g>
              </g>
              <StitchedEdge
                model={model}
                d={pomOutline}
                thread={materials.pom}
                shade={materials.pomShade}
                light={materials.pomLight}
                width={2.6}
              />
              <path
                d={
                  [
                    "M129 5C112 17 112 37 128 53M136 6C122 20 124 38 139 52",
                    "M128 5C111 18 114 39 129 53M137 6C123 19 124 39 140 51",
                    "M130 5C114 16 112 36 127 52M135 6C121 21 125 39 138 52",
                  ][model]
                }
                stroke={materials.pomLight}
                strokeWidth="1"
                strokeDasharray="2.6 2"
                opacity=".65"
              />
            </g>
          </g>
        </g>
        {pleased && (
          <g
            className="nook-moogle__affection"
            fill={materials.pom}
            stroke={materials.pomShade}
            strokeWidth=".7"
          >
            <path d="M177 115C165 108 166 102 171 103Q175 103 177 107Q180 100 185 103C191 108 182 113 177 115Z" />
            <path
              d="M170 105Q174 107 177 112M183 104Q181 109 177 112"
              fill="none"
              stroke={materials.pomLight}
              strokeWidth="1"
              strokeDasharray="1.5 1"
            />
          </g>
        )}
      </g>
    </g>
  );
}

// Every model stays mounted, so its pose clocks share the same exposures.
// Only the visible sewn piece is replaced; the outer SVG keeps one hit area.
export function NookMoogle({
  className = "",
  booped = false,
  eventId = null,
}: NookMoogleProps) {
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
      {([0, 1, 2] as const).map((model) => (
        <NookMoogleModel
          key={model}
          model={model}
          booped={booped}
          eventId={eventId}
        />
      ))}
    </svg>
  );
}
