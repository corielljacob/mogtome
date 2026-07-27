import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { NookSeasonalDecor } from "./NookSeasonalDecor";
import { NookProps } from "./NookProps";
import { NookEmbroidery } from "./NookEmbroidery";
import { NookVines } from "./NookVines";
import { NookWindowView } from "./NookWindowView";

interface NookIllustrationProps {
  isDark: boolean;
  eventId: SeasonalEventId | null;
}

// One coordinate space keeps the window, shelf, and all seasonal objects grounded.
// The room and its companion moogle are both editable SVG geometry.
export function NookIllustration({ isDark, eventId }: NookIllustrationProps) {
  const id = useId().replace(/:/g, "");
  const ref = (name: string) => `url(#${id}-${name})`;
  const hasGarland = eventId === "all-saints-wake" || eventId === "starlight";

  return (
    <>
      <NookWindowView isDark={isDark} eventId={eventId} />
      <svg
        className="nook-illustration"
        data-mode={isDark ? "dark" : "light"}
        viewBox="0 0 440 550"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <NookEmbroidery id={`${id}-embroidery`} width={440} height={550} />
          <linearGradient
            id={`${id}-wood`}
            x1="66"
            y1="80"
            x2="370"
            y2="430"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--scene-wood-light)" />
            <stop offset="1" stopColor="var(--scene-wood)" />
          </linearGradient>
          <linearGradient id={`${id}-frame-edge`} x1="0" y1="0" x2="1" y2=".3">
            <stop stopColor="var(--scene-wood-dark)" />
            <stop offset=".18" stopColor="var(--scene-wood-light)" />
            <stop offset=".58" stopColor="var(--scene-wood)" />
            <stop offset="1" stopColor="var(--scene-wood-dark)" />
          </linearGradient>
          <linearGradient id={`${id}-glass-shade`} x1="0" y1="0" x2="1" y2=".4">
            <stop stopColor="var(--scene-shadow)" stopOpacity=".32" />
            <stop
              offset=".09"
              stopColor="var(--scene-shadow)"
              stopOpacity="0"
            />
            <stop offset=".9" stopColor="var(--scene-shadow)" stopOpacity="0" />
            <stop
              offset="1"
              stopColor="var(--scene-shadow)"
              stopOpacity=".22"
            />
          </linearGradient>
          <clipPath id={`${id}-window`}>
            <path d="M70 431V194C70 119 123 58 201 58S332 119 332 194V431Z" />
          </clipPath>
        </defs>

        <g
          filter={ref("embroidery")}
          stroke="var(--scene-ink)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <NookVines layer="back" hasGarland={hasGarland} />
          {/* Rounded oak surround, recessed glazing, and two opening casements. */}
          <path
            d="M41 438V191C41 101 111 26 201 26S361 102 361 191V438"
            stroke="var(--scene-shadow)"
            strokeWidth="16"
            opacity=".15"
            transform="translate(6 7)"
          />
          <path
            d="M40 438V191C40 100 108 26 201 26S362 100 362 191V438ZM70 431V194C70 119 123 58 201 58S332 119 332 194V431Z"
            fillRule="evenodd"
            fill={ref("frame-edge")}
          />
          <path
            d="M47 436V192C47 103 114 34 201 34S355 103 355 192V436ZM70 431V194C70 119 123 58 201 58S332 119 332 194V431Z"
            fillRule="evenodd"
            fill={ref("wood")}
          />
          <path
            d="M49 429V191C49 106 115 36 201 36S353 106 353 191V429"
            stroke="var(--scene-paper)"
            strokeWidth="1.6"
            strokeDasharray="1.4 3"
            opacity=".65"
          />
          <path
            d="M61 433V193C61 113 122 48 201 48S341 113 341 193V433"
            stroke="var(--scene-wood-dark)"
            strokeWidth="5"
            opacity=".65"
          />
          <path
            d="M65 431V194C65 115 125 53 201 53S337 115 337 194V431"
            stroke="var(--scene-paper)"
            strokeWidth="2"
            strokeDasharray="1.3 3.2"
            opacity=".58"
          />
          <g
            className="nook-window-view"
            clipPath={ref("window")}
            stroke="none"
          >
            <path
              d="M83 76h23L275 431h-30ZM118 63h5L295 431h-7Z"
              fill="#fff9e4"
              opacity={isDark ? ".06" : ".11"}
            />
            <path d="M70 58H333V434H70Z" fill={ref("glass-shade")} />
            <path
              d="M80 211V188C80 116 135 68 195 67"
              stroke="var(--scene-paper)"
              strokeWidth="2"
              opacity=".28"
            />
          </g>
          <path
            d="M70 431V194C70 119 123 58 201 58S332 119 332 194V431Z"
            stroke="var(--scene-ink)"
            strokeWidth="2"
            strokeOpacity=".6"
          />
          <path d="M70 217H332V232H70Z" fill={ref("frame-edge")} />
          <path d="M71 217H331V224H71Z" fill={ref("wood")} />
          <path d="M194 231H208V433H194Z" fill={ref("frame-edge")} />
          <path d="M196 230H203V431H196Z" fill={ref("wood")} />
          <path
            d="M75 233H191V428H75ZM212 233H327V428H212Z"
            stroke="var(--scene-wood-light)"
            strokeWidth="2.4"
            opacity=".75"
          />
          <path
            d="M78 239V424H187M215 238V424H323"
            stroke="var(--scene-paper)"
            strokeWidth=".8"
            opacity=".45"
          />
          <path
            d="M73 228H329M205 234V430"
            stroke="var(--scene-wood-dark)"
            strokeWidth="1"
            opacity=".7"
          />
          <path
            d="M198 234V428M76 218H328"
            stroke="var(--scene-paper)"
            strokeWidth="1.2"
            strokeDasharray="1.2 2.8"
            opacity=".6"
          />
          {/* The tiny brass catch and hinge plates make the frame feel made. */}
          <g
            fill="var(--scene-brass)"
            stroke="var(--scene-wood-dark)"
            strokeWidth=".8"
          >
            <rect x="197" y="269" width="9" height="27" rx="4" />
            <circle
              cx="201.5"
              cy="274"
              r="1"
              fill="var(--scene-gold)"
              stroke="none"
            />
            <circle
              cx="201.5"
              cy="291"
              r="1"
              fill="var(--scene-gold)"
              stroke="none"
            />
            <path
              d="M201 281C198 279 189 279 189 284C189 288 199 286 202 285L210 278Q212 276 214 279L205 287Z"
              fill="var(--scene-gold)"
            />
            {[263, 363].map((y) => (
              <g key={y}>
                <rect x="68" y={y} width="7" height="16" rx="2" />
                <rect x="328" y={y} width="7" height="16" rx="2" />
                <path
                  d={`M71 ${y + 3}v10m260-10v10`}
                  stroke="var(--scene-gold)"
                />
              </g>
            ))}
          </g>
          <path
            d="M57 269q-4 53 0 100m286-153q4 77 0 139M100 77q21-21 45-27M258 51q31 13 46 31"
            stroke="var(--scene-ink)"
            strokeWidth=".65"
            opacity=".38"
          />
          <ellipse cx="56" cy="394" rx="2" ry="10" opacity=".3" />
          <g stroke="var(--scene-wood-dark)" strokeWidth=".8" opacity=".6">
            <path d="M164 43Q180 36 194 37M209 37Q227 38 242 43M202 40v6" />
            <path
              d="M201 43C194 39 194 35 198 37L201 40C207 31 211 39 201 43Z"
              fill="var(--scene-gold)"
            />
            <path d="M55 181v39M348 241v64M72 125q4-13 10-21" />
          </g>

          <NookVines layer="front" hasGarland={hasGarland} />

          <NookProps isDark={isDark} />
          <NookSeasonalDecor eventId={eventId} />
        </g>
      </svg>
    </>
  );
}
