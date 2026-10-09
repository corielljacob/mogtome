import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { NookLandscape } from "./NookLandscape";
import { NookWindowView } from "./NookWindowView";

it("keeps the image mounted when selecting a different paint surface", () => {
  const { container, rerender } = render(<NookLandscape scene="heavensward" />);
  const image = container.querySelector("img")!;
  expect(image.src).toContain("landscape-heavensward-day");
  expect(image.srcset).toContain("524w");
  expect(image.srcset).toContain("1048w");
  expect(image).toHaveAttribute("alt", "");
  expect(image).toHaveAttribute("width", "262");
  expect(image).toHaveAttribute("height", "373");
  expect(image).toHaveAttribute("fetchpriority", "high");
  expect(container.querySelector("svg")).toBeNull();

  rerender(<NookLandscape scene="all-saints-wake" night active={false} />);
  expect(container.querySelector("img")).toBe(image);
  expect(image.src).toContain("landscape-all-saints-wake-night");
  expect(image).toHaveAttribute("data-mode", "dark");
  expect(image).toHaveAttribute("fetchpriority", "low");
});

it.each([false, true])(
  "prioritizes the initial %s mode without remounting either landscape on a toggle",
  (isDark) => {
    const view = (dark: boolean) => (
      <NookWindowView isDark={dark} eventId={null} />
    );
    const { container, rerender } = render(view(isDark));
    const day = container.querySelector(
      '[data-landscape="pom-pom"][data-mode="light"]',
    )!;
    const night = container.querySelector(
      '[data-landscape="pom-pom"][data-mode="dark"]',
    )!;
    expect(day).toHaveAttribute("fetchpriority", isDark ? "low" : "high");
    expect(night).toHaveAttribute("fetchpriority", isDark ? "high" : "low");
    expect(day).not.toHaveAttribute("loading", "lazy");
    expect(night).not.toHaveAttribute("loading", "lazy");

    rerender(view(!isDark));
    expect(
      container.querySelector('[data-landscape="pom-pom"][data-mode="light"]'),
    ).toBe(day);
    expect(
      container.querySelector('[data-landscape="pom-pom"][data-mode="dark"]'),
    ).toBe(night);
    expect(day).toHaveAttribute("fetchpriority", isDark ? "high" : "low");
    expect(night).toHaveAttribute("fetchpriority", isDark ? "low" : "high");
  },
);
