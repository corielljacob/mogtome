export const DAY_CYCLE_DURATION = 4800;
const DAY_CYCLE_FRAME_COUNT = Math.round((DAY_CYCLE_DURATION / 1000) * 12);
const physicalLayers = new Set(["sun", "moon", "clouds"]);

// Change the sewn replacement every three physical exposures. Keyframe holds
// share the orbit clock, so reversal retraces the same models and either resting
// endpoint presents model zero without a separate, continuously ticking loop.
const sewnModelFrames: Keyframe[][] = [0, 1, 2].map((model) =>
  Array.from({ length: DAY_CYCLE_FRAME_COUNT + 1 }, (_, exposure) => {
    const frame =
      exposure === DAY_CYCLE_FRAME_COUNT
        ? 0
        : [0, 1, 2, 1][Math.floor(exposure / 3) % 4];
    return {
      offset: exposure / DAY_CYCLE_FRAME_COUNT,
      opacity: frame === model ? 1 : 0,
      easing: "steps(1, end)",
    };
  }),
);

// Sample the orbits once. Physical cutouts hold twelve exposures per second;
// the light between them changes continuously, like a lit stop-motion set.
const sunArc: Keyframe[] = Array.from({ length: 17 }, (_, index) => {
  const t = index / 16;
  return {
    offset: t * 0.64,
    transform: `translate(${98 * t - 46 * t * t}%, ${-8 * t + 51 * t * t}%)`,
    opacity: t < 0.78 ? 1 : Math.max(0, (1 - t) / 0.22),
  };
});
const moonArc: Keyframe[] = Array.from({ length: 17 }, (_, index) => {
  const t = index / 16;
  return {
    offset: 0.48 + t * 0.52,
    transform: `translate(${28 - 8 * t - 20 * t * t}%, ${55 * (1 - t) ** 2}%)`,
    opacity: Math.min(1, t * 2.2),
  };
});

// A shared clock makes a retoggle retrace the current light rather than restart.
export const dayCycleFrames: Record<string, Keyframe[]> = {
  "night-sky": [
    { opacity: 0, offset: 0 },
    { opacity: 0.08, offset: 0.22 },
    { opacity: 0.62, offset: 0.56 },
    { opacity: 1, offset: 0.86 },
    { opacity: 1, offset: 1 },
  ],
  dusk: [
    { opacity: 0, offset: 0 },
    { opacity: 0.25, offset: 0.18 },
    { opacity: 0.8, offset: 0.4 },
    { opacity: 0.45, offset: 0.58 },
    { opacity: 0, offset: 0.86 },
    { opacity: 0, offset: 1 },
  ],
  sun: [...sunArc, { transform: "translate(52%, 43%)", opacity: 0, offset: 1 }],
  moon: [
    { transform: "translate(28%, 55%)", opacity: 0, offset: 0 },
    ...moonArc,
  ],
  clouds: [
    { opacity: 0.88, transform: "translateX(0%)", offset: 0 },
    { opacity: 0.64, transform: "translateX(2%)", offset: 0.4 },
    { opacity: 0.12, transform: "translateX(4%)", offset: 0.75 },
    { opacity: 0.06, transform: "translateX(5%)", offset: 1 },
  ],
  stars: [
    { opacity: 0, offset: 0 },
    { opacity: 0, offset: 0.62 },
    { opacity: 0.25, offset: 0.77 },
    { opacity: 1, offset: 1 },
  ],
  "night-landscape": [
    { opacity: 0, offset: 0 },
    { opacity: 0.08, offset: 0.3 },
    { opacity: 0.42, offset: 0.52 },
    { opacity: 0.85, offset: 0.77 },
    { opacity: 1, offset: 1 },
  ],
  "golden-hour": [
    { opacity: 0, offset: 0 },
    { opacity: 0.13, offset: 0.2 },
    { opacity: 0.27, offset: 0.4 },
    { opacity: 0.1, offset: 0.63 },
    { opacity: 0, offset: 0.85 },
    { opacity: 0, offset: 1 },
  ],
};

export function createDayCycle(
  root: HTMLElement,
  isDark: boolean,
): Animation[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>("[data-cycle], [data-cycle-model]"),
  ).flatMap((layer) => {
    const cycle = layer.dataset.cycle ?? "";
    const model = layer.dataset.cycleModel;
    const frames =
      model === undefined
        ? dayCycleFrames[cycle]
        : sewnModelFrames[Number(model)];
    if (!frames || typeof layer.animate !== "function") return [];
    const animation = layer.animate(frames, {
      duration: DAY_CYCLE_DURATION,
      fill: "both",
      easing: physicalLayers.has(cycle)
        ? `steps(${DAY_CYCLE_FRAME_COUNT}, end)`
        : "linear",
    });
    animation.pause();
    animation.currentTime = isDark ? DAY_CYCLE_DURATION : 0;
    return [animation];
  });
}

export function setDayCycleTarget(
  animations: Animation[],
  isDark: boolean,
  reducedMotion: boolean,
) {
  const target = isDark ? DAY_CYCLE_DURATION : 0;
  for (const animation of animations) {
    if (reducedMotion || animation.currentTime === target) {
      animation.pause();
      animation.currentTime = target;
    } else {
      animation.updatePlaybackRate(isDark ? 1 : -1);
      animation.play();
    }
  }
}
