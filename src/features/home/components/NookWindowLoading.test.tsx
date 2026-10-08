import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { NookWindowView } from "./NookWindowView";

const weather = vi.hoisted(() => {
  function pending() {
    let resolve!: () => void;
    const ready = new Promise<void>((done) => {
      resolve = done;
    });
    return { ready, resolve };
  }
  return {
    loaded: [] as string[],
    heavensward: pending(),
    stormblood: pending(),
    shadowbringers: pending(),
  };
});

vi.mock("./NookLandscape", () => ({
  NookLandscape: ({ scene, night }: { scene: string; night?: boolean }) => (
    <img alt="" data-testid={`${scene}-${night ? "night" : "day"}`} />
  ),
}));
vi.mock("./NookSkySurface", () => ({
  NookSkySurface: ({
    scene,
    exposure = "day",
  }: {
    scene: string;
    exposure?: string;
  }) => <img alt="" data-testid={`${scene}-painted-sky-${exposure}`} />,
}));
vi.mock("./NookWindowSky", () => ({
  NookWindowSky: ({ layer }: { layer: string }) => (
    <svg data-testid={layer} data-cycle={layer} />
  ),
}));
vi.mock("./NookShadowbringersLightParting", () => ({
  NookShadowbringersLightParting: () => <svg />,
}));
vi.mock("./NookHeavenswardWeather", async () => {
  weather.loaded.push("heavensward");
  await weather.heavensward.ready;
  return {
    NookHeavenswardSky: () => <svg data-testid="heavensward-sky" />,
    NookHeavenswardWeather: () => <svg data-testid="heavensward-weather" />,
  };
});
vi.mock("./NookStormbloodAtmosphere", async () => {
  weather.loaded.push("stormblood");
  await weather.stormblood.ready;
  return {
    NookStormbloodSky: () => <svg data-testid="stormblood-sky" />,
    NookStormbloodBreeze: () => <svg data-testid="stormblood-weather" />,
  };
});
vi.mock("./NookShadowbringersAtmosphere", async () => {
  weather.loaded.push("shadowbringers");
  await weather.shadowbringers.ready;
  return {
    NookShadowbringersSky: () => <svg data-testid="shadowbringers-sky" />,
    NookShadowbringersLeaves: () => (
      <svg data-testid="shadowbringers-weather" />
    ),
  };
});

afterEach(cleanup);

it("does not download expansion weather for the ordinary window", () => {
  const { getByTestId, container } = render(
    <NookWindowView isDark={false} eventId={null} />,
  );
  expect(getByTestId("pom-pom-day")).toBeInTheDocument();
  expect(getByTestId("sun")).toBeInTheDocument();
  expect(container.querySelector(".nook-window-placeholder")).toBeNull();
  expect(weather.loaded).toEqual([]);
});

it.each(["heavensward", "stormblood", "shadowbringers"] as const)(
  "keeps the %s sky and landscape visible while its weather loads once",
  async (theme) => {
    const { getByTestId, findByTestId, queryByTestId, container, rerender } =
      render(
        <NookWindowView isDark={false} eventId={null} colorTheme={theme} />,
      );
    // Shadowbringers' separate light-parting chunk still owns its cycle tracks.
    await waitFor(() => expect(getByTestId(`${theme}-day`)).toBeVisible());
    const day = getByTestId(`${theme}-day`);
    const night = getByTestId(`${theme}-night`);
    expect(container.querySelector(".nook-window-placeholder")).toBeNull();
    expect(getByTestId("sun")).toBeVisible();
    expect(getByTestId(`${theme}-painted-sky-day`)).toBeVisible();
    expect(queryByTestId(`${theme}-weather`)).toBeNull();
    expect(queryByTestId(`${theme}-sky`)).toBeNull();
    await waitFor(() =>
      expect(weather.loaded.filter((loaded) => loaded === theme)).toHaveLength(
        1,
      ),
    );

    rerender(<NookWindowView isDark eventId={null} colorTheme={theme} />);
    expect(getByTestId(`${theme}-day`)).toBe(day);
    expect(getByTestId(`${theme}-night`)).toBe(night);
    expect(container.querySelector(".nook-window-exterior")).toHaveAttribute(
      "data-mode",
      "dark",
    );

    await act(async () => weather[theme].resolve());
    const sky = await findByTestId(`${theme}-sky`);
    const foreground = await findByTestId(`${theme}-weather`);
    expect(sky).toBeVisible();
    expect(foreground).toBeVisible();
    expect(
      sky.compareDocumentPosition(day) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      night.compareDocumentPosition(foreground) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(getByTestId(`${theme}-day`)).toBe(day);
    expect(weather.loaded.filter((loaded) => loaded === theme)).toHaveLength(1);

    rerender(<NookWindowView isDark eventId="starlight" colorTheme={theme} />);
    expect(queryByTestId(`${theme}-sky`)).toBeNull();
    expect(queryByTestId(`${theme}-weather`)).toBeNull();
    expect(getByTestId("starlight-day")).toBeInTheDocument();
  },
);
