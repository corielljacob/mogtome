import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { NookMoogleInteraction } from "./NookMoogleInteraction";

vi.mock("./NookMoogle", () => ({
  NookMoogle: ({ booped }: { booped: boolean }) => (
    <svg data-testid="moogle" data-booped={booped} />
  ),
}));

afterEach(() => vi.useRealTimers());

it("keeps the scene and character mounted across taps and resets the reaction timer", () => {
  vi.useFakeTimers();
  const renderScene = vi.fn(() => <svg data-testid="window-scene" />);
  function Scene() {
    return renderScene();
  }
  render(
    <NookMoogleInteraction eventId={null}>
      <Scene />
    </NookMoogleInteraction>,
  );
  const art = screen.getByTestId("moogle");
  const scene = screen.getByTestId("window-scene");
  const button = screen.getByRole("button", { name: "Boop the moogle" });

  fireEvent.click(button);
  act(() => vi.advanceTimersByTime(1000));
  fireEvent.click(button);
  act(() => vi.advanceTimersByTime(1000));
  expect(art).toHaveAttribute("data-booped", "true");
  expect(screen.getByRole("status")).toHaveTextContent("kupo!");
  expect(screen.getByTestId("moogle")).toBe(art);
  expect(screen.getByTestId("window-scene")).toBe(scene);
  expect(renderScene).toHaveBeenCalledOnce();

  act(() => vi.advanceTimersByTime(800));
  expect(art).toHaveAttribute("data-booped", "false");
  expect(screen.getByRole("status")).toBeEmptyDOMElement();
});

it("restarts the reaction without restarting ambient animation", () => {
  const reaction = {
    animationName: "moogle-model-boop-1",
    currentTime: 900,
    play: vi.fn(),
  };
  const ambient = {
    animationName: "pom-sway",
    currentTime: 4200,
    play: vi.fn(),
  };
  render(<NookMoogleInteraction eventId="all-saints-wake" />);
  const button = screen.getByRole("button", { name: "Boop the moogle" });
  Object.defineProperty(button, "getAnimations", {
    value: () => [reaction, ambient],
  });
  fireEvent.click(button);
  fireEvent.click(button);

  expect(reaction.currentTime).toBe(0);
  expect(reaction.play).toHaveBeenCalledTimes(2);
  expect(ambient.currentTime).toBe(4200);
  expect(ambient.play).not.toHaveBeenCalled();
  expect(screen.getByRole("status")).toHaveTextContent("Boo, kupo!");
});
