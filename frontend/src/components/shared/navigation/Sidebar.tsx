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

const entityAccentMap: Record<string, string> = {
  admin: 'bg-[#DC2626]/20 text-[#FCA5A5]',
  teacher: 'bg-[#6366F1]/20 text-[#A5B4FC]',
  student: 'bg-[#10B981]/20 text-[#6EE7B7]',
  accountant: 'bg-[#F59E0B]/20 text-[#FDE68A]',
};

export function Sidebar({ title, items, entityType, profileName, profileRole }: SidebarProps) {
  const pathname = usePathname();
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const theme = useUiStore((state) => state.theme);

  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = !!expandedItems[item.label];
    const isChildActive = hasChildren && item.children?.some(child => pathname.startsWith(child.route));
    const isActive = pathname === item.route || pathname.startsWith(item.route + '/') || isChildActive;

    return (
      <div key={item.label} className={cn('space-y-0.5', depth > 0 && 'ml-3')}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleExpand(item.label)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'text-white bg-white/10'
                  : 'text-[#94A3B8] hover:bg-white/6 hover:text-[#CBD5E1]'
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <LucideIcon name={item.icon} size={16} className={isActive ? 'text-white' : 'text-[#64748B]'} />
                )}
                <span className="text-[13px] tracking-[-0.01em]">{item.label}</span>
              </div>
              <LucideIcon
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                size={13}
                className="text-[#475569] shrink-0"
              />
            </button>
            {isExpanded && (
              <div className="mt-0.5 ml-4 pl-3 border-l border-white/8 space-y-0.5">
                {item.children?.map(child => renderNavItem(child, depth + 1))}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={item.route}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150',
              'border-l-2 border-transparent',
              isActive
                ? 'bg-white/10 text-white border-l-[#1D4ED8] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]'
                : 'text-[#94A3B8] hover:bg-white/6 hover:text-[#CBD5E1] hover:border-l-white/20'
            )}
          >
            {item.icon && (
              <LucideIcon
                name={item.icon}
                size={16}
                className={isActive ? 'text-[#93C5FD]' : 'text-[#475569]'}
              />
            )}
            <span className="tracking-[-0.01em]">{item.label}</span>
          </Link>
        )}
      </div>
    );
  };

  // Group items by section label (items without route are section dividers)
  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#0F172A] text-[#CBD5E1]">
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1D4ED8] shadow-[0_0_12px_rgba(29,78,216,0.4)]">
            <span className="text-[11px] font-black text-white tracking-tight">D</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-white tracking-tight leading-none">DIMS</span>
            <span className="text-[10px] text-[#475569] leading-none mt-0.5">Institute Portal</span>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden lg:flex text-[#475569] hover:text-[#CBD5E1] hover:bg-white/8"
          onClick={toggleSidebar}
        >
          <LucideIcon name="ChevronsLeft" size={16} />
        </Button>
      </div>

      {/* Entity Badge */}
      <div className="px-4 py-3 border-b border-white/8">
        <span className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
          entityAccentMap[entityType]
        )}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {entityType.toUpperCase()} PANEL
        </span>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10">
        {items.map((item) => renderNavItem(item))}
      </div>

      {/* Footer Profile + Utilities */}
      <div className="border-t border-white/8 p-3 space-y-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[#64748B] hover:bg-white/6 hover:text-[#CBD5E1] transition-all"
        >
          <LucideIcon name={theme === 'light' ? 'Moon' : 'Sun'} size={15} />
          <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>

        {/* Profile Block */}
        <div className="flex items-center gap-3 rounded-xl p-3 bg-white/5 border border-white/8">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1D4ED8]/80 text-white text-sm font-bold shadow-sm">
            {profileName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate leading-tight">{profileName}</p>
            <p className="text-[11px] text-[#64748B] truncate">{profileRole}</p>
          </div>
        </div>

        {/* Logout */}
        <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[#64748B] hover:bg-[#DC2626]/10 hover:text-[#FCA5A5] transition-all">
          <LucideIcon name="LogOut" size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
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
          'hidden lg:block shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out overflow-hidden',
          sidebarOpen ? 'w-64' : 'w-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
export default Sidebar;
