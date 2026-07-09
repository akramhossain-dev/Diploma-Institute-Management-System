import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';

interface ActionToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filterContent?: React.ReactNode;
  actionContent?: React.ReactNode;
}

export function ActionToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterContent,
  actionContent,
  className,
  ...props
}: ActionToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3',
        'shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-5',
        'sm:flex-row sm:items-center sm:justify-between',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
        {onSearchChange !== undefined && (
          <div className="relative w-full max-w-xs">
            <LucideIcon
              name="Search"
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 h-9 text-sm"
            />
          </div>
        )}
        {filterContent && (
          <div className="flex flex-wrap items-center gap-2">
            {filterContent}
          </div>
        )}
      </div>
      {actionContent && (
        <div className="flex items-center gap-2 shrink-0">
          {actionContent}
        </div>
      )}
    </div>
  );
}

export default ActionToolbar;
