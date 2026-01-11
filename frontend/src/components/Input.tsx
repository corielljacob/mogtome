import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

/**
 * Input - KUPO BIT Refined Input Component
 * Clean, modern input with subtle styling and focus states.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, rightElement, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1.5">
            <span className="font-inter text-sm font-medium text-[var(--bento-text)]">
              {label}
            </span>
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--bento-text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full
              px-4 py-2.5
              font-inter text-sm
              text-[var(--bento-text)]
              placeholder:text-[var(--bento-text-subtle)]
              bg-white dark:bg-slate-900
              border border-[var(--bento-border)]
              rounded-xl
              transition-all duration-200
              focus:outline-none
              focus:border-[var(--bento-primary)]
              focus:ring-2
              focus:ring-[var(--bento-primary)]/20
              hover:border-[var(--bento-text-muted)]
              disabled:opacity-50
              disabled:cursor-not-allowed
              disabled:bg-stone-100 dark:disabled:bg-slate-800
              ${icon ? 'pl-10' : ''}
              ${rightElement ? 'pr-10' : ''}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 font-inter text-xs text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 font-inter text-xs text-[var(--bento-text-subtle)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea - KUPO BIT Refined Textarea Component
 */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1.5">
            <span className="font-inter text-sm font-medium text-[var(--bento-text)]">
              {label}
            </span>
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full
            px-4 py-3
            font-inter text-sm
            text-[var(--bento-text)]
            placeholder:text-[var(--bento-text-subtle)]
            bg-white dark:bg-slate-900
            border border-[var(--bento-border)]
            rounded-xl
            transition-all duration-200
            focus:outline-none
            focus:border-[var(--bento-primary)]
            focus:ring-2
            focus:ring-[var(--bento-primary)]/20
            hover:border-[var(--bento-text-muted)]
            resize-none
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 font-inter text-xs text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 font-inter text-xs text-[var(--bento-text-subtle)]">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

/**
 * Select - KUPO BIT Refined Select Component
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1.5">
            <span className="font-inter text-sm font-medium text-[var(--bento-text)]">
              {label}
            </span>
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full
            px-4 py-2.5
            font-inter text-sm
            text-[var(--bento-text)]
            bg-white dark:bg-slate-900
            border border-[var(--bento-border)]
            rounded-xl
            transition-all duration-200
            focus:outline-none
            focus:border-[var(--bento-primary)]
            focus:ring-2
            focus:ring-[var(--bento-primary)]/20
            hover:border-[var(--bento-text-muted)]
            cursor-pointer
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 font-inter text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
