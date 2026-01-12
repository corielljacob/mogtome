import { type ReactNode, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  outline?: boolean;
}

/**
 * Button - KUPO BIT refined button with gradient and ghost variants.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  outline = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-inter font-medium
    rounded-xl
    transition-all duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
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
          hover:brightness-110
          focus-visible:ring-[var(--bento-primary)]
        `,
        secondary: `
          bg-gradient-to-r from-[var(--bento-secondary)] to-[var(--bento-secondary)]/90
          text-white
          shadow-md shadow-[var(--bento-secondary)]/20
          hover:shadow-lg hover:shadow-[var(--bento-secondary)]/30
          hover:brightness-110
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
          hover:brightness-110
          focus-visible:ring-red-500
        `,
        success: `
          bg-gradient-to-r from-green-500 to-emerald-500
          text-white
          shadow-md shadow-green-500/20
          hover:shadow-lg hover:shadow-green-500/30
          hover:brightness-110
          focus-visible:ring-green-500
        `,
      };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
        </svg>
      )}
      {children}
    </button>
  );
}

/**
 * IconButton - Icon-only control styled to match Button.
 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'primary' | 'secondary';
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  className = '',
  ...props
}: IconButtonProps) {
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
    <button
      className={`
        inline-flex items-center justify-center
        rounded-xl
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2
        active:scale-95
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
}
