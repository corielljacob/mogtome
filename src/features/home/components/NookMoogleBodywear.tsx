import { useId } from "react";
import type { SeasonalEventId } from "@/shared/constants/seasonalEvents";
import { NookThread } from "./NookThread";

interface NookMoogleBodywearProps {
  eventId?: SeasonalEventId | null;
  paint: (name: string) => string;
}

/** Each fabric piece owns its stitch direction and a separately bound hem. */
function GarmentPatch({
  d,
  stitches,
  fill,
  thread,
  shade,
  light,
  width = 2,
  hem = 1.5,
}: {
  d: string;
  stitches: string;
  fill: string;
  thread: string;
  shade: string;
  light: string;
  width?: number;
  hem?: number;
}) {
  const id = `${useId().replace(/:/g, "")}-garment`;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={fill} stroke={shade} strokeWidth={hem} />
      <g clipPath={`url(#${id})`}>
        <NookThread
          d={stitches}
          color={thread}
          shadow={shade}
          highlight={light}
          width={width}
          relief={2.2}
        />
      </g>
      <NookThread
        d={d}
        color={thread}
        shadow={shade}
        highlight={light}
        width={hem}
        relief={2.1}
      />
      <NookThread
        d={d}
        color={light}
        shadow={shade}
        highlight={light}
        width={0.85}
        relief={1.6}
        dasharray=".65 2.1"
      />
    </g>
  );
}

function FlossKnot({
  x,
  y,
  color,
  shade,
  light,
  size = 1,
}: {
  x: number;
  y: number;
  color: string;
  shade: string;
  light: string;
  size?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <NookThread
        d="M-1 .4C-2.5-1.9 1-3 1.8-.5C2.8 1.9-.5 2.8-1 1Q-1.6-.2 0-.4"
        color={color}
        shadow={shade}
        highlight={light}
        width={1.6}
        relief={2}
      />
    </g>
  );
}

const cape =
  "M67 160C51 171 46 193 48 214C67 213 74 201 81 180L99 176L128 178C135 199 144 209 155 209C153 187 142 168 130 162Z";
const collar = "M66 167C82 179 116 181 133 169L137 180C121 195 79 192 62 178Z";
const scarfTail = "M73 173L91 181L85 215Q78 218 70 212Z";
const scarfWrap =
  "M65 163C83 176 117 178 135 166L139 176C119 191 86 190 66 179Z";
const bow =
  "M-2 0C-17-15-26-8-20 2C-18 9-8 7-2 3ZM2 0C17-15 26-8 20 2C18 9 8 7 2 3Z";
const bowTails = "M-4 3L-13 20L-7 18L-3 21L2 6L8 19L12 16L17 17L6 2Z";
const egg =
  "M90 211C89 199 98 184 106 184C115 184 123 199 122 211C121 227 91 227 90 211Z";
const risingScarf =
  "M66 165C85 178 114 180 133 169L131 180L113 184L112 209L103 204L98 209L99 184C85 183 74 179 66 175Z";
const wrapThreads = Array.from(
  { length: 10 },
  (_, i) => `M60 ${159 + i * 2.75}Q100 ${183 + i * 2.75} 142 ${163 + i * 2.75}`,
).join(" ");

