'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUiStore } from '@/store/ui/uiStore';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/shared/ui.types';
import { LucideIcon } from './LucideIcon';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  title: string;
  items: NavItem[];
  entityType: 'admin' | 'student' | 'teacher' | 'accountant';
  profileName: string;
  profileRole: string;
}

export function Sidebar({ title, items, entityType, profileName, profileRole }: SidebarProps) {
  const pathname = usePathname();
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const theme = useUiStore((state) => state.theme);

  // Tracks open state for child items
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = !!expandedItems[item.label];
    
    // Check if child is active
    const isChildActive = hasChildren && item.children?.some(child => pathname.startsWith(child.route));
    const isActive = pathname === item.route || isChildActive;

    return (
      <div key={item.label} className={cn('space-y-1', depth > 0 && 'ml-4')}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleExpand(item.label)}
              className={cn(
                'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="flex items-center space-x-3">
                {item.icon && <LucideIcon name={item.icon} size={18} />}
                <span>{item.label}</span>
              </div>
              <LucideIcon
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                size={14}
                className="text-muted-foreground"
              />
            </button>
            {isExpanded && (
              <div className="mt-1 space-y-1 border-l pl-2 ml-4">
                {item.children?.map(child => renderNavItem(child, depth + 1))}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={item.route}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {item.icon && <LucideIcon name={item.icon} size={18} />}
            <span>{item.label}</span>
          </Link>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card border-r text-card-foreground">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-wider text-primary">DIMS</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {entityType.toUpperCase()}
          </span>
        </Link>
        <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={toggleSidebar}>
          <LucideIcon name="ChevronsLeft" size={18} />
        </Button>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.map((item) => renderNavItem(item))}
      </div>

      {/* Footer Profile / Utilities */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {profileName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate max-w-[120px]">{profileName}</span>
              <span className="text-xs text-muted-foreground">{profileRole}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <LucideIcon name={theme === 'light' ? 'Moon' : 'Sun'} size={18} />
          </Button>
        </div>
        <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" size="sm">
          <LucideIcon name="LogOut" size={16} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:hidden',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:block shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-r-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
export default Sidebar;
