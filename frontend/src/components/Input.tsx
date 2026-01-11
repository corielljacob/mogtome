import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, className = '', ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-semibold">{label}</span>
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary opacity-70">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`input input-bordered w-full ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className}`}
            {...props}
          />
        </div>
        {(error || helper) && (
          <label className="label">
            {error ? (
              <span className="label-text-alt text-error flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </span>
            ) : (
              <span className="label-text-alt text-base-content/60">{helper}</span>
            )}
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
