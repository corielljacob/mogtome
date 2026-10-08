import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HomeEntrance } from "./HomeEntrance";

const motion = vi.hoisted(() => ({ reduced: false }));
vi.mock("@/shared/hooks/useReducedMotion", () => ({
  useReducedMotion: () => motion.reduced,
}));

let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;

function flushFrame() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(0));
  });
}

beforeEach(() => {
  motion.reduced = false;
  frames = new Map();
  nextFrame = 0;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    frames.delete(id);
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("waits for a preparation paint before starting the entrance", () => {
  render(<HomeEntrance className="home-screen" data-testid="home" />);
  const home = screen.getByTestId("home");
  expect(home).toHaveClass("home-screen");
  expect(home).toHaveAttribute("data-entrance", "pending");
  expect(frames.size).toBe(1);

  flushFrame();
  expect(home).toHaveAttribute("data-entrance", "pending");
  expect(frames.size).toBe(1);

  flushFrame();
  expect(home).toHaveAttribute("data-entrance", "ready");
  expect(frames.size).toBe(0);
});

it("starts the entrance without rendering or remounting the artwork again", () => {
  const renderScene = vi.fn(() => <svg data-testid="scene" />);
  function Scene() {
    return renderScene();
  }
  render(
    <HomeEntrance>
      <Scene />
    </HomeEntrance>,
  );
  const scene = screen.getByTestId("scene");

  flushFrame();
  flushFrame();

  expect(screen.getByTestId("scene")).toBe(scene);
  expect(renderScene).toHaveBeenCalledOnce();
});

it("does not replay the entrance when the room changes mode", () => {
  const { rerender } = render(
    <HomeEntrance data-testid="home" data-mode="light" />,
  );
  flushFrame();
  flushFrame();
  const scheduledFrames = vi.mocked(window.requestAnimationFrame).mock.calls
    .length;

  rerender(<HomeEntrance data-testid="home" data-mode="dark" />);

  expect(screen.getByTestId("home")).toHaveAttribute("data-mode", "dark");
  expect(screen.getByTestId("home")).toHaveAttribute("data-entrance", "ready");
  expect(window.requestAnimationFrame).toHaveBeenCalledTimes(scheduledFrames);
  expect(frames.size).toBe(0);
});

it.each([0, 1])(
  "cancels the pending frame when unmounted after %i ticks",
  (ticks) => {
    const { unmount } = render(<HomeEntrance />);
    for (let tick = 0; tick < ticks; tick++) flushFrame();
    const pendingFrame = [...frames.keys()][0];
    expect(pendingFrame).toBeDefined();

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(pendingFrame);
    expect(frames.size).toBe(0);
  },
);

it("shows reduced-motion content immediately and does not replay when motion is enabled", () => {
  motion.reduced = true;
  const { rerender } = render(<HomeEntrance data-testid="home" />);
  expect(screen.getByTestId("home")).toHaveAttribute("data-entrance", "static");
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();

  motion.reduced = false;
  rerender(<HomeEntrance data-testid="home" />);

  expect(screen.getByTestId("home")).toHaveAttribute("data-entrance", "static");
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();
});

it("settles an active entrance when reduced motion is enabled without replaying later", () => {
  const { rerender } = render(<HomeEntrance data-testid="home" />);
  flushFrame();
  flushFrame();
  expect(screen.getByTestId("home")).toHaveAttribute("data-entrance", "ready");

  motion.reduced = true;
  rerender(<HomeEntrance data-testid="home" />);
  expect(screen.getByTestId("home")).toHaveAttribute("data-entrance", "static");
  flushFrame();
  const scheduledFrames = vi.mocked(window.requestAnimationFrame).mock.calls
    .length;

  motion.reduced = false;
  rerender(<HomeEntrance data-testid="home" />);

  expect(screen.getByTestId("home")).toHaveAttribute("data-entrance", "static");
  expect(window.requestAnimationFrame).toHaveBeenCalledTimes(scheduledFrames);
  expect(frames.size).toBe(0);
});
