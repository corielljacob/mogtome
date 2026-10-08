import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { NookVines } from "./NookVines";
import { NookPlant } from "./NookPlant";

it.each([
  { layer: "back", hasGarland: false },
  { layer: "back", hasGarland: true },
  { layer: "front", hasGarland: false },
  { layer: "front", hasGarland: true },
] as const)(
  "keeps only referenced sewn exposures for $layer ivy with garland $hasGarland",
  ({ layer, hasGarland }) => {
    const { container } = render(
      <svg>
        <NookVines layer={layer} hasGarland={hasGarland} />
      </svg>,
    );
    const leaves = Array.from(container.querySelectorAll(".nook-ivy-leaf"));
    expect(leaves.length).toBeGreaterThan(0);
    const definitions = new Set<string>();
    for (const leaf of leaves) {
      const poses = Array.from(leaf.querySelectorAll("[data-sewn-model]"));
      expect(poses.map((pose) => pose.getAttribute("data-sewn-model"))).toEqual(
        ["0", "1", "2"],
      );
      const outlines = poses.map((pose) => {
        const target = pose
          .querySelector("use")!
          .getAttribute("href")!
          .slice(1);
        definitions.add(target);
        const drawing = container.querySelector(`[id="${target}"]`)!;
        expect(drawing).not.toBeNull();
        return drawing.querySelector("clipPath path")!.getAttribute("d");
      });
      expect(new Set(outlines).size).toBe(3);
    }
    // Repeated leaves reference cached drawings rather than duplicating them.
    expect(definitions.size).toBeLessThan(leaves.length * 3);
    const mountedDefinitions = Array.from(
      container.querySelectorAll(".nook-vines > defs > g[id]"),
      (drawing) => drawing.id,
    );
    expect(new Set(mountedDefinitions)).toEqual(definitions);
  },
);

it("keeps the remaining leaves anchored to the same pose clocks when a garland appears", () => {
  const { container, rerender } = render(
    <svg>
      <NookVines layer="front" hasGarland={false} />
    </svg>,
  );
  const leaves = Array.from(
    container.querySelectorAll<SVGGElement>(".nook-ivy-leaf"),
  );
  const originalLeaves = new Map(
    leaves.map((leaf) => [
      leaf.style.animationDelay,
      {
        element: leaf,
        transform: leaf.parentElement!.getAttribute("transform"),
        style: leaf.getAttribute("style"),
        models: Array.from(leaf.querySelectorAll("use"), (model) =>
          model.getAttribute("href"),
        ),
      },
    ]),
  );
  rerender(
    <svg>
      <NookVines layer="front" hasGarland />
    </svg>,
  );
  const garlandLeaves = Array.from(
    container.querySelectorAll<SVGGElement>(".nook-ivy-leaf"),
  );
  expect(garlandLeaves).toHaveLength(leaves.length - 9);
  for (const leaf of garlandLeaves) {
    const original = originalLeaves.get(leaf.style.animationDelay)!;
    expect(leaf).toBe(original.element);
    expect(leaf.parentElement!.getAttribute("transform")).toBe(
      original.transform,
    );
    expect(leaf.getAttribute("style")).toBe(original.style);
    expect(
      Array.from(leaf.querySelectorAll("use"), (model) =>
        model.getAttribute("href"),
      ),
    ).toEqual(original.models);
  }
});

it("keeps distinct sewn flower poses while the vase stays still", () => {
  const { container, rerender } = render(
    <svg>
      <NookPlant />
    </svg>,
  );
  const vase = container.querySelector(".nook-plant")!;
  const poses = Array.from(
    container.querySelectorAll(".nook-posy > [data-sewn-model]"),
  );
  expect(poses.map((pose) => pose.getAttribute("data-sewn-model"))).toEqual([
    "0",
    "1",
    "2",
  ]);
  expect(
    new Set(poses.map((pose) => pose.querySelector("path")!.getAttribute("d")))
      .size,
  ).toBe(3);
  rerender(
    <svg>
      <NookPlant />
    </svg>,
  );
  expect(container.querySelector(".nook-plant")).toBe(vase);
  expect(
    Array.from(container.querySelectorAll(".nook-posy > [data-sewn-model]")),
  ).toEqual(poses);
});
