import { memo } from "react";
import { motion } from "motion/react";

const AMBIENT_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: 15 + Math.random() * 70,
  y: 20 + Math.random() * 60,
  delay: i * 0.1,
  size: 4 + Math.random() * 6,
  duration: 2 + Math.random() * 1.5,
  rise: -30 - Math.random() * 20, // upward drift distance for the float animation
  color: i % 2 === 0 ? "var(--primary)" : "var(--secondary)",
}));

export const AmbientGlow = memo(function AmbientGlow({
  isActive,
}: {
  isActive: boolean;
}) {
  const particles = AMBIENT_PARTICLES;

  if (!isActive) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.4, 0],
            scale: [0, 1, 1.2, 0],
            y: [0, p.rise],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
});
