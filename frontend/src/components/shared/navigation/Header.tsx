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
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3">
        {}
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden text-[#94A3B8] hover:text-[#334155] hover:bg-[#F1F5F9]"
          onClick={toggleMobileMenu}
        >
          <LucideIcon name="Menu" size={18} />
        </Button>

        {}
        {!sidebarOpen && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden lg:flex text-[#94A3B8] hover:text-[#334155] hover:bg-[#F1F5F9]"
            onClick={toggleSidebar}
          >
            <LucideIcon name="PanelLeft" size={18} />
          </Button>
        )}

        {}
        <div className="flex flex-col">
          {breadcrumb && (
            <span className="text-[10px] text-[#94A3B8] leading-none mb-0.5">{breadcrumb}</span>
          )}
          <span className="text-[14px] font-semibold text-[#0F172A] tracking-tight">
            {panelTitle}
          </span>
        </div>
      </div>

      {}
      <div className="flex items-center gap-1.5">
        {}
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-[#94A3B8] hover:text-[#334155] hover:bg-[#F1F5F9]"
        >
          <LucideIcon name="Bell" size={17} />
          {}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#1D4ED8] ring-2 ring-white" />
        </Button>

        {}
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-[#94A3B8] hover:text-[#334155] hover:bg-[#F1F5F9]"
        >
          <LucideIcon name="CircleHelp" size={17} />
        </Button>
      </div>
    </header>
  );
}
export default Header;
