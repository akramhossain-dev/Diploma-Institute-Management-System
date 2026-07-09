import * as React from 'react';
import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-[#E2E8F0] dark:bg-[#1E2D40]',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent',
        'before:animate-[shimmer_1.6s_ease-in-out_infinite]',
        'before:bg-[length:200%_100%]',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
