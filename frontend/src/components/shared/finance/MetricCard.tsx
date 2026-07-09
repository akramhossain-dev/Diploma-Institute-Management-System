import React from 'react';
import { cn } from '@/lib/utils';

export function TrendBadge({
  value,
  type,
}: {
  value: string | number;
  type: 'positive' | 'negative' | 'neutral';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        type === 'positive' && 'bg-[#F0FDF4] text-[#16A34A]',
        type === 'negative' && 'bg-[#FEF2F2] text-[#DC2626]',
        type === 'neutral' && 'bg-muted text-muted-foreground',
      )}
    >
      {type === 'positive' && '↑'}
      {type === 'negative' && '↓'}
      {value}
    </span>
  );
}

interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    type: 'positive' | 'negative' | 'neutral';
  };
  accentColor?: 'primary' | 'emerald' | 'amber' | 'rose' | 'sky';
  className?: string;
}

const accentMap: Record<string, { stripe: string; icon: string; iconBg: string }> = {
  primary: { stripe: 'bg-[#1D4ED8]', icon: 'text-[#1D4ED8]', iconBg: 'bg-[#DBEAFE]' },
  emerald: { stripe: 'bg-[#10B981]', icon: 'text-[#059669]', iconBg: 'bg-[#D1FAE5]' },
  amber:   { stripe: 'bg-[#F59E0B]', icon: 'text-[#D97706]', iconBg: 'bg-[#FEF3C7]' },
  rose:    { stripe: 'bg-[#DC2626]', icon: 'text-[#B91C1C]', iconBg: 'bg-[#FEE2E2]' },
  sky:     { stripe: 'bg-[#0EA5E9]', icon: 'text-[#0284C7]', iconBg: 'bg-[#E0F2FE]' },
};

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  accentColor = 'primary',
  className,
}: MetricCardProps) {
  const accent = accentMap[accentColor] || accentMap.primary;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card',
        'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.04)]',
        'hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_2px_4px_-2px_rgba(0,0,0,0.05)]',
        'transition-shadow duration-200',
        className
      )}
    >
      {/* Left accent stripe */}
      <div className={cn('absolute inset-y-0 left-0 w-1 rounded-l-xl', accent.stripe)} />

      <div className="pl-5 pr-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground truncate">
              {title}
            </p>
            <div className="text-[26px] font-bold text-foreground leading-tight">{value}</div>
          </div>
          {icon && (
            <div className={cn('shrink-0 rounded-xl p-2.5', accent.iconBg, accent.icon)}>
              {icon}
            </div>
          )}
        </div>
        {(description || trend) && (
          <div className="mt-3 flex items-center gap-2">
            {trend && <TrendBadge value={trend.value} type={trend.type} />}
            {description && (
              <span className="text-[12px] text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
