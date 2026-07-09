import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending' | 'processing' | 'primary';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const derivedVariant = variant || getVariantFromStatus(status);

  const variantStyles: Record<BadgeVariant, string> = {
    success:    'bg-[#F0FDF4] text-[#16A34A] border border-[#86EFAC]',
    warning:    'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]',
    error:      'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]',
    info:       'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]',
    neutral:    'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]',
    pending:    'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]',
    processing: 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]',
    primary:    'bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]',
  };

  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-[#16A34A]',
    warning: 'bg-[#F59E0B]',
    error: 'bg-[#DC2626]',
    info: 'bg-[#0EA5E9]',
    neutral: 'bg-[#94A3B8]',
    pending: 'bg-[#F59E0B] animate-pulse',
    processing: 'bg-[#6366F1] animate-pulse',
    primary: 'bg-[#1D4ED8]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize select-none tracking-wide',
        variantStyles[derivedVariant],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[derivedVariant])} />
      {status}
    </span>
  );
}

function getVariantFromStatus(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (['completed', 'active', 'paid', 'success', 'approved', 'verified', 'published'].includes(s)) return 'success';
  if (['pending', 'draft', 'unpaid'].includes(s)) return 'pending';
  if (['processing', 'running', 'submitted'].includes(s)) return 'processing';
  if (['failed', 'error', 'inactive', 'deleted', 'overdue', 'rejected', 'cancelled'].includes(s)) return 'error';
  if (['warning', 'alert', 'partial'].includes(s)) return 'warning';
  if (['info', 'all', 'system', 'read'].includes(s)) return 'info';
  if (['enrolled', 'finalized'].includes(s)) return 'primary';
  return 'neutral';
}

export default StatusBadge;
