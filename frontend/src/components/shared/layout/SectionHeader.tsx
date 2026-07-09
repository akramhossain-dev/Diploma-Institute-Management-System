import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'info' | 'secondary' | 'soft-primary';
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  badge,
  badgeVariant = 'soft-primary',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-7',
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-[22px] font-bold tracking-tight text-foreground sm:text-2xl leading-snug">
            {title}
          </h1>
          {badge && (
            <Badge variant={badgeVariant} className="mt-0.5">{badge}</Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2.5 shrink-0">{action}</div>
      )}
    </div>
  );
}
