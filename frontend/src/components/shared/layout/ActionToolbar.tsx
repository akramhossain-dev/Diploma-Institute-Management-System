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
        'flex flex-col gap-4 border rounded-xl p-4 bg-card/60 shadow-xs mb-6 sm:flex-row sm:items-center sm:justify-between transition-all backdrop-blur-md',
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {onSearchChange !== undefined && (
          <div className="relative w-full max-w-sm">
            <LucideIcon
              name="Search"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9 h-9 text-xs"
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
