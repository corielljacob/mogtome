/** the overflow-y-auto wrapper in App.tsx; the app scrolls inside this, not the window */
export const APP_SCROLL_ID = "app-scroll";

export function scrollAppToTop() {
  const el = document.getElementById(APP_SCROLL_ID);
  (el ?? window).scrollTo({ top: 0, behavior: "smooth" });
}

/** jump (no smooth) on route changes so each view starts at the top */
export function jumpAppToTop() {
  const el = document.getElementById(APP_SCROLL_ID);
  if (el) {
    el.scrollTop = 0;
    el.scrollLeft = 0;
  } else {
    window.scrollTo(0, 0);
  }
}
