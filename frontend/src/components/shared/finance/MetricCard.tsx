import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
        {
          'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400':
            type === 'positive',
          'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400':
            type === 'negative',
          'bg-muted text-muted-foreground': type === 'neutral',
        }
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
  className?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('overflow-hidden hover:shadow-md transition-all border shadow-xs bg-card', className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
            <div className="text-2xl font-extrabold text-foreground">{value}</div>
          </div>
          {icon && <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>}
        </div>
        {(description || trend) && (
          <div className="mt-4 flex items-center gap-2">
            {trend && <TrendBadge value={trend.value} type={trend.type} />}
            {description && <span className="text-xs text-muted-foreground font-semibold">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MetricCard;
