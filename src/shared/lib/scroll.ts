/** smooth scroll the document back to the top (Back-to-top button) */
export function scrollAppToTop() {
  const reduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("reduce-motion");
  window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
  document.getElementById("main-content")?.focus({ preventScroll: true });
}

/** jump (no smooth) on route changes so each view starts at the top.
 *  Writes scrollTop directly to bypass the CSS `scroll-behavior: smooth`. */
export function jumpAppToTop() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0; // Safari fallback
}
