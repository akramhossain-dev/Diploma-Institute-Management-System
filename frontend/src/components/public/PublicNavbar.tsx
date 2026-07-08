'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { publicNavigation } from '@/constants/navigation/public-navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LucideIcon } from '../shared/navigation/LucideIcon';

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card text-card-foreground shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold tracking-wider text-primary">DIMS</span>
          <span className="hidden xs:inline text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            Institute Portal
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center space-x-6">
          {publicNavigation.map((item) => {
            const isActive = pathname === item.route;
            return (
              <Link
                key={item.route}
                href={item.route}
                className={cn(
                  'text-sm font-semibold transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/admission">
            <Button variant="outline" size="sm">
              Apply Now
            </Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Portal Login</Button>
          </Link>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <Link href="/login" className="xs:inline-block">
            <Button size="sm" className="h-8 text-xs">Login</Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            <LucideIcon name={mobileOpen ? 'X' : 'Menu'} size={20} />
          </Button>
        </div>
      </div>

      {/* Mobile nav links drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {publicNavigation.map((item) => {
              const isActive = pathname === item.route;
              return (
                <Link
                  key={item.route}
                  href={item.route}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'text-sm font-semibold py-2 px-3 rounded-md transition-colors',
                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-col gap-2 pt-2 border-t">
            <Link href="/admission" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full justify-center" size="sm">
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
