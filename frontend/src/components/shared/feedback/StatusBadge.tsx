import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending' | 'processing';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  // Try to determine variant automatically if not provided
  const derivedVariant = variant || getVariantFromStatus(status);

  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    info: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    neutral: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse',
    processing: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 animate-pulse',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize transition-all select-none',
        variantStyles[derivedVariant],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function getVariantFromStatus(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (['completed', 'active', 'paid', 'success', 'read', 'approved'].includes(s)) return 'success';
  if (['pending', 'draft', 'unpaid'].includes(s)) return 'pending';
  if (['processing', 'running'].includes(s)) return 'processing';
  if (['failed', 'error', 'inactive', 'unread', 'deleted', 'overdue'].includes(s)) return 'error';
  if (['warning', 'alert'].includes(s)) return 'warning';
  if (['info', 'all', 'system'].includes(s)) return 'info';
  return 'neutral';
}

export default StatusBadge;
