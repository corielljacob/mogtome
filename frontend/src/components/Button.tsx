import { type ReactNode } from 'react';
import { motion } from 'motion/react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  outline?: boolean;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  outline = false,
  className = '',
  disabled,
  type = 'button',
  onClick,
}: ButtonProps) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    error: 'btn-error',
  }[variant];

  const sizeClass = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }[size];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`btn ${variantClass} ${sizeClass} ${outline ? 'btn-outline' : ''} ${className}`}
      disabled={disabled || isLoading}
      type={type}
      onClick={onClick}
    >
      {isLoading && <span className="loading loading-spinner loading-sm" />}
      {children}
    </motion.button>
  );
}
