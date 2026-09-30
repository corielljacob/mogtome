import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrollAppToTop } from "./scroll";

let main: HTMLElement;

beforeEach(() => {
  main = document.createElement("main");
  main.id = "main-content";
  main.tabIndex = -1;
  document.body.append(main);
  vi.mocked(window.scrollTo).mockClear();
});

afterEach(() => {
  main.remove();
  document.documentElement.classList.remove("reduce-motion");
  vi.restoreAllMocks();
});

describe("scrollAppToTop", () => {
  it.each([
    {
      setting: "the default motion settings",
      osReducedMotion: false,
      appReducedMotion: false,
      behavior: "smooth",
    },
    {
      setting: "the system reduced-motion preference",
      osReducedMotion: true,
      appReducedMotion: false,
      behavior: "instant",
    },
    {
      setting: "the app reduced-motion preference",
      osReducedMotion: false,
      appReducedMotion: true,
      behavior: "instant",
    },
  ])(
    "respects $setting and moves focus without a second scroll",
    ({ osReducedMotion, appReducedMotion, behavior }) => {
      const matchMedia = vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: osReducedMotion,
      } as MediaQueryList);
      document.documentElement.classList.toggle(
        "reduce-motion",
        appReducedMotion,
      );
      const focus = vi.spyOn(main, "focus");

      scrollAppToTop();

      expect(matchMedia).toHaveBeenCalledWith(
        "(prefers-reduced-motion: reduce)",
      );
      expect(window.scrollTo).toHaveBeenCalledExactlyOnceWith({
        top: 0,
        behavior,
      });
      expect(focus).toHaveBeenCalledExactlyOnceWith({ preventScroll: true });
      expect(main).toHaveFocus();
    },
  );
});
