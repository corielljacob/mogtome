import { memo } from "react";
import { motion } from "motion/react";

// generated once at module load - cosmetic, so no per-mount randomness needed,
// and keeping Math.random out of render keeps the components pure.
const CELEBRATION_PARTICLES = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
  const distance = 80 + Math.random() * 120;
  const size = 2 + Math.random() * 4;
  const colors = [
    "var(--primary)",
    "var(--secondary)",
    "var(--accent)",
    "var(--primary)",
    "var(--secondary)",
  ];
  return {
    id: i,
    startX: 50 + (Math.random() - 0.5) * 20,
    startY: 50 + (Math.random() - 0.5) * 20,
    endX: 50 + Math.cos(angle) * distance,
    endY: 50 + Math.sin(angle) * distance * 0.6, // flatten vertically
    delay: 0.02 * i + Math.random() * 0.15,
    duration: 0.8 + Math.random() * 0.4,
    size,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
  };
});

export const CelebrationSparkles = memo(function CelebrationSparkles({
  isActive,
}: {
  isActive: boolean;
}) {
  const particles = CELEBRATION_PARTICLES;

  if (!isActive) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-visible"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0.5],
            x: `${p.endX - p.startX}%`,
            y: `${p.endY - p.startY}%`,
            rotate: p.rotation,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {p.id % 3 === 0 ? (
            <svg viewBox="0 0 24 24" className="w-full h-full" fill={p.color}>
              <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
            </svg>
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
});
