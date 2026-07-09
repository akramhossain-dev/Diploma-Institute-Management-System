import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'soft-primary';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors select-none',
        // Default — primary
        variant === 'default' && 'bg-primary text-primary-foreground',
        // Soft primary
        variant === 'soft-primary' && 'bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]',
        // Secondary — muted
        variant === 'secondary' && 'bg-muted text-muted-foreground border border-border',
        // Destructive / error
        variant === 'destructive' && 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]',
        // Success
        variant === 'success' && 'bg-[#F0FDF4] text-[#16A34A] border border-[#86EFAC]',
        // Warning
        variant === 'warning' && 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]',
        // Info
        variant === 'info' && 'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]',
        // Outline
        variant === 'outline' && 'text-foreground border border-border bg-transparent',
        className
      )}
      {...props}
    />
  );
}

export { Badge };
