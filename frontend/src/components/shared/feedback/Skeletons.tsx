import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Toolbar placeholder */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        {/* Table header */}
        <div className="flex border-b border-border bg-[#F8FAFC] px-4 py-3 gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 flex-1" />
          ))}
        </div>
        {/* Table rows */}
        <div className="divide-y divide-border/60">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex px-4 py-3.5 gap-4">
              {Array.from({ length: cols }).map((_, c) => (
                <Skeleton key={c} className="h-4 flex-1" style={{ opacity: 1 - c * 0.08 }} />
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
    <div className="space-y-7 animate-fade-in">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative rounded-xl border border-border bg-card overflow-hidden p-5 space-y-3">
            <div className="absolute inset-y-0 left-0 w-1 rounded-l-xl">
              <Skeleton className="h-full w-full" />
            </div>
            <Skeleton className="h-3.5 w-3/4 ml-1" />
            <Skeleton className="h-8 w-1/2 ml-1" />
            <Skeleton className="h-3 w-2/3 ml-1" />
          </div>
        ))}
      </div>
      {/* 2 large content cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[300, 260].map((h, i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden" style={{ height: h }}>
            <div className="border-b border-border px-6 py-4">
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, r) => (
                <Skeleton key={r} className="h-4 w-full" style={{ opacity: 1 - r * 0.12 }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
}
