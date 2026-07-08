import React from 'react';

export function PageLoader() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading data, please wait...</p>
    </div>
  );
}
