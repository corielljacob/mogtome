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

vi.mock("./NookStormbloodSkyEmbroidery", () => ({
  NookStormbloodSkyEmbroidery: () => null,
}));
vi.mock("./NookStormbloodView", () => ({
  NookStormbloodView: ({ isDark }: { isDark: boolean }) => (
    <g data-testid={isDark ? "ala-mhigo-night" : "ala-mhigo-day"} />
  ),
}));
vi.mock("./NookStormbloodAtmosphere", () => ({
  NookStormbloodSky: () => <svg data-testid="ala-mhigo-sky" />,
  NookStormbloodBreeze: () => <svg data-testid="ala-mhigo-weather" />,
}));
vi.mock("./NookShadowbringersSkyEmbroidery", () => ({
  NookShadowbringersSkyEmbroidery: () => null,
}));
vi.mock("./NookShadowbringersLightParting", () => ({
  NookShadowbringersLightParting: () => (
    <div data-testid="parting-light">
      {["left", "right", "edge-left", "edge-right"].map((side) => (
        <div key={side} data-cycle={`shb-light-${side}`} />
      ))}
    </div>
  ),
}));
vi.mock("./NookShadowbringersView", () => ({
  NookShadowbringersView: ({ isDark }: { isDark: boolean }) => (
    <g data-testid={isDark ? "crystarium-night" : "crystarium-day"} />
  ),
}));
vi.mock("./NookShadowbringersAtmosphere", () => ({
  NookShadowbringersSky: () => <svg data-testid="crystarium-sky" />,
  NookShadowbringersLeaves: () => <svg data-testid="crystarium-weather" />,
}));
vi.mock("./NookEndwalkerSkyEmbroidery", () => ({
  NookEndwalkerSkyEmbroidery: () => null,
}));
vi.mock("./NookEndwalkerView", () => ({
  NookEndwalkerView: () => <g data-testid="lunar-surface" />,
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

it.each(["starlight", "all-saints-wake"] as const)(
  "keeps lunar space stable in both room modes and yields to %s",
  (eventId) => {
    const { container, getByTestId, queryByTestId, rerender } = render(
      <NookWindowView isDark={false} eventId={null} colorTheme="endwalker" />,
    );
    const surface = getByTestId("lunar-surface");
    const planet = container.querySelector(".nook-ew-etheirys");
    expect(planet).not.toBeNull();
    expect(tracks).toHaveLength(0);
    expect(container.querySelector("[data-cycle]")).toBeNull();
    expect(
      planet!.compareDocumentPosition(surface) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    const fixedPlanet = planet!.outerHTML;
    rerender(<NookWindowView isDark eventId={null} colorTheme="endwalker" />);
    expect(getByTestId("lunar-surface")).toBe(surface);
    expect(container.querySelector(".nook-ew-etheirys")).toBe(planet);
    expect(planet!.outerHTML).toBe(fixedPlanet);
    expect(tracks).toHaveLength(0);

    rerender(
      <NookWindowView isDark eventId={eventId} colorTheme="endwalker" />,
    );
    expect(queryByTestId("lunar-surface")).toBeNull();
    expect(container.querySelector(".nook-ew-space")).toBeNull();
    expect(tracks.length).toBeGreaterThan(0);
    tracks.forEach(({ playback }) => expect(playback.currentTime).toBe(4800));
    const holidayTracks = tracks.splice(0);
    rerender(<NookWindowView isDark eventId={null} colorTheme="endwalker" />);
    expect(getByTestId("lunar-surface")).toBeInTheDocument();
    expect(container.querySelector(".nook-ew-etheirys")).not.toBeNull();
    holidayTracks.forEach(({ playback }) =>
      expect(playback.cancel).toHaveBeenCalledOnce(),
    );
    expect(tracks).toHaveLength(0);
  },
);

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

it.each([
  ["heavensward", "ishgard"],
  ["stormblood", "ala-mhigo"],
] as const)(
  "preserves the %s day cycle and gives holidays priority over its atmosphere",
  (theme, scene) => {
    const { container, getByTestId, queryByTestId, rerender } = render(
      <NookWindowView isDark={false} eventId={null} colorTheme={theme} />,
    );
    const weather = getByTestId(`${scene}-weather`);
    const sky = getByTestId(`${scene}-sky`);
    const day = getByTestId(`${scene}-day`);
    const night = getByTestId(`${scene}-night`);
    expect(weather.closest(".nook-cycle-landscape")).toBeNull();
    expect(sky.closest(".nook-cycle-landscape")).toBeNull();
    expect(
      sky.compareDocumentPosition(day) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      night.compareDocumentPosition(weather) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    const originalTracks = [...tracks];

    rerender(<NookWindowView isDark eventId={null} colorTheme={theme} />);
    expect(getByTestId(`${scene}-weather`)).toBe(weather);
    expect(getByTestId(`${scene}-sky`)).toBe(sky);
    expect(getByTestId(`${scene}-day`)).toBe(day);
    expect(getByTestId(`${scene}-night`)).toBe(night);
    tracks.forEach(({ playback }) => {
      playback.currentTime = 1800;
    });
    rerender(
      <NookWindowView isDark={false} eventId={null} colorTheme={theme} />,
    );
    rerender(
      <NookWindowView isDark={false} eventId={null} colorTheme="pom-pom" />,
    );
    expect(queryByTestId(`${scene}-weather`)).toBeNull();
    expect(queryByTestId(`${scene}-sky`)).toBeNull();
    expect(queryByTestId(`${scene}-day`)).toBeNull();

    rerender(
      <NookWindowView isDark={false} eventId={null} colorTheme={theme} />,
    );
    expect(getByTestId(`${scene}-weather`)).toBeInTheDocument();
    rerender(
      <NookWindowView isDark={false} eventId="starlight" colorTheme={theme} />,
    );
    expect(queryByTestId(`${scene}-weather`)).toBeNull();
    expect(queryByTestId(`${scene}-sky`)).toBeNull();
    expect(queryByTestId(`${scene}-night`)).toBeNull();
    expect(container.querySelector('[data-scene="starlight"]')).not.toBeNull();
    expect(tracks).toHaveLength(originalTracks.length);
    originalTracks.forEach(({ element, playback }) => {
      expect(element.isConnected).toBe(true);
      expect(playback.currentTime).toBe(1800);
      expect(playback.playbackRate).toBe(-1);
      expect(playback.cancel).not.toHaveBeenCalled();
    });
  },
);

it("preserves the parting Light phase when switching themes or yielding to a holiday", () => {
  const { container, getByTestId, queryByTestId, rerender } = render(
    <NookWindowView
      isDark={false}
      eventId={null}
      colorTheme="shadowbringers"
    />,
  );
  const curtain = getByTestId("parting-light");
  const city = getByTestId("crystarium-day");
  const nightCity = getByTestId("crystarium-night");
  const weather = getByTestId("crystarium-weather");
  expect(
    curtain.compareDocumentPosition(city) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(
    nightCity.compareDocumentPosition(weather) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  expect(
    tracks.filter(({ element }) =>
      element.getAttribute("data-cycle")?.startsWith("shb-light-"),
    ),
  ).toHaveLength(4);

  rerender(
    <NookWindowView isDark eventId={null} colorTheme="shadowbringers" />,
  );
  expect(getByTestId("parting-light")).toBe(curtain);
  expect(getByTestId("crystarium-day")).toBe(city);
  tracks.forEach(({ playback }) => {
    playback.currentTime = 1800;
  });
  rerender(
    <NookWindowView
      isDark={false}
      eventId={null}
      colorTheme="shadowbringers"
    />,
  );

  for (const next of ["pom-pom", "shadowbringers", "starlight"] as const) {
    const oldTracks = tracks.splice(0);
    rerender(
      <NookWindowView
        isDark={false}
        eventId={next === "starlight" ? next : null}
        colorTheme={next === "starlight" ? "shadowbringers" : next}
      />,
    );
    oldTracks.forEach(({ playback }) =>
      expect(playback.cancel).toHaveBeenCalledOnce(),
    );
    expect(tracks.length).toBeGreaterThan(0);
    tracks.forEach(({ element, playback }) => {
      expect(element.isConnected).toBe(true);
      expect(playback.currentTime).toBe(1800);
      expect(playback.playbackRate).toBe(-1);
      expect(playback.playState).toBe("running");
    });
    expect(Boolean(queryByTestId("parting-light"))).toBe(
      next === "shadowbringers",
    );
    expect(Boolean(queryByTestId("crystarium-weather"))).toBe(
      next === "shadowbringers",
    );
  }
  expect(container.querySelector('[data-scene="starlight"]')).not.toBeNull();
});
