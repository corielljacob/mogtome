import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { render } from "@testing-library/react";
import sharp from "sharp";
import { expect, it } from "vitest";
import { NookThread } from "./NookThread";

const stitches = Array.from(
  { length: 24 },
  (_, i) => `M${10 + i * 3} 12q-2 12 1 28`,
).join(" ");

it.each([
  { relief: 1 },
  { relief: 2.4, opacity: 0.65 },
  { relief: 1.8, dasharray: "2.3 1" },
])("preserves the painted thread layers with %j", async (options) => {
  const width = 2.2;
  const { relief, opacity = 1 } = options;
  const dasharray = "dasharray" in options ? options.dasharray : undefined;
  const svg = (children: React.ReactNode) =>
    renderToStaticMarkup(
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="60">
        <defs>
          <clipPath id="surface">
            <rect x="12" y="10" width="65" height="30" rx="6" />
          </clipPath>
        </defs>
        <g clipPath="url(#surface)">{children}</g>
      </svg>,
    );
  // Compare the three authored paint layers with the shared geometry at 2x,
  // including clipped ends, separate strand widths, alpha and dashed seams.
  const original = svg(
    <g
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dasharray}
      opacity={opacity}
    >
      <path
        d={stitches}
        stroke="#5b423d"
        strokeWidth={width + 0.5 * relief}
        opacity={0.29 * Math.min(relief, 1.4)}
        transform={`translate(${0.25 * relief} ${0.45 * relief})`}
      />
      <path d={stitches} stroke="#b18c75" strokeWidth={width} />
      <path
        d={stitches}
        stroke="#fdf1dc"
        strokeWidth={width * 0.28}
        opacity=".4"
        strokeDasharray={dasharray ?? "4.1 .8 2.3 1.1 6.2 .7"}
        transform={`translate(${-0.16 * relief} ${-0.2 * relief})`}
      />
    </g>,
  );
  const optimized = svg(
    createElement(NookThread, {
      d: stitches,
      color: "#b18c75",
      shadow: "#5b423d",
      highlight: "#fdf1dc",
      width,
      ...options,
    }),
  );
  const pixels = (markup: string) =>
    sharp(Buffer.from(markup), { density: 144 }).ensureAlpha().raw().toBuffer();
  const [before, after] = await Promise.all([
    pixels(original),
    pixels(optimized),
  ]);
  expect(after.equals(before)).toBe(true);
});

it("keeps path references unique and stable when multiple threads change paint", () => {
  const art = (color: string) => (
    <svg>
      <NookThread d={stitches} color={color} />
      <NookThread d={stitches} color={color} />
    </svg>
  );
  const { container, rerender } = render(art("red"));
  const paths = Array.from(container.querySelectorAll("path"));
  expect(paths).toHaveLength(2);
  const ids = paths.map((path) => path.id);
  expect(new Set(ids).size).toBe(2);
  for (const use of container.querySelectorAll("use")) {
    expect(ids).toContain(use.getAttribute("href")?.slice(1));
  }
  rerender(art("blue"));
  expect(Array.from(container.querySelectorAll("path"))).toEqual(paths);
  expect(paths.map((path) => path.id)).toEqual(ids);
});
