import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { NookFairyLights } from "./NookFairyLights";

it("shares three glass tones and one socket paint across all fifteen bulbs", () => {
  const { container } = render(<NookFairyLights />);
  const bulbs = Array.from(container.querySelectorAll(".nook-bulb"));
  expect(bulbs).toHaveLength(15);
  expect(
    container.querySelectorAll("linearGradient, radialGradient"),
  ).toHaveLength(13);
  expect(container.querySelectorAll("stop")).toHaveLength(50);
  expect(container.querySelectorAll(".nook-bulb defs")).toHaveLength(0);

  const glassPaints = bulbs.map(
    (bulb) => bulb.querySelector(".nook-bulb-glass")!.getAttribute("fill")!,
  );
  expect(new Set(glassPaints).size).toBe(3);
  for (const fill of new Set(glassPaints)) {
    expect(glassPaints.filter((paint) => paint === fill)).toHaveLength(5);
  }

  // Each bulb keeps its own CSS targets for light transitions and filament glow.
  for (const bulb of bulbs) {
    expect(bulb.querySelectorAll(".nook-bulb-halo")).toHaveLength(2);
    expect(bulb.querySelectorAll(".nook-bulb-filament")).toHaveLength(1);
  }
});

it("keeps shared bulb paints unique and resolvable when two strands are mounted", () => {
  const { container } = render(
    <>
      <NookFairyLights eventId="all-saints-wake" />
      <NookFairyLights eventId="starlight" />
    </>,
  );
  const ids = Array.from(container.querySelectorAll("[id]"), (element) =>
    element.getAttribute("id"),
  );
  expect(new Set(ids).size).toBe(ids.length);

  for (const strand of container.querySelectorAll(".nook-lights")) {
    for (const element of strand.querySelectorAll(
      '.nook-bulb [fill^="url(#"]',
    )) {
      const id = element.getAttribute("fill")!.slice(5, -1);
      const gradient = strand.querySelector(`[id="${id}"]`);
      expect(gradient).not.toBeNull();
      expect(gradient!.closest("svg")).toHaveClass("nook-light-strand");
    }
  }
});
