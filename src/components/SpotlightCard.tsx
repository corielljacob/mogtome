import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, type HTMLMotionProps } from 'motion/react';

interface SpotlightCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  enableTilt?: boolean;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.1)',
  spotlightSize = 350,
  enableTilt = false,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Tilt values
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Spotlight position
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    // Tilt calculation (if enabled)
    if (enableTilt) {
      const xPct = (clientX - left) / width - 0.5;
      const yPct = (clientY - top) / height - 0.5;
      rotateX.set(yPct * -5); // Invert Y for natural tilt
      rotateY.set(xPct * 5);
    }
  }

  function handleMouseLeave() {
    if (enableTilt) {
      rotateX.set(0);
      rotateY.set(0);
    }
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${spotlightSize}px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Content */}
      <div className="relative z-0 h-full">
        {children}
      </div>
    </motion.div>
  );
}
