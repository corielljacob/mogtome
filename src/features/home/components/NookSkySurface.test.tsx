import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { NookSkySurface } from "./NookSkySurface";

it("selects exported holiday exposures without mounting sewn path geometry", () => {
  const { container, rerender } = render(
    <NookSkySurface scene="all-saints-wake" />,
  );
  const image = container.querySelector("img")!;
  expect(image.src).toContain("sky-all-saints-wake-day");
  expect(image.srcset).toContain("524w");
  expect(image.srcset).toContain("1048w");
  expect(image).toHaveAttribute("alt", "");
  expect(image).toHaveAttribute("width", "262");
  expect(image).toHaveAttribute("height", "373");
  expect(image).toHaveAttribute("fetchpriority", "high");
  expect(container.querySelector("svg, path")).toBeNull();

  rerender(
    <NookSkySurface scene="all-saints-wake" exposure="night" active={false} />,
  );
  expect(container.querySelector("img")).toBe(image);
  expect(image.src).toContain("sky-all-saints-wake-night");
  expect(image).toHaveAttribute("fetchpriority", "low");

  rerender(<NookSkySurface scene="all-saints-wake" exposure="dusk" />);
  expect(image.src).toContain("sky-all-saints-wake-dusk");
  expect(image).toHaveAttribute("fetchpriority", "low");
});

it("retains Evercold's live weather beneath its exported glazing when dusk reverses", () => {
  const clouds = (
    <svg className="nook-cycle-surface nook-ec-clouds">
      <g data-cycle="evercold-clouds">
        <g data-cycle-model="0" />
      </g>
    </svg>
  );
  const { container, rerender } = render(
    <NookSkySurface scene="evercold" exposure="dusk">
      {clouds}
    </NookSkySurface>,
  );
  const vault = container.querySelector(".nook-ec-vault")!;
  const [background, weather, foreground] = Array.from(vault.children);
  expect(background.getAttribute("src")).toContain(
    "sky-evercold-dusk-day-background",
  );
  expect(weather).toHaveClass("nook-ec-clouds");
  expect(foreground.getAttribute("src")).toContain(
    "sky-evercold-dusk-day-foreground",
  );
  const model = weather.querySelector("[data-cycle-model]");

  rerender(
    <NookSkySurface scene="evercold" exposure="dusk" isDark>
      {clouds}
    </NookSkySurface>,
  );
  expect(Array.from(vault.children)).toEqual([background, weather, foreground]);
  expect(weather.querySelector("[data-cycle-model]")).toBe(model);
  expect(background.getAttribute("src")).toContain(
    "sky-evercold-dusk-night-background",
  );
  expect(foreground.getAttribute("src")).toContain(
    "sky-evercold-dusk-night-foreground",
  );
});

it("keeps Endwalker's fixed space cloth independent of the room palette", () => {
  const { container, rerender } = render(<NookSkySurface scene="endwalker" />);
  const image = container.querySelector("img")!;
  const source = image.src;
  rerender(<NookSkySurface scene="endwalker" isDark />);
  expect(container.querySelector("img")).toBe(image);
  expect(image.src).toBe(source);
});
