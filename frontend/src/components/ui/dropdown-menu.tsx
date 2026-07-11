'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  children: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: () => setOpen(!open),
          });
        }

        if (child.type === DropdownMenuContent) {
          return React.cloneElement(child as React.ReactElement<any>, {
            open,
            setOpen,
          });
        }

        return child;
      })}
    </div>
  );
};

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <div onClick={onClick} className={cn('cursor-pointer inline-flex', className)}>
      {children}
    </div>
  );
};

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  align?: 'left' | 'right';
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  open,
  setOpen,
  align = 'right',
  className,
  ...props
}) => {
  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 w-56 rounded-md border bg-card p-1 text-card-foreground shadow-md animate-in fade-in-80 slide-in-from-top-1 duration-150',
        align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
        className
      )}
      {...props}
    >
      <div onClick={() => setOpen?.(false)} className="py-1">
        {children}
      </div>
    </div>
  );
};

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center rounded-xs px-3 py-1.5 text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = 'DropdownMenuItem';

interface DropdownMenuSeparatorProps {
  className?: string;
}

export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ className }) => {
  return <div className={cn('-mx-1 my-1 h-px bg-border', className)} />;
};

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)} {...props}>
      {children}
    </div>
  );
};
