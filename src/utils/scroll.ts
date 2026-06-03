/** Id of the app's scroll container (the overflow-y-auto wrapper in App.tsx).
 *  The app scrolls inside this element, not the window — so scroll helpers must
 *  target it. */
export const APP_SCROLL_ID = 'app-scroll';

/** Smoothly scroll the app's scroll container to the top (falls back to window). */
export function scrollAppToTop() {
  const el = document.getElementById(APP_SCROLL_ID);
  (el ?? window).scrollTo({ top: 0, behavior: 'smooth' });
}
