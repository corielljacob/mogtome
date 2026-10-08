import { act, render } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vitest";
import { NookWindowView } from "./NookWindowView";
import { warmWindowThemes } from "./windowTestUtils";
import { observeHomeAnimationVisibility } from "./homeAnimationVisibility";

beforeAll(
  () =>
    warmWindowThemes([
      "arr",
      "heavensward",
      "stormblood",
      "shadowbringers",
      "endwalker",
      "dawntrail",
      "evercold",
    ]),
  20000,
);

vi.mock("./NookLandscape", () => ({
  NookLandscape: ({
    scene,
    night,
    className,
  }: {
    scene: string;
    night?: boolean;
    className?: string;
  }) => {
    const labels: Record<string, string> = {
      heavensward: "ishgard",
      stormblood: "ala-mhigo",
      shadowbringers: "crystarium",
      dawntrail: "tuliyollal",
      evercold: "evercold",
    };
    return (
      <img
        className={className}
        alt=""
        data-testid={
          scene === "endwalker"
            ? "lunar-surface"
            : labels[scene]
              ? `${labels[scene]}-${night ? "night" : "day"}`
              : undefined
        }
      />
    );
  },
}));
vi.mock("./NookSkyEmbroidery", () => ({ NookSkyEmbroidery: () => null }));
vi.mock("./NookHeavenswardSkyEmbroidery", () => ({
  NookHeavenswardSkyEmbroidery: () => null,
}));
vi.mock("./NookArrView", () => ({
  NookArrView: () => <svg data-testid="mothercrystal" />,
}));
vi.mock("./NookHeavenswardWeather", () => ({
  NookHeavenswardSky: () => <svg data-testid="ishgard-sky" />,
  NookHeavenswardWeather: () => <svg data-testid="ishgard-weather" />,
}));

vi.mock("./NookStormbloodSkyEmbroidery", () => ({
  NookStormbloodSkyEmbroidery: () => null,
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
vi.mock("./NookShadowbringersAtmosphere", () => ({
  NookShadowbringersSky: () => <svg data-testid="crystarium-sky" />,
  NookShadowbringersLeaves: () => <svg data-testid="crystarium-weather" />,
}));
vi.mock("./NookEndwalkerSkyEmbroidery", () => ({
  NookEndwalkerSkyEmbroidery: () => null,
}));

class Playback {
  constructor(target: Element) {
    this.effect = { target, getComputedTiming: () => ({ endTime: 4800 }) };
  }
  effect: { target: Element; getComputedTiming: () => { endTime: number } };
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
      const playback = new Playback(this);
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
  vi.restoreAllMocks();
  if (originalAnimate) {
    Object.defineProperty(Element.prototype, "animate", originalAnimate);
  } else {
    Reflect.deleteProperty(Element.prototype, "animate");
  }
});

it("preserves a hidden transition's playback intent when a new scene rebinds its tracks", async () => {
  const view = (holiday = false, dark = false) => (
    <div className="nook-window-scene">
      <NookWindowView
        isDark={dark}
        eventId={holiday ? "all-saints-wake" : null}
      />
    </div>
  );
  const { container, rerender } = render(view());
  Object.defineProperty(container, "getAnimations", {
    value: () => tracks.map(({ playback }) => playback),
  });
  const visibility = vi.spyOn(document, "visibilityState", "get");
  const stop = observeHomeAnimationVisibility(container);
  try {
    rerender(view(false, true));
    tracks.forEach(({ playback }) => {
      playback.currentTime = 1200;
    });
    visibility.mockReturnValue("hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(
      tracks.every(({ playback }) => playback.playState === "paused"),
    ).toBe(true);
    const oldTracks = tracks.splice(0);

    await act(async () => rerender(view(true, true)));

    expect(tracks.length).toBeGreaterThan(0);
    oldTracks.forEach(({ playback }) =>
      expect(playback.cancel).toHaveBeenCalledOnce(),
    );
    tracks.forEach(({ playback }) => {
      expect(playback.currentTime).toBe(1200);
      expect(playback.playState).toBe("paused");
    });
    visibility.mockReturnValue("visible");
    document.dispatchEvent(new Event("visibilitychange"));
    tracks.forEach(({ playback }) => {
      expect(playback.currentTime).toBe(1200);
      expect(playback.playState).toBe("running");
    });
  } finally {
    stop();
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
  async (theme, scene) => {
    const { container, getByTestId, findByTestId, queryByTestId, rerender } =
      render(
        <NookWindowView isDark={false} eventId={null} colorTheme={theme} />,
      );
    const weather = await findByTestId(`${scene}-weather`);
    const sky = await findByTestId(`${scene}-sky`);
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

it("preserves the parting Light phase when switching themes or yielding to a holiday", async () => {
  const { container, getByTestId, findByTestId, queryByTestId, rerender } =
    render(
      <NookWindowView
        isDark={false}
        eventId={null}
        colorTheme="shadowbringers"
      />,
    );
  const curtain = getByTestId("parting-light");
  const city = getByTestId("crystarium-day");
  const nightCity = getByTestId("crystarium-night");
  const weather = await findByTestId("crystarium-weather");
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
