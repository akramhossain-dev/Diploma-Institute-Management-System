import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from '../shared/navigation/LucideIcon';

interface AuthErrorMessageProps {
  message?: string | null;
  className?: string;
}

export function AuthErrorMessage({ message, className }: AuthErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1 duration-200',
        className
      )}
    >
      <LucideIcon name="AlertTriangle" size={16} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}
