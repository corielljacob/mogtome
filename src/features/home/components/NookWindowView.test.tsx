import { render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NookWindowView } from "./NookWindowView";

vi.mock("./NookShiroganeView", () => ({ NookShiroganeView: () => null }));
vi.mock("./NookSkyEmbroidery", () => ({ NookSkyEmbroidery: () => null }));
vi.mock("./NookHeavenswardSkyEmbroidery", () => ({
  NookHeavenswardSkyEmbroidery: () => null,
}));
vi.mock("./NookArrView", () => ({
  NookArrView: () => <svg data-testid="mothercrystal" />,
}));
vi.mock("./NookHeavenswardView", () => ({
  NookHeavenswardView: ({ isDark }: { isDark: boolean }) => (
    <g data-testid={isDark ? "ishgard-night" : "ishgard-day"} />
  ),
}));
vi.mock("./NookHeavenswardWeather", () => ({
  NookHeavenswardSky: () => <svg data-testid="ishgard-sky" />,
  NookHeavenswardWeather: () => <svg data-testid="ishgard-weather" />,
}));

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

it("keeps ARR outside the day cycle and restores the seasonal sky when a holiday takes over", () => {
  const { container, getByTestId, queryByTestId, rerender } = render(
    <NookWindowView isDark={false} eventId={null} colorTheme="arr" />,
  );
  const crystal = getByTestId("mothercrystal");
  expect(tracks).toHaveLength(0);
  expect(container.querySelector("[data-cycle]")).toBeNull();

  rerender(<NookWindowView isDark eventId={null} colorTheme="arr" />);
  expect(getByTestId("mothercrystal")).toBe(crystal);
  expect(tracks).toHaveLength(0);

  rerender(
    <NookWindowView isDark eventId="all-saints-wake" colorTheme="arr" />,
  );
  expect(queryByTestId("mothercrystal")).toBeNull();
  expect(tracks.length).toBeGreaterThan(0);
  expect(
    container.querySelector('[data-scene="all-saints-wake"]'),
  ).not.toBeNull();

  const holidayTracks = tracks.splice(0);
  rerender(<NookWindowView isDark eventId={null} colorTheme="arr" />);
  expect(getByTestId("mothercrystal")).toBeInTheDocument();
  holidayTracks.forEach(({ playback }) => {
    expect(playback.cancel).toHaveBeenCalledOnce();
  });
  expect(tracks).toHaveLength(0);
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

it("preserves the day cycle across Heavensward changes and gives holidays priority over its weather", () => {
  const { container, getByTestId, queryByTestId, rerender } = render(
    <NookWindowView isDark={false} eventId={null} colorTheme="heavensward" />,
  );
  const weather = getByTestId("ishgard-weather");
  const sky = getByTestId("ishgard-sky");
  const day = getByTestId("ishgard-day");
  const night = getByTestId("ishgard-night");
  expect(weather.closest(".nook-cycle-landscape")).toBeNull();
  expect(sky.closest(".nook-cycle-landscape")).toBeNull();
  expect(
    sky.compareDocumentPosition(day) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(
    night.compareDocumentPosition(weather) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  const originalTracks = [...tracks];

  rerender(<NookWindowView isDark eventId={null} colorTheme="heavensward" />);
  expect(getByTestId("ishgard-weather")).toBe(weather);
  expect(getByTestId("ishgard-sky")).toBe(sky);
  expect(getByTestId("ishgard-day")).toBe(day);
  expect(getByTestId("ishgard-night")).toBe(night);
  tracks.forEach(({ playback }) => {
    playback.currentTime = 1800;
  });
  rerender(
    <NookWindowView isDark={false} eventId={null} colorTheme="heavensward" />,
  );
  rerender(
    <NookWindowView isDark={false} eventId={null} colorTheme="pom-pom" />,
  );
  expect(queryByTestId("ishgard-weather")).toBeNull();
  expect(queryByTestId("ishgard-sky")).toBeNull();
  expect(queryByTestId("ishgard-day")).toBeNull();

  rerender(
    <NookWindowView isDark={false} eventId={null} colorTheme="heavensward" />,
  );
  expect(getByTestId("ishgard-weather")).toBeInTheDocument();
  rerender(
    <NookWindowView
      isDark={false}
      eventId="starlight"
      colorTheme="heavensward"
    />,
  );
  expect(queryByTestId("ishgard-weather")).toBeNull();
  expect(queryByTestId("ishgard-sky")).toBeNull();
  expect(queryByTestId("ishgard-night")).toBeNull();
  expect(container.querySelector('[data-scene="starlight"]')).not.toBeNull();
  expect(tracks).toHaveLength(originalTracks.length);
  originalTracks.forEach(({ element, playback }) => {
    expect(element.isConnected).toBe(true);
    expect(playback.currentTime).toBe(1800);
    expect(playback.playbackRate).toBe(-1);
    expect(playback.cancel).not.toHaveBeenCalled();
  });
});
