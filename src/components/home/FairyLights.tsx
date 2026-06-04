import { motion } from "motion/react";
import { IS_MOBILE } from "../../utils";
import { DEFAULT_FAIRY_LIGHTS } from "./homeData";

/** Twinkling warm fairy lights — like a string of cozy golden fireflies */
export function FairyLights({
  lights,
}: {
  lights: typeof DEFAULT_FAIRY_LIGHTS;
}) {
  // PERFORMANCE: Skip fairy lights entirely on mobile — removes animated glow overhead
  if (IS_MOBILE) return null;
  const displayLights = lights;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {displayLights.map((light, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: light.left,
            top: light.top,
            width: light.size,
            height: light.size,
            backgroundColor: light.color,
          }}
          animate={{ opacity: [0.1, 0.85, 0.1], scale: [0.8, 1.3, 0.8] }}
          transition={{
            duration: light.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: light.delay,
          }}
        />
      ))}
    </div>
  );
}
