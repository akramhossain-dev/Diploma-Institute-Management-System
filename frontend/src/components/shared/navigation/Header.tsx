'use client';

import React from 'react';
import { useUiStore } from '@/store/ui/uiStore';
import { Button } from '@/components/ui/button';
import { LucideIcon } from './LucideIcon';

interface HeaderProps {
  panelTitle: string;
}

export function Header({ panelTitle }: HeaderProps) {
  const toggleMobileMenu = useUiStore((state) => state.toggleMobileMenu);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card px-4 text-card-foreground shadow-xs">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleMobileMenu}
        >
          <LucideIcon name="Menu" size={20} />
        </Button>

        {/* Desktop menu toggle (only shown when sidebar is collapsed) */}
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={toggleSidebar}
          >
            <LucideIcon name="ChevronsRight" size={18} />
          </Button>
        )}

        <span className="text-md font-semibold text-foreground md:text-lg">
          {panelTitle}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {/* Global Notifications Mock */}
        <Button variant="ghost" size="icon">
          <LucideIcon name="Bell" size={18} />
        </Button>

        {/* Global Help Mock */}
        <Button variant="ghost" size="icon">
          <LucideIcon name="HelpCircle" size={18} />
        </Button>
      </div>
    </header>
  );
}
export default Header;
