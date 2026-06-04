/** Id of the app's scroll container (the overflow-y-auto wrapper in App.tsx).
 *  The app scrolls inside this element, not the window — so scroll helpers must
 *  target it. */
export const APP_SCROLL_ID = "app-scroll";

/** Smoothly scroll the app's scroll container to the top (falls back to window). */
export function scrollAppToTop() {
  const el = document.getElementById(APP_SCROLL_ID);
  (el ?? window).scrollTo({ top: 0, behavior: "smooth" });
}

/** Instantly jump the app's scroll container to the top — used on route changes
 *  so each view starts at the top instead of keeping the previous scroll spot. */
export function jumpAppToTop() {
  const el = document.getElementById(APP_SCROLL_ID);
  if (el) {
    el.scrollTop = 0;
    el.scrollLeft = 0;
  } else {
    window.scrollTo(0, 0);
  }
}
