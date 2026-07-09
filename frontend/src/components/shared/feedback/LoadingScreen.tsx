import React from 'react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background animate-fade-in">
      <div className="flex flex-col items-center gap-5">
        {/* Logo mark */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1D4ED8] shadow-[0_0_24px_rgba(29,78,216,0.35)]">
          <span className="text-lg font-black text-white tracking-tight">D</span>
        </div>
        {/* Spinner */}
        <div className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-border border-t-[#1D4ED8]" />
        <p className="text-sm text-muted-foreground font-medium">Loading DIMS...</p>
      </div>
    </div>
  );
}
