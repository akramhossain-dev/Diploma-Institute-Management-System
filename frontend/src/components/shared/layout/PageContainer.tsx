import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-7xl px-6 py-8 sm:px-8',
        'animate-fade-in-up',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
