import { type ReactNode, type ButtonHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  outline?: boolean;
  fun?: boolean; // Enable extra fun animations
}

/**
 * Button - KUPO BIT refined button with gradient and ghost variants.
 * Now with extra moogle magic! ✨
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  outline = false,
  fun = true,
  className = '',
  disabled,
  // Destructure motion event handlers to prevent conflicts with motion.button
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  onAnimationIteration: _onAnimationIteration,
  ...props
}: ButtonProps) {
  // Suppress unused variable warnings - these are intentionally destructured
  // to prevent React's native event handlers from being passed to motion.button
  void _onDrag; void _onDragStart; void _onDragEnd;
  void _onAnimationStart; void _onAnimationEnd; void _onAnimationIteration;
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (fun && !outline && variant === 'primary') {
      // Create sparkles on hover
      const newSparkles = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setSparkles(newSparkles);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSparkles([]);
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-inter font-medium
    rounded-xl
    transition-all duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer
  `;

  const sizeClasses = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = outline
    ? {
        primary: 'border-2 border-[var(--bento-primary)] text-[var(--bento-primary)] bg-transparent hover:bg-[var(--bento-primary)]/10 focus-visible:ring-[var(--bento-primary)]',
        secondary: 'border-2 border-[var(--bento-secondary)] text-[var(--bento-secondary)] bg-transparent hover:bg-[var(--bento-secondary)]/10 focus-visible:ring-[var(--bento-secondary)]',
        ghost: 'border-2 border-[var(--bento-border)] text-[var(--bento-text)] bg-transparent hover:bg-[var(--bento-bg)] focus-visible:ring-[var(--bento-border)]',
        danger: 'border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500/10 focus-visible:ring-red-500',
        success: 'border-2 border-green-500 text-green-500 bg-transparent hover:bg-green-500/10 focus-visible:ring-green-500',
      }
    : {
        primary: `
          bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-primary)]/90
          text-white
          shadow-md shadow-[var(--bento-primary)]/20
          hover:shadow-lg hover:shadow-[var(--bento-primary)]/30
          focus-visible:ring-[var(--bento-primary)]
        `,
        secondary: `
          bg-gradient-to-r from-[var(--bento-secondary)] to-[var(--bento-secondary)]/90
          text-white
          shadow-md shadow-[var(--bento-secondary)]/20
          hover:shadow-lg hover:shadow-[var(--bento-secondary)]/30
          focus-visible:ring-[var(--bento-secondary)]
        `,
        ghost: `
          bg-transparent
          text-[var(--bento-text)]
          hover:bg-[var(--bento-bg)]
          border border-[var(--bento-border)]
          focus-visible:ring-[var(--bento-border)]
        `,
        danger: `
          bg-gradient-to-r from-red-500 to-red-600
          text-white
          shadow-md shadow-red-500/20
          hover:shadow-lg hover:shadow-red-500/30
          focus-visible:ring-red-500
        `,
        success: `
          bg-gradient-to-r from-green-500 to-emerald-500
          text-white
          shadow-md shadow-green-500/20
          hover:shadow-lg hover:shadow-green-500/30
          focus-visible:ring-green-500
        `,
      };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} relative overflow-hidden`}
      disabled={disabled || isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={fun ? { 
        scale: 1.03,
        y: -2,
      } : undefined}
      whileTap={fun ? { 
        scale: 0.97,
        y: 0,
      } : undefined}
      transition={{
        duration: 0.05
      }}
      {...props}
    >
      {/* Shimmer effect on hover */}
      {fun && !outline && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%', opacity: 0 }}
          animate={isHovered ? { x: '100%', opacity: 0.3 } : { x: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent skew-x-12" />
        </motion.div>
      )}

      {/* Floating sparkles */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute pointer-events-none"
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              y: [0, -20],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Sparkles className="w-3 h-3 text-white/80" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loading spinner */}
      {isLoading && (
        <motion.svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </motion.svg>
      )}
      
      {/* Content with slight bounce on hover */}
      <motion.span 
        className="relative z-10 flex items-center gap-2"
        animate={isHovered && fun ? { y: [0, -1, 0] } : {}}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

/**
 * IconButton - Icon-only control styled to match Button.
 * Accessibility: Requires aria-label for screen reader support.
 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon to display */
  icon: ReactNode;
  /** Accessible label for screen readers (required for icon-only buttons) */
  'aria-label': string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'primary' | 'secondary';
  fun?: boolean;
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  fun = true,
  className = '',
  'aria-label': ariaLabel,
  // Destructure motion event handlers to prevent conflicts with motion.button
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  onAnimationIteration: _onAnimationIteration,
  ...props
}: IconButtonProps) {
  // Suppress unused variable warnings - these are intentionally destructured
  // to prevent React's native event handlers from being passed to motion.button
  void _onDrag; void _onDragStart; void _onDragEnd;
  void _onAnimationStart; void _onAnimationEnd; void _onAnimationIteration;
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const variantClasses = {
    ghost: 'bg-transparent hover:bg-[var(--bento-bg)] text-[var(--bento-text-muted)] hover:text-[var(--bento-text)]',
    primary: 'bg-[var(--bento-primary)]/10 hover:bg-[var(--bento-primary)]/20 text-[var(--bento-primary)]',
    secondary: 'bg-[var(--bento-secondary)]/10 hover:bg-[var(--bento-secondary)]/20 text-[var(--bento-secondary)]',
  };

  return (
    <motion.button
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center
        rounded-xl
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2
        cursor-pointer
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      whileHover={fun ? { scale: 1.1, rotate: 5 } : undefined}
      whileTap={fun ? { scale: 0.9, rotate: -5 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
    </motion.button>
  );
}
