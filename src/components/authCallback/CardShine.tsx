import { motion } from "motion/react";

export function CardShine({
  delay = 0,
  intensity = "normal",
}: {
  delay?: number;
  intensity?: "subtle" | "normal" | "bright";
}) {
  const opacityMap = { subtle: 0.2, normal: 0.4, bright: 0.6 };
  const opacity = opacityMap[intensity];

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-y-0 w-[250%] -left-[150%]"
        style={{
          background: `linear-gradient(
            105deg,
            transparent 0%,
            transparent 35%,
            rgba(255,255,255,${opacity * 0.3}) 42%,
            rgba(255,255,255,${opacity}) 50%,
            rgba(255,255,255,${opacity * 0.3}) 58%,
            transparent 65%,
            transparent 100%
          )`,
        }}
        initial={{ x: "0%" }}
        animate={{ x: "100%" }}
        transition={{
          delay: delay,
          duration: 1.0,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
      <motion.div
        className="absolute inset-y-0 w-[200%] -left-full"
        style={{
          background: `linear-gradient(
            95deg,
            transparent 0%,
            transparent 40%,
            rgba(255,255,255,${opacity * 0.15}) 48%,
            rgba(255,255,255,${opacity * 0.25}) 52%,
            rgba(255,255,255,${opacity * 0.15}) 56%,
            transparent 64%,
            transparent 100%
          )`,
        }}
        initial={{ x: "0%" }}
        animate={{ x: "100%" }}
        transition={{
          delay: delay + 0.15,
          duration: 0.9,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
    </motion.div>
  );
}
