import React from 'react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground animate-in fade-in duration-300">
      <div className="flex flex-col items-center space-y-4">
        {/* Loading Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <h2 className="text-xl font-bold tracking-tight">DIMS</h2>
        <p className="text-sm text-muted-foreground animate-pulse">Initializing application...</p>
      </div>
    </div>
  );
}
