import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';

interface AuthLoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  label: string;
}

export function AuthLoadingButton({ isLoading, label, ...props }: AuthLoadingButtonProps) {
  return (
    <Button type="submit" className="w-full font-semibold" disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Authenticating...
        </span>
      ) : (
        label
      )}
    </Button>
  );
}
