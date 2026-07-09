'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { publicNavigation } from '@/constants/navigation/public-navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LucideIcon } from '../shared/navigation/LucideIcon';

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-200',
        scrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-border shadow-[0_1px_8px_rgba(0,0,0,0.06)]'
          : 'bg-white border-b border-border/60'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D4ED8] shadow-[0_0_12px_rgba(29,78,216,0.25)] transition-shadow group-hover:shadow-[0_0_16px_rgba(29,78,216,0.4)]">
            <span className="text-[11px] font-black text-white tracking-tight">D</span>
          </div>
          <div>
            <div className="text-[16px] font-bold text-foreground tracking-tight leading-none">DIMS</div>
            <div className="text-[9px] text-muted-foreground leading-none hidden sm:block">Institute ERP Portal</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {publicNavigation.map((item) => {
            const isActive = pathname === item.route;
            return (
              <Link
                key={item.route}
                href={item.route}
                className={cn(
                  'text-[13.5px] font-medium transition-colors relative py-1',
                  'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-200',
                  isActive
                    ? 'text-[#1D4ED8] after:w-full after:bg-[#1D4ED8]'
                    : 'text-[#334155] hover:text-[#1D4ED8] after:w-0 hover:after:w-full after:bg-[#1D4ED8]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/admission">
            <Button variant="outline" size="sm" className="font-semibold">
              Apply Now
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm" className="font-semibold">
              Portal Login
            </Button>
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/login">
            <Button size="sm" className="h-8 text-xs font-semibold">Login</Button>
          </Link>
          <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(!mobileOpen)}>
            <LucideIcon name={mobileOpen ? 'X' : 'Menu'} size={18} />
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-1 animate-fade-in-up">
          {publicNavigation.map((item) => {
            const isActive = pathname === item.route;
            return (
              <Link
                key={item.route}
                href={item.route}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center text-sm font-medium py-2.5 px-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-[#DBEAFE] text-[#1D4ED8]'
                    : 'text-[#334155] hover:bg-[#F1F5F9] hover:text-[#1D4ED8]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-border mt-2">
            <Link href="/admission" onClick={() => setMobileOpen(false)}>
              <Button className="w-full justify-center font-semibold" size="sm">
                Apply for Admission
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
export default PublicNavbar;
