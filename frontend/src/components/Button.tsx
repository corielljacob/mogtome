import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-moogle-purple to-moogle-purple-deep
      text-white
      hover:from-moogle-purple-deep hover:to-moogle-purple
      focus:ring-moogle-purple
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-gradient-to-r from-moogle-pink to-moogle-coral
      text-white
      hover:from-moogle-coral hover:to-moogle-pink
      focus:ring-moogle-pink
      shadow-md hover:shadow-lg
    `,
    ghost: `
      bg-transparent
      text-moogle-purple-deep
      hover:bg-moogle-lavender/50
      focus:ring-moogle-lavender
    `,
    danger: `
      bg-gradient-to-r from-red-400 to-red-500
      text-white
      hover:from-red-500 hover:to-red-600
      focus:ring-red-400
      shadow-md hover:shadow-lg
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
