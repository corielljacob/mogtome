import { type ReactNode, type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  outline?: boolean;
  fun?: boolean;
}

/**
 * Button - Warm, tactile button with CSS-only interactions.
 * Hover lifts and wobbles slightly; active squishes down.
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
  ...props
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-soft font-semibold tracking-[0.01em]
    rounded-2xl
    transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
    cursor-pointer border
    ${fun ? 'hover:not-disabled:-translate-y-0.5 active:not-disabled:animate-[stamp-press_0.3s_ease] active:not-disabled:translate-y-0' : ''}
  `;

  const sizeClasses = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3.5 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  const variantClasses = outline
    ? {
        primary: 'border-2 border-[color:color-mix(in_srgb,var(--primary)_42%,var(--border))] text-[var(--primary)] bg-[color:color-mix(in_srgb,var(--card)_88%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--primary)_8%,var(--card))] focus-visible:ring-[var(--primary)]',
        secondary: 'border-2 border-[color:color-mix(in_srgb,var(--secondary)_40%,var(--border))] text-[var(--secondary)] bg-[color:color-mix(in_srgb,var(--card)_88%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--secondary)_8%,var(--card))] focus-visible:ring-[var(--secondary)]',
        ghost: 'border-2 border-[var(--border)] text-[var(--text)] bg-transparent bg-[color:color-mix(in_srgb,var(--card)_88%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--bg)_86%,var(--card))] focus-visible:ring-[var(--border)]',
        danger: 'border-2 border-red-500/40 text-red-600 bg-red-500/5 hover:bg-red-500/10 focus-visible:ring-red-500',
        success: 'border-2 border-green-500/40 text-green-700 bg-green-500/5 hover:bg-green-500/10 focus-visible:ring-green-500',
      }
    : {
        primary: `
          bg-[var(--primary)] text-white
          border-[color:color-mix(in_srgb,var(--primary)_75%,black)]
          shadow-[0_2px_8px_-2px_color-mix(in_srgb,var(--primary)_40%,transparent)]
          hover:shadow-[0_4px_14px_-3px_color-mix(in_srgb,var(--primary)_50%,transparent)]
          focus-visible:ring-[var(--primary)]
        `,
        secondary: `
          bg-[var(--secondary)] text-white
          border-[color:color-mix(in_srgb,var(--secondary)_70%,black)]
          shadow-[0_2px_8px_-2px_color-mix(in_srgb,var(--secondary)_35%,transparent)]
          hover:shadow-[0_4px_14px_-3px_color-mix(in_srgb,var(--secondary)_45%,transparent)]
          focus-visible:ring-[var(--secondary)]
        `,
        ghost: `
          bg-[var(--card)] text-[var(--text)]
          hover:bg-[var(--bg)]
          border border-[var(--border)]
          shadow-[0_1px_4px_-1px_var(--shadow)]
          focus-visible:ring-[var(--border)]
        `,
        danger: `
          bg-red-600 text-white border-red-700
          shadow-[0_2px_8px_-2px_rgba(220,38,38,0.3)]
          focus-visible:ring-red-500
        `,
        success: `
          bg-emerald-600 text-white border-emerald-700
          shadow-[0_2px_8px_-2px_rgba(5,150,105,0.3)]
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
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

/**
 * IconButton - Icon-only control styled to match Button.
 * Accessibility: Requires aria-label for screen reader support.
 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
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
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const variantClasses = {
    ghost: 'bg-transparent hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)]',
    primary: 'bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)]',
    secondary: 'bg-[var(--secondary)]/10 hover:bg-[var(--secondary)]/20 text-[var(--secondary)]',
  };

  return (
    <button
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center
        rounded-2xl
        transition-[transform,colors] duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2
        cursor-pointer
        ${fun ? 'hover:scale-110 hover:rotate-[5deg] active:scale-90 active:rotate-[-5deg]' : ''}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}
