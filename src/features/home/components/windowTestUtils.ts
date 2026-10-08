import { createElement } from "react";
import { act, render, waitFor } from "@testing-library/react";
import type { ColorTheme } from "@/shared/contexts/ThemeContext";
import { NookWindowView } from "./NookWindowView";

/** Resolve artwork chunks before tests inspect synchronous exposure changes. */
export async function warmWindowThemes(themes: ColorTheme[]) {
  for (const colorTheme of themes) {
    const view = render(
      createElement(NookWindowView, {
        isDark: false,
        eventId: null,
        colorTheme,
      }),
    );
    await waitFor(() => {
      if (view.container.querySelector(".nook-window-placeholder"))
        throw new Error("Artwork is loading");
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    act(() => view.unmount());
  }
}
