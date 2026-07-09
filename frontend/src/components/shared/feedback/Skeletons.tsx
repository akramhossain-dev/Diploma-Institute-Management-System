import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="flex items-center justify-between border-b pb-4">
        <Skeleton className="h-8 w-1/4 rounded-md" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="flex border-b bg-muted/20 p-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 mx-2" />
          ))}
        </div>
        <div className="divide-y p-2">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex py-4">
              {Array.from({ length: cols }).map((_, c) => (
                <Skeleton key={c} className="h-4 flex-1 mx-2" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-6 bg-card space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
      {/* 2 large content cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-xl p-6 bg-card h-80 space-y-4">
          <Skeleton className="h-5 w-1/3 border-b pb-3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="border rounded-xl p-6 bg-card h-80 space-y-4">
          <Skeleton className="h-5 w-1/3 border-b pb-3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
