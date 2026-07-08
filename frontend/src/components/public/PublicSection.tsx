import React from 'react';
import { cn } from '@/lib/utils';

interface PublicSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  bg?: 'default' | 'muted' | 'primary';
}

export function PublicSection({ children, bg = 'default', className, ...props }: PublicSectionProps) {
  return (
    <section
      className={cn(
        'py-16 sm:py-20 border-b last:border-b-0',
        {
          'bg-background text-foreground': bg === 'default',
          'bg-muted/30 text-foreground': bg === 'muted',
          'bg-primary text-primary-foreground': bg === 'primary',
        },
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
export default PublicSection;
