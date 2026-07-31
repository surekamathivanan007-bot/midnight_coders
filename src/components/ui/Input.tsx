import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-[0.82rem] font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-11 rounded-xl border px-4 text-[0.9rem] transition-all duration-150',
              'bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
              leftIcon && 'pl-11',
              error
                ? 'border-red-400 dark:border-red-500/50'
                : 'border-gray-200 dark:border-white/[0.09] hover:border-gray-300 dark:hover:border-white/20',
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-[0.78rem] text-red-500 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-[0.78rem] text-gray-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-[0.82rem] font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-[0.9rem] transition-all duration-150 resize-y min-h-[100px]',
            'bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
            error
              ? 'border-red-400 dark:border-red-500/50'
              : 'border-gray-200 dark:border-white/[0.09] hover:border-gray-300 dark:hover:border-white/20',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-[0.78rem] text-red-500 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-[0.78rem] text-gray-400">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-[0.82rem] font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full h-11 rounded-xl border px-4 text-[0.9rem] transition-all duration-150',
            'bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
            error
              ? 'border-red-400 dark:border-red-500/50'
              : 'border-gray-200 dark:border-white/[0.09]',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-[0.78rem] text-red-500 font-medium">{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