export function NookMoogleBodywear({
  eventId,
  paint,
}: NookMoogleBodywearProps) {
  switch (eventId) {
    case "all-saints-wake":
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <GarmentPatch
            d={cape}
            stitches="M64 162C53 178 47 195 48 214M67 163C56 179 50 197 51 214M70 164C59 181 54 198 54 213M73 165C63 182 58 199 57 212M76 167C67 185 63 199 61 210M79 169C72 186 68 199 65 207M82 170C77 185 73 197 70 202M87 168 83 182M91 168 89 180M95 168 94 179M100 168V180M105 168 107 181M110 168 114 181M116 168 122 183M121 166C132 180 135 195 142 205M125 165C136 181 139 195 146 207M129 165C140 181 143 195 150 208M133 168C145 183 148 198 153 208"
            fill={paint("hat")}
            thread="#80647f"
            shade="#554455"
            light="#ba9aaf"
            width={2.3}
            hem={1.8}
          />
          <GarmentPatch
            d="M58 179C53 191 51 204 51 210C61 206 65 197 68 187ZM137 181C145 191 149 201 151 205L140 199Z"
            stitches="M55 184 65 190M54 188 64 194M53 192 62 198M52 196 60 202M51 200 57 207M51 205 54 210M138 184 143 183M139 188 146 187M141 192 148 191M143 196 150 195M146 201 152 199"
            fill="#b98b65"
            thread="#bb916d"
            shade="#87604f"
            light="#e3b98c"
            width={1.8}
            hem={1.15}
          />
          <GarmentPatch
            d={collar}
            stitches={wrapThreads}
            fill="#806880"
            thread="#967792"
            shade="#5e4c63"
            light="#c6a8b9"
            width={2.2}
            hem={1.7}
          />
          <GarmentPatch
            d="M107.5 185a4.5 4.5 0 1 1-9 0a4.5 4.5 0 1 1 9 0Z"
            stitches="M100 181V189M103 180V190M106 181V189"
            fill="#e0bb78"
            thread="#dfb875"
            shade="#9b7953"
            light="#ffe3a8"
            width={1.75}
            hem={1.35}
          />
          <NookThread
            d="M105 182A3 3 0 1 0 106 187"
            color="#72536f"
            shadow="#5c4259"
            highlight="#b794b2"
            width={1.8}
            relief={2}
          />
        </g>
      );
    case "starlight":
      return (
        <g strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(12 0)">
            <GarmentPatch
              d={scarfTail}
              stitches="M70 180 91 185M70 184 90 189M70 188 89 193M70 192 89 197M70 196 88 201M70 200 87 205M70 204 86 209M70 208 86 213M70 212 85 217"
              fill="#b77a7d"
              thread="#c08489"
              shade="#885860"
              light="#e2b1ae"
              width={2.25}
              hem={1.7}
            />
            <NookThread
              d="M73 197L86 202M72 204L85 208"
              color="#e3beb0"
              shadow="#aa767e"
              highlight="#ffe2c8"
              width={2.6}
              relief={2}
            />
            <NookThread
              d="M70 211L69 216M73 213L72 218M76 214L75 219M79 215L78 220M82 215L81 220M85 214L84 218"
              color="#b77a7d"
              shadow="#885860"
              highlight="#e3beb0"
              width={1.8}
              relief={2.2}
            />
            <NookThread
              d="M69.5 213l1 .4m1.5 1.3 1 .5m1.5 1.1 1 .5m1.5.8 1 .5m1.5-.3 1 .5"
              color="#e3beb0"
              shadow="#9b6163"
              highlight="#ffe2c8"
              width={1.2}
              relief={1.8}
            />
          </g>
          <GarmentPatch
            d={scarfWrap}
            stitches={wrapThreads}
            fill="#c98b87"
            thread="#c58b8b"
            shade="#945a66"
            light="#edc3ad"
            width={2.3}
            hem={1.7}
          />
          <GarmentPatch
            d="M126 178L119 167L125 168L129 163L131 170L138 172L130 178ZM129 177L139 178L137 182L140 187L133 186L130 190Z"
            stitches="M126 166 128 171M130 167 128 173M122 169 128 174M132 170 128 175M125 173 129 177M136 172 129 177M132 178 133 182M137 179 133 183M130 181 134 184M137 184 134 185M132 185 133 189"
            fill="#657f65"
            thread="#789273"
            shade="#4d654d"
            light="#b0bf8c"
            width={1.6}
            hem={1.2}
          />
          <FlossKnot
            x={129}
            y={179}
            color="#aa6067"
            shade="#81454f"
            light="#dfaaa2"
            size={1.2}
          />
          <FlossKnot
            x={125}
            y={182}
            color="#bd7775"
            shade="#81454f"
            light="#efb9aa"
          />
        </g>
      );
    case "valentiones":
      return (
        <g transform="translate(104 192) rotate(6)">
          <GarmentPatch
            d={bow}
            stitches="M-22-7Q-15-9-3-.7M-23-4Q-15-7-3 .9M-22-1Q-15-4-3 2.2M-20 2Q-14-1-3 3.5M-18 5Q-12 3-3 4.8M22-7Q15-9 3-.7M23-4Q15-7 3 .9M22-1Q15-4 3 2.2M20 2Q14-1 3 3.5M18 5Q12 3 3 4.8"
            fill="#d9a3ac"
            thread="#d8a1ae"
            shade="#a96e80"
            light="#f6d1ce"
            width={2}
            hem={1.6}
          />
          <GarmentPatch
            d={bowTails}
            stitches="M-4 2-14 21M-.8 3-10 22M2 4-6 23M4 2 11 20M7 2 15 19M10 3 18 17"
            fill="#c78f9c"
            thread="#cc94a5"
            shade="#9f6479"
            light="#edbfc4"
            width={2}
            hem={1.4}
          />
          <GarmentPatch
            d="M0 1C-7-6-10 1 0 8C10 1 7-6 0 1Z"
            stitches="M-5-2Q-5 2-1 6M-2-2Q-2 3 0 7M2-2Q2 3 0 7M5-2Q5 2 1 6"
            fill="#ebbcc3"
            thread="#ebbbc5"
            shade="#bc889d"
            light="#ffe0d7"
            width={1.7}
            hem={1.2}
          />
        </g>
      );
    case "hatching-tide":
      return (
        <g transform="rotate(9 106 207)">
          <GarmentPatch
            d={egg}
            stitches="M98 188C91 201 92 216 98 220M101 186C95 201 96 217 101 223M104 184C99 201 100 218 104 224M107 184C104 201 104 218 107 224M110 186C109 201 108 218 110 223M113 188C114 201 112 217 113 222M116 191C119 203 116 215 116 220M119 196C123 206 120 213 119 216"
            fill="#dbdfc1"
            thread="#d2d9b7"
            shade="#a4ac8f"
            light="#f4eccd"
            width={2.15}
            hem={1.8}
          />
          <NookThread
            d="M92 202Q106 209 121 203M90 213Q105 219 122 213"
            color="#c39297"
            shadow="#996b83"
            highlight="#efd0c6"
            width={2.8}
            relief={2.1}
          />
          <FlossKnot
            x={100}
            y={195}
            color="#ead9ab"
            shade="#b7a172"
            light="#fff1d0"
            size={0.95}
          />
          <FlossKnot
            x={113}
            y={199}
            color="#ead9ab"
            shade="#b7a172"
            light="#fff1d0"
            size={0.95}
          />
        </g>
      );
    case "make-it-rain":
      return (
        <g transform="translate(112 190)">
          <GarmentPatch
            d="M-8-2L-7 14L0 10L7 14L8-2Z"
            stitches="M-7-2-6 14M-4-2-3 12M-1-2 0 10M2-2 3 12M5-2 6 14"
            fill="#9f987b"
            thread="#aba281"
            shade="#7b795d"
            light="#ded0a2"
            width={1.9}
            hem={1.4}
          />
          <GarmentPatch
            d="M8 0a8 8 0 1 1-16 0a8 8 0 1 1 16 0Z"
            stitches="M0-7V-2M3.5-6 1-2M6-3.5 2-1M7 0H2M6 3.5 2 1M3.5 6 1 2M0 7V2M-3.5 6-1 2M-6 3.5-2 1M-7 0H-2M-6-3.5-2-1M-3.5-6-1-2"
            fill="#e6ca8b"
            thread="#dbbb7e"
            shade="#a38b57"
            light="#ffe4a6"
            width={1.75}
            hem={1.7}
          />
          <NookThread
            d="M5.5 0a5.5 5.5 0 1 1-11 0a5.5 5.5 0 1 1 11 0Z"
            color="#b3975f"
            shadow="#9b8153"
            highlight="#f1d08d"
            width={1.1}
            relief={1.8}
          />
          <NookThread
            d="M0-4L1-1L4 0L1 1L0 4L-1 1L-4 0L-1-1Z"
            color="#b38e52"
            shadow="#8b6c43"
            highlight="#e7bc71"
            width={1.35}
            relief={1.9}
          />
        </g>
      );
    case "the-rising":
      return (
        <g>
          <GarmentPatch
            d={risingScarf}
            stitches="M65 164Q99 187 135 167M65 167Q99 190 135 170M65 170Q99 193 134 173M65 173Q99 196 133 176M101 184 99 210M104 184 102 207M107 184 106 209M110 184 110 209M113 184 114 211"
            fill="#8c91a6"
            thread="#989cb1"
            shade="#65697f"
            light="#cfccd6"
            width={2.05}
            hem={1.65}
          />
          <GarmentPatch
            d="M107 189L109 193L113 194L110 197L111 201L107 199L103 201L104 197L101 194L105 193Z"
            stitches="M107 190V197M102 194 108 197M104 200 108 196M111 200 107 195M112 194 106 197"
            fill="#e4c994"
            thread="#e4c58c"
            shade="#aa956e"
            light="#ffe4b0"
            width={1.6}
            hem={1.1}
          />
        </g>
      );
    default:
      return null;
  }
}
