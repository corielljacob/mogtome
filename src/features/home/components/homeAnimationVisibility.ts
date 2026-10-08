const regionSelector =
  ".nook-window-scene, .nook-reading-corner, .nook-halloween-hearth, .nook-room-charms, .nook-lights";
const visibilityPaused = new WeakSet<Animation>();

function isSettled(animation: Animation) {
  const end = animation.effect?.getComputedTiming().endTime;
  const time = animation.currentTime;
  return (
    typeof time === "number" &&
    (animation.playbackRate < 0
      ? time <= 0
      : typeof end === "number" && time >= end)
  );
}

/** A replacement scene must retain the intent of an interrupted transition. */
export function isAnimationPausedForVisibility(animation: Animation) {
  if (!visibilityPaused.has(animation) || isSettled(animation)) return false;
  const target = (animation.effect as KeyframeEffect | null)?.target;
  return (
    target instanceof Element && !target.closest('[data-reduced-motion="true"]')
  );
}

/** Freeze invisible artwork without a scroll listener or a React render. */
export function observeHomeAnimationVisibility(root: HTMLElement) {
  const regions = new Map<Element, boolean>();
  const paused = new Map<Animation, Element>();

  function pause(scope: Element) {
    for (const animation of scope.getAnimations?.({ subtree: true }) ?? []) {
      // CSS clocks are controlled by animation-play-state, including clocks
      // created later by lazy artwork. Only own the running script clocks.
      if (
        "animationName" in animation ||
        "transitionProperty" in animation ||
        animation.playState !== "running"
      )
        continue;
      const target = (animation.effect as KeyframeEffect | null)?.target;
      if (!(target instanceof Element)) continue;
      animation.pause();
      paused.set(animation, target);
      visibilityPaused.add(animation);
    }
  }

  function resume() {
    for (const [animation, target] of paused) {
      if (!root.contains(target) || animation.playState === "idle") {
        paused.delete(animation);
        visibilityPaused.delete(animation);
        continue;
      }
      if (target.closest('[data-animation-paused="true"]')) continue;
      paused.delete(animation);
      visibilityPaused.delete(animation);
      // Reduced motion or a new scene can settle a track while hidden. Leave
      // those endpoints alone. A browser can finish a pending pause on its
      // next frame, so exact equality with the time before pause is unreliable.
      if (
        animation.playState === "paused" &&
        !isSettled(animation) &&
        !target.closest('[data-reduced-motion="true"]')
      )
        animation.play();
    }
  }

  function sync() {
    const hidden = document.visibilityState === "hidden";
    if (hidden) root.setAttribute("data-animation-paused", "true");
    else root.removeAttribute("data-animation-paused");
    for (const [region, visible] of regions) {
      if (!visible) region.setAttribute("data-animation-paused", "true");
      else region.removeAttribute("data-animation-paused");
    }
    if (hidden) pause(root);
    else {
      for (const [region, visible] of regions) {
        if (!visible) pause(region);
      }
    }
    resume();
  }

  const observer =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (root.contains(entry.target))
                regions.set(entry.target, entry.isIntersecting);
            }
            sync();
          },
          // Resume a little before artwork scrolls into view.
          { rootMargin: "80px" },
        );

  function discoverRegions() {
    for (const region of root.querySelectorAll(regionSelector)) {
      if (regions.has(region)) continue;
      regions.set(region, true);
      observer?.observe(region);
    }
    for (const region of regions.keys()) {
      if (root.contains(region)) continue;
      observer?.unobserve(region);
      region.removeAttribute("data-animation-paused");
      regions.delete(region);
    }
  }

  const mutations = new MutationObserver(() => {
    discoverRegions();
    sync();
  });
  // Reconcile lazy artwork and mode changes that start a script clock while
  // hidden. Exclude our pause markers and animated styles from observation.
  mutations.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-mode", "data-scene", "data-reduced-motion"],
  });
  discoverRegions();
  sync();
  document.addEventListener("visibilitychange", sync);

  return () => {
    document.removeEventListener("visibilitychange", sync);
    observer?.disconnect();
    mutations.disconnect();
    root.removeAttribute("data-animation-paused");
    for (const region of regions.keys())
      region.removeAttribute("data-animation-paused");
    resume();
    paused.clear();
  };
}
