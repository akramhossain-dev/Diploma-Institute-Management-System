import React from 'react';
import { cn } from '@/lib/utils';

import { ArrowUp, ArrowDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    type: 'positive' | 'negative' | 'neutral';
  };
  accentColor?: 'primary' | 'emerald' | 'amber' | 'rose' | 'sky';
  className?: string;
}

const accentIconMap: Record<string, string> = {
  primary: 'bg-[#DBEAFE] text-[#1D4ED8]',
  emerald: 'bg-[#D1FAE5] text-[#059669]',
  amber:   'bg-[#FEF3C7] text-[#D97706]',
  rose:    'bg-[#FEE2E2] text-[#B91C1C]',
  sky:     'bg-[#E0F2FE] text-[#0284C7]',
};

export function DashboardCard({
  title,
  value,
  description,
  icon,
  trend,
  accentColor = 'primary',
  className,
}: DashboardCardProps) {
  const iconClass = accentIconMap[accentColor] || accentIconMap.primary;

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5',
        'shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07)]',
        'transition-shadow duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-muted-foreground truncate">{title}</p>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
        {icon && (
          <div className={cn('rounded-xl p-2.5 shrink-0', iconClass)}>
            {icon}
          </div>
        )}
      </div>
      {(description || trend) && (
        <div className="mt-3 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                trend.type === 'positive' && 'bg-[#F0FDF4] text-[#16A34A]',
                trend.type === 'negative' && 'bg-[#FEF2F2] text-[#DC2626]',
                trend.type === 'neutral' && 'bg-muted text-muted-foreground',
              )}
            >
              {trend.type === 'positive' && <ArrowUp size={11} className="stroke-[3]" />}
              {trend.type === 'negative' && <ArrowDown size={11} className="stroke-[3]" />}
              {trend.value}
            </span>
          )}
          {description && (
            <span className="text-[12px] text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
