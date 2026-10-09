import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { NookIllustration } from "./NookIllustration";

const holiday = vi.hoisted(() => {
  let resolve!: () => void;
  return {
    loaded: vi.fn(),
    ready: new Promise<void>((done) => {
      resolve = done;
    }),
    finish: () => resolve(),
  };
});

vi.mock("./NookWindowView", () => ({
  NookWindowView: () => <div data-testid="window-view" />,
}));
vi.mock("./NookVines", () => ({ NookVines: () => null }));
vi.mock("./NookProps", () => ({ NookProps: () => null }));
vi.mock("./NookSeasonalDecor", async () => {
  holiday.loaded();
  await holiday.ready;
  return { NookSeasonalDecor: () => <g data-testid="holiday-decor" /> };
});

afterEach(cleanup);

it("renders the ordinary window without requesting seasonal artwork", () => {
  const { container } = render(
    <NookIllustration isDark={false} eventId={null} />,
  );
  expect(screen.getByTestId("window-view")).toBeVisible();
  expect(container.querySelector(".nook-illustration")).toBeVisible();
  expect(holiday.loaded).not.toHaveBeenCalled();
});

it("preserves the window frame while seasonal artwork loads and after it clears", async () => {
  const { container, rerender } = render(
    <NookIllustration isDark={false} eventId="all-saints-wake" />,
  );
  const frame = container.querySelector(".nook-illustration");
  expect(frame).toBeVisible();
  expect(screen.getByTestId("window-view")).toBeVisible();
  expect(screen.queryByTestId("holiday-decor")).not.toBeInTheDocument();
  await waitFor(() => expect(holiday.loaded).toHaveBeenCalledTimes(1));
  await act(async () => holiday.finish());
  expect(await screen.findByTestId("holiday-decor")).toBeInTheDocument();
  expect(container.querySelector(".nook-illustration")).toBe(frame);
  rerender(<NookIllustration isDark={false} eventId={null} />);
  expect(screen.queryByTestId("holiday-decor")).not.toBeInTheDocument();
  expect(container.querySelector(".nook-illustration")).toBe(frame);
});
