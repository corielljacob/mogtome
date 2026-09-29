import { useLayoutEffect, type RefObject } from "react";

/** Keep scroll targets clear of wrapping controls, including with larger text. */
export function useStickyToolbar(
  scopeRef: RefObject<HTMLElement | null>,
  toolbarRef: RefObject<HTMLElement | null>,
) {
  // Run after every commit so toolbars appearing after loading are measured too.
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    const toolbar = toolbarRef.current;
    if (!scope || !toolbar) return;

    const measure = () => {
      const height = Math.ceil(toolbar.getBoundingClientRect().height);
      // A tall toolbar must not take over a short viewport or a zoomed page.
      const disabled = height > window.innerHeight * 0.4;
      toolbar.dataset.viewToolbar = "true";
      toolbar.dataset.stickyDisabled = String(disabled);
      scope.dataset.toolbarStickyDisabled = String(disabled);
      scope.style.setProperty(
        "--view-toolbar-height",
        `${disabled ? 0 : height}px`,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(toolbar);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      delete toolbar.dataset.viewToolbar;
      delete toolbar.dataset.stickyDisabled;
      delete scope.dataset.toolbarStickyDisabled;
      scope.style.removeProperty("--view-toolbar-height");
    };
  });
}
