import { render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NookWindowView } from "./NookWindowView";

vi.mock("./NookShiroganeView", () => ({ NookShiroganeView: () => null }));
vi.mock("./NookSkyEmbroidery", () => ({ NookSkyEmbroidery: () => null }));

class Playback {
  currentTime = 0;
  playbackRate = 1;
  playState: AnimationPlayState = "running";
  pause = vi.fn(() => {
    this.playState = "paused";
  });
  play = vi.fn(() => {
    this.playState = "running";
  });
  updatePlaybackRate = vi.fn((rate: number) => {
    this.playbackRate = rate;
  });
  cancel = vi.fn(() => {
    this.playState = "idle";
    this.currentTime = 0;
  });
}

const tracks: { element: Element; playback: Playback }[] = [];
const originalAnimate = Object.getOwnPropertyDescriptor(
  Element.prototype,
  "animate",
);

beforeEach(() => {
  tracks.length = 0;
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    value: function (this: Element) {
      const playback = new Playback();
      tracks.push({ element: this, playback });
      return playback as unknown as Animation;
    },
  });
});

afterEach(() => {
  if (originalAnimate) {
    Object.defineProperty(Element.prototype, "animate", originalAnimate);
  } else {
    Reflect.deleteProperty(Element.prototype, "animate");
  }
});

it("binds replacement holiday sky models without restarting a reversed or settled cycle", () => {
  const { container, rerender } = render(
    <NookWindowView isDark={false} eventId={null} />,
  );
  rerender(<NookWindowView isDark eventId={null} />);
  tracks.forEach(({ playback }) => {
    playback.currentTime = 1200;
  });
  rerender(<NookWindowView isDark={false} eventId={null} />);
  const originalTracks = tracks.splice(0);
  const originalSunModels = Array.from(
    container.querySelectorAll('[data-cycle="sun"] [data-cycle-model]'),
  );

  rerender(<NookWindowView isDark={false} eventId="all-saints-wake" />);

  expect(originalSunModels.every((model) => !model.isConnected)).toBe(true);
  originalTracks.forEach(({ playback }) => {
    expect(playback.cancel).toHaveBeenCalledOnce();
  });
  const replacementModels = container.querySelectorAll("[data-cycle-model]");
  expect(replacementModels).toHaveLength(9);
  replacementModels.forEach((element) => {
    expect(tracks.some((track) => track.element === element)).toBe(true);
  });
  tracks.forEach(({ element, playback }) => {
    expect(element.isConnected).toBe(true);
    expect(playback.currentTime).toBe(1200);
    expect(playback.playbackRate).toBe(-1);
    expect(playback.playState).toBe("running");
    playback.currentTime = 0;
    playback.playState = "finished";
  });

  tracks.length = 0;
  rerender(<NookWindowView isDark={false} eventId={null} />);

  expect(tracks).not.toHaveLength(0);
  tracks.forEach(({ playback }) => {
    expect(playback.currentTime).toBe(0);
    expect(playback.playState).toBe("paused");
    expect(playback.play).not.toHaveBeenCalled();
  });
});
