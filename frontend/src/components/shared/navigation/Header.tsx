'use client';

import React from 'react';
import { useUiStore } from '@/store/ui/uiStore';
import { Button } from '@/components/ui/button';
import { LucideIcon } from './LucideIcon';

interface HeaderProps {
  panelTitle: string;
  breadcrumb?: React.ReactNode;
}

export function Header({ panelTitle, breadcrumb }: HeaderProps) {
  const toggleMobileMenu = useUiStore((state) => state.toggleMobileMenu);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm px-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden text-muted-foreground"
          onClick={toggleMobileMenu}
        >
          <LucideIcon name="Menu" size={18} />
        </Button>

        {/* Desktop sidebar toggle (shown only when sidebar is closed) */}
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden lg:flex text-muted-foreground"
            onClick={toggleSidebar}
          >
            <LucideIcon name="PanelLeft" size={18} />
          </Button>
        )}

        {/* Title + optional breadcrumb */}
        <div className="flex flex-col">
          {breadcrumb && (
            <span className="text-[10px] text-muted-foreground leading-none mb-0.5">{breadcrumb}</span>
          )}
          <span className="text-[14px] font-semibold text-foreground tracking-tight">
            {panelTitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Notification bell */}
        <Button variant="ghost" size="icon-sm" className="relative text-muted-foreground hover:text-foreground">
          <LucideIcon name="Bell" size={17} />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#1D4ED8]" />
        </Button>

        {/* Help */}
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
          <LucideIcon name="CircleHelp" size={17} />
        </Button>
      </div>
    </header>
  );
}
export default Header;
