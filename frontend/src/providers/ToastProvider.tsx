'use client';

import React from 'react';
import { useUiStore } from '@/store/ui/uiStore';
import { cn } from '@/lib/utils';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toasts = useUiStore((state) => state.toasts || []);
  const removeToast = useUiStore((state) => state.removeToast);

  // Fallback if toasts array is undefined in early store init
  const activeToasts = Array.isArray(toasts) ? toasts : [];

  return (
    <>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {activeToasts.map((toast: any) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-center justify-between p-4 rounded-md shadow-md border text-sm font-medium animate-in slide-in-from-bottom-2 fade-in duration-200 bg-card text-card-foreground',
              {
                'border-destructive bg-destructive/10 text-destructive': toast.type === 'error',
                'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': toast.type === 'success',
                'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400': toast.type === 'warning',
                'border-border bg-background': toast.type === 'info' || !toast.type,
              }
            )}
          >
            <div>{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 hover:opacity-70 focus:outline-hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
