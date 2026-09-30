import { useId } from "react";
import { NookThread } from "./NookThread";
import { threadVariation } from "./nookNeedlework";

// Long-and-short silk bends toward the horizon. The moving cut edges reveal
// this fixed needlework in held exposures, like changing pieces on a tiny set.
const veilStitches = (() => {
  const bundles: string[][] = [[], [], []];
  const n = (value: number) => value.toFixed(2);
  for (let column = 0; column < 133; column++) {
    const sx = 7 + column * 3;
    const direction = (sx - 201) / 194;
    for (let row = 0; row < 20; row++) {
      const i = column * 37 + row;
      const y = 39 + row * 21 + (column % 3) * 6.7;
      const x = sx - direction * Math.min(65, (y - 39) * 0.25);
      const bend = Math.sin(y / 26 + column * 0.23) * 3.6;
      const length = 18.8 + threadVariation(i, 1023) * 1.4;
      bundles[(column + row) % 3].push(
        `M${n(x)} ${n(y)}q${n(bend - direction * 2.4)} ${n(length * 0.52)} ${n(-direction * 4.9)} ${n(length)}`,
      );
    }
  }
  return bundles.map((paths) => paths.join(" "));
})();

const lightFolds = [
  "M53 42C118 104 67 136 135 182S160 231 193 282",
  "M83 40C150 102 105 138 159 192S180 242 198 282",
  "M125 40C184 110 139 161 181 214L201 280",
  "M351 42C287 102 335 143 274 184S238 240 209 282",
  "M314 40C252 101 299 139 247 195S222 244 204 282",
  "M274 40C218 110 261 162 224 215L202 280",
];

function LightCloth({ violet = false }: { violet?: boolean }) {
  const id = `${useId().replace(/:/g, "")}-parting-light`;
  const paint = (name: string) => `url(#${id}-${name})`;
  const colors = violet
    ? ["#5b438b", "#9d7bcc", "#d9c2ee", "#645495"]
    : ["#b09861", "#e4c477", "#fff0b2", "#b18e58"];
  return (
    <svg
      className="nook-shb-light-cloth"
      viewBox="70 58 262 373"
      fill="none"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-cloth`}
          gradientUnits="userSpaceOnUse"
          x1="70"
          y1="58"
          x2="122"
          y2="431"
        >
          <stop stopColor={colors[0]} />
          <stop offset=".22" stopColor={colors[1]} />
          <stop offset=".5" stopColor={colors[2]} />
          <stop offset=".73" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[0]} />
        </linearGradient>
        <linearGradient
          id={`${id}-silk`}
          gradientUnits="userSpaceOnUse"
          x1="70"
          y1="58"
          x2="332"
          y2="189"
        >
          <stop stopColor={colors[1]} />
          <stop offset=".2" stopColor={colors[2]} />
          <stop offset=".43" stopColor={colors[0]} />
          <stop offset=".62" stopColor={colors[2]} />
          <stop offset=".84" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[0]} />
        </linearGradient>
      </defs>
      <path d="M-600-500H1000V1000H-600Z" fill={paint("cloth")} />
      {lightFolds.map((d, i) => (
        <NookThread
          key={d}
          d={d}
          color={i % 2 ? colors[1] : colors[2]}
          shadow={colors[3]}
          highlight={colors[2]}
          width={violet ? 5.5 : 9}
          relief={1.1}
          opacity={violet ? 0.7 : 0.5}
        />
      ))}
      {veilStitches.map((d, i) => (
        <NookThread
          key={i}
          d={d}
          color={paint("silk")}
          shadow={colors[3]}
          highlight={colors[2]}
          width={i === 1 ? 1.85 : 2.2}
          relief={1.45}
          opacity={violet ? 0.95 : 0.8}
        />
      ))}
    </svg>
  );
}

/** The Light parts along a violet seam, exposing the actual starry sky below. */
export function NookShadowbringersLightParting() {
  return (
    <>
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className="nook-cycle-surface nook-shb-light-veil"
          data-cycle={`shb-light-${side}`}
        >
          <LightCloth />
        </div>
      ))}
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className="nook-cycle-surface nook-shb-light-veil nook-shb-light-edge"
          data-cycle={`shb-light-edge-${side}`}
        >
          <LightCloth violet />
        </div>
      ))}
    </>
  );
}
