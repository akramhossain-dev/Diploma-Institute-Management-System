import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'soft';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'tracking-[-0.01em]',
          
          variant === 'default' && 'bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(29,78,216,0.25)] hover:bg-[#1E40AF] active:scale-[0.99]',
          variant === 'destructive' && 'bg-destructive text-destructive-foreground shadow-sm hover:bg-[#B91C1C] active:scale-[0.99]',
          variant === 'outline' && 'border border-[#E2E8F0] bg-white text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-muted hover:border-[#CBD5E1] active:scale-[0.99]',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-[#E2E8F0] active:scale-[0.99]',
          variant === 'ghost' && 'text-muted-foreground hover:bg-muted hover:text-foreground',
          variant === 'link' && 'text-primary underline-offset-4 hover:underline p-0 h-auto',
          variant === 'soft' && 'bg-primary-soft text-primary hover:bg-[#BFDBFE] active:scale-[0.99]',
          
          size === 'default' && 'h-10 px-4 py-2',
          size === 'sm' && 'h-8 px-3 py-1.5 text-xs rounded-md',
          size === 'lg' && 'h-11 px-6 py-2.5 text-base rounded-xl',
          size === 'icon' && 'h-9 w-9 rounded-lg',
          size === 'icon-sm' && 'h-7 w-7 rounded-md',
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <svg className="h-4 w-4 animate-spin text-current shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
