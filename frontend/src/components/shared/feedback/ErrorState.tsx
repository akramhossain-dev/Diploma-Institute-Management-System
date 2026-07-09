import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-[#FCA5A5]/40 bg-[#FEF2F2] p-10 text-center',
        'animate-fade-in',
        className
      )}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#DC2626]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-7 w-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-[#991B1B] mb-1.5">{title}</h3>
      <p className="text-sm text-[#B91C1C]/80 max-w-xs leading-relaxed mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEE2E2]">
          Try Again
        </Button>
      )}
    </div>
  );
}
