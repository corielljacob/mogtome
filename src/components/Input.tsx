import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react';

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
 * Accessibility: Labels are properly associated with inputs via id/htmlFor.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, rightElement, className = '', id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint && !error ? `${inputId}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block mb-1.5">
            <span className="font-soft text-sm font-medium text-[var(--bento-text)]">
              {label}
            </span>
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--bento-text-muted)]" aria-hidden="true">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            className={`
              w-full
              px-4 py-2.5
              font-soft text-sm
              text-[var(--bento-text)]
              placeholder:text-[var(--bento-text-subtle)]
              bg-[var(--bento-bg)]/50
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
          <p id={errorId} className="mt-1.5 font-soft text-xs text-red-500" role="alert">{error}</p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 font-soft text-xs text-[var(--bento-text-subtle)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea - KUPO BIT Refined Textarea Component
 * Accessibility: Labels are properly associated with textareas via id/htmlFor.
 */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = providedId || generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint && !error ? `${textareaId}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block mb-1.5">
            <span className="font-soft text-sm font-medium text-[var(--bento-text)]">
              {label}
            </span>
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={`
            w-full
            px-4 py-3
            font-soft text-sm
            text-[var(--bento-text)]
            placeholder:text-[var(--bento-text-subtle)]
            bg-[var(--bento-bg)]/50
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
          <p id={errorId} className="mt-1.5 font-soft text-xs text-red-500" role="alert">{error}</p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 font-soft text-xs text-[var(--bento-text-subtle)]">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

/**
 * Select - KUPO BIT Refined Select Component
 * Accessibility: Labels are properly associated with selects via id/htmlFor.
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const selectId = providedId || generatedId;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block mb-1.5">
            <span className="font-soft text-sm font-medium text-[var(--bento-text)]">
              {label}
            </span>
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          className={`
            w-full
            px-4 py-2.5
            font-soft text-sm
            text-[var(--bento-text)]
            bg-[var(--bento-bg)]/50
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
          <p id={errorId} className="mt-1.5 font-soft text-xs text-red-500" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
