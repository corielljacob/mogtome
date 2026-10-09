import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Home } from "./HomePage";

const theme = vi.hoisted(() => ({
  colorTheme: "pom-pom",
  event: null as { id: string; name: string } | null,
  eventActive: false,
}));
const modules = vi.hoisted(() => {
  let resolveArr!: () => void;
  let resolveHalloween!: () => void;
  const arrReady = new Promise<void>((resolve) => {
    resolveArr = resolve;
  });
  const halloweenReady = new Promise<void>((resolve) => {
    resolveHalloween = resolve;
  });
  return {
    loaded: [] as string[],
    arrReady,
    halloweenReady,
    resolveArr,
    resolveHalloween,
  };
});

vi.mock("@/shared/contexts/ThemeContext", () => ({
  useTheme: () => ({
    settings: { colorTheme: theme.colorTheme },
    activeEvent: theme.event,
    isEventThemeActive: theme.eventActive,
    isDarkMode: false,
  }),
  THEME_DEFINITIONS: [{ id: "pom-pom", name: "Pom-pom" }],
}));
vi.mock("./components/HomeEntrance", () => ({
  HomeEntrance: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));
vi.mock("./components/NookIllustration", () => ({
  NookIllustration: () => <svg data-testid="window-art" />,
}));
vi.mock("./components/NookAppliqueBacking", () => ({
  NookAppliqueBacking: () => null,
}));
vi.mock("./components/NookMoogleInteraction", () => ({
  NookMoogleInteraction: ({ children }: { children: React.ReactNode }) =>
    children,
}));
vi.mock("./components/NookRoomDecor", () => ({
  NookRoomDecor: () => null,
  NookFloorDecor: () => null,
}));
vi.mock("./components/NookFairyLights", () => ({
  NookFairyLights: () => null,
}));
vi.mock("./components/NookHolidayKeepsake", () => ({
  NookHolidayKeepsake: () => null,
}));
vi.mock("./components/NookWallHanging", () => ({
  NookWallHanging: () => <svg data-testid="ordinary-wall" />,
}));
vi.mock("./components/NookPressedFlower", () => ({
  NookPressedFlower: () => <svg data-testid="ordinary-letter" />,
}));
vi.mock("./components/NookStationeryDetails", () => ({
  NookPaperclip: () => <svg data-testid="paperclip" />,
  NookPhotoCorners: () => null,
}));

vi.mock("./components/NookArrKeepsakes", async () => {
  modules.loaded.push("arr");
  await modules.arrReady;
  return {
    NookArrWayfinder: () => <svg data-testid="arr-wall" />,
    NookArrCrystalCharm: () => <svg data-testid="arr-letter" />,
  };
});
vi.mock("./components/NookHeavenswardKeepsakes", () => {
  modules.loaded.push("heavensward");
  return {
    NookHeavenswardBanner: () => <svg data-testid="heavensward-wall" />,
    NookHeavenswardSeal: () => <svg data-testid="heavensward-letter" />,
  };
});
vi.mock("./components/NookStormbloodKeepsakes", () => {
  modules.loaded.push("stormblood");
  return {
    NookStormbloodBanner: () => <svg data-testid="stormblood-wall" />,
    NookStormbloodCharm: () => <svg data-testid="stormblood-letter" />,
  };
});
vi.mock("./components/NookShadowbringersKeepsakes", () => {
  modules.loaded.push("shadowbringers");
  return {
    NookShadowbringersBanner: () => <svg data-testid="shadowbringers-wall" />,
    NookShadowbringersCharm: () => <svg data-testid="shadowbringers-letter" />,
  };
});
vi.mock("./components/NookEndwalkerKeepsakes", () => {
  modules.loaded.push("endwalker");
  return {
    NookEndwalkerBanner: () => <svg data-testid="endwalker-wall" />,
    NookEndwalkerCharm: () => <svg data-testid="endwalker-letter" />,
  };
});
vi.mock("./components/NookDawntrailKeepsakes", () => {
  modules.loaded.push("dawntrail");
  return {
    NookDawntrailNoticePin: () => <svg data-testid="dawntrail-wall" />,
    NookDawntrailCharm: () => <svg data-testid="dawntrail-letter" />,
  };
});
vi.mock("./components/NookEvercoldKeepsakes", () => {
  modules.loaded.push("evercold");
  return {
    NookEvercoldBanner: () => <svg data-testid="evercold-wall" />,
    NookEvercoldCharm: () => <svg data-testid="evercold-letter" />,
  };
});
vi.mock("./components/NookHalloweenDetails", async () => {
  modules.loaded.push("halloween");
  await modules.halloweenReady;
  return {
    default: ({ placement }: { placement: string }) => (
      <span data-testid={`halloween-${placement}`} />
    ),
  };
});

function home() {
  return (
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

beforeEach(() => {
  theme.colorTheme = "pom-pom";
  theme.event = null;
  theme.eventActive = false;
});
afterEach(cleanup);

it("shows ordinary artwork and navigation immediately without loading other themes", () => {
  render(home());

  expect(screen.getByTestId("ordinary-wall")).toBeInTheDocument();
  expect(screen.getByTestId("ordinary-letter")).toBeInTheDocument();
  expect(screen.getByTestId("paperclip")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Meet the members" }),
  ).toHaveAttribute("href", "/members");
  expect(modules.loaded).toEqual([]);
});

it("keeps the home links and window visible while the active theme loads once for both placements", async () => {
  theme.colorTheme = "arr";
  render(home());

  expect(screen.getByTestId("window-art")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /The Chronicle/ })).toHaveAttribute(
    "href",
    "/chronicle",
  );
  expect(screen.getByRole("link", { name: "about the FC" })).toHaveAttribute(
    "href",
    "/about",
  );
  expect(screen.queryByTestId("ordinary-letter")).not.toBeInTheDocument();
  expect(screen.queryByTestId("paperclip")).not.toBeInTheDocument();
  await waitFor(() => expect(modules.loaded).toEqual(["arr"]));

  await act(async () => modules.resolveArr());
  expect(await screen.findByTestId("arr-wall")).toBeInTheDocument();
  expect(screen.getByTestId("arr-letter")).toBeInTheDocument();
  expect(modules.loaded).toEqual(["arr"]);
});

it.each([
  "heavensward",
  "stormblood",
  "shadowbringers",
  "endwalker",
  "dawntrail",
  "evercold",
])(
  "shows both %s keepsakes and restores the ordinary ones on theme change",
  async (colorTheme) => {
    theme.colorTheme = colorTheme;
    const { rerender } = render(home());

    expect(await screen.findByTestId(`${colorTheme}-wall`)).toBeInTheDocument();
    expect(screen.getByTestId(`${colorTheme}-letter`)).toBeInTheDocument();
    expect(screen.queryByTestId("paperclip")).not.toBeInTheDocument();
    expect(modules.loaded.filter((name) => name === colorTheme)).toHaveLength(
      1,
    );

    theme.colorTheme = "pom-pom";
    rerender(home());
    expect(screen.getByTestId("ordinary-wall")).toBeInTheDocument();
    expect(screen.getByTestId("ordinary-letter")).toBeInTheDocument();
    expect(screen.getByTestId("paperclip")).toBeInTheDocument();
    expect(screen.queryByTestId(`${colorTheme}-wall`)).not.toBeInTheDocument();
  },
);

it("loads Halloween details together without delaying the welcome or links", async () => {
  theme.colorTheme = "arr";
  theme.event = { id: "all-saints-wake", name: "All Saints’ Wake" };
  theme.eventActive = true;
  render(home());

  expect(
    screen.getByRole("heading", { name: "Welcome home, kupo." }),
  ).toBeInTheDocument();
  const badgeLabel = screen.getByText("All Saints’ Wake", {
    selector: ".nook-halloween-badge-label",
  });
  expect(badgeLabel).toBeInTheDocument();
  expect(badgeLabel.parentElement?.querySelector("svg")).toHaveAttribute(
    "viewBox",
    "-3 -2 37 34",
  );
  expect(
    screen.getByRole("link", { name: /The Chronicle/ }),
  ).toBeInTheDocument();
  expect(screen.getByTestId("ordinary-wall")).toBeInTheDocument();
  expect(screen.queryByTestId("arr-wall")).not.toBeInTheDocument();
  expect(screen.queryByTestId("ordinary-letter")).not.toBeInTheDocument();
  await waitFor(() => expect(modules.loaded).toContain("halloween"));

  await act(async () => modules.resolveHalloween());
  expect(await screen.findByTestId("halloween-room")).toBeInTheDocument();
  for (const placement of ["badge", "letter", "hearth"]) {
    expect(screen.getByTestId(`halloween-${placement}`)).toBeInTheDocument();
  }
  expect(modules.loaded.filter((name) => name === "halloween")).toHaveLength(1);
});

it("gives a non-Halloween event the ordinary keepsakes and paperclip", () => {
  theme.colorTheme = "arr";
  theme.event = { id: "starlight", name: "Starlight Celebration" };
  theme.eventActive = true;
  render(home());

  expect(screen.getByTestId("ordinary-wall")).toBeInTheDocument();
  expect(screen.getByTestId("ordinary-letter")).toBeInTheDocument();
  expect(screen.getByTestId("paperclip")).toBeInTheDocument();
  expect(screen.queryByTestId("arr-wall")).not.toBeInTheDocument();
  expect(screen.queryByTestId("halloween-badge")).not.toBeInTheDocument();
});
