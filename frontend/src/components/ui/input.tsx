import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative w-full">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground',
              'shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              startIcon && 'pl-9',
              endIcon && 'pr-9',
              className
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
