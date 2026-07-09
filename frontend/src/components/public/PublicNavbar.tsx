'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1D4ED8] shadow-[0_0_12px_rgba(29,78,216,0.25)] transition-shadow group-hover:shadow-[0_0_16px_rgba(29,78,216,0.4)]">
            <span className="text-[12px] font-black text-white tracking-tight">M</span>
          </div>
          <div>
            <div className="text-[17px] font-bold text-foreground tracking-tight leading-none">MRIST</div>
            <div className="text-[9px] text-muted-foreground leading-none hidden sm:block">Polytechnic Institute · BTEB Affiliated</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7" ref={dropdownRef}>
          {publicNavigation.map((item) => {
            const isActive = pathname === item.route || (item.children && item.children.some(c => pathname === c.route));
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className={cn(
                      'flex items-center gap-1 text-[13.5px] font-medium transition-colors relative py-1',
                      'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-200',
                      isActive
                        ? 'text-[#1D4ED8] after:w-full after:bg-[#1D4ED8]'
                        : 'text-[#334155] hover:text-[#1D4ED8] after:w-0 hover:after:w-full after:bg-[#1D4ED8]'
                    )}
                  >
                    {item.label}
                    <LucideIcon
                      name="ChevronDown"
                      size={13}
                      className={cn('transition-transform duration-200', openDropdown === item.label && 'rotate-180')}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg border border-border shadow-lg py-1 z-50 animate-fade-in-up">
                      {item.children!.map((child) => (
                        <Link
                          key={child.route}
                          href={child.route}
                          onClick={() => setOpenDropdown(null)}
                          className={cn(
                            'block px-4 py-2.5 text-sm font-medium transition-colors',
                            pathname === child.route
                              ? 'text-[#1D4ED8] bg-[#DBEAFE]/50'
                              : 'text-[#334155] hover:text-[#1D4ED8] hover:bg-[#F8FAFC]'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

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
              Student Portal
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
              <React.Fragment key={item.label}>
                <Link
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
                {item.children && item.children.map((child) => (
                  <Link
                    key={child.route}
                    href={child.route}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center text-sm font-medium py-2 px-6 rounded-lg transition-colors',
                      pathname === child.route
                        ? 'text-[#1D4ED8]'
                        : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1D4ED8]'
                    )}
                  >
                    ↳ {child.label}
                  </Link>
                ))}
              </React.Fragment>
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
