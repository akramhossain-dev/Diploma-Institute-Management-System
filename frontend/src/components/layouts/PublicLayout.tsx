'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { publicNavigation } from '@/constants/navigation/public-navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-card shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-wider text-primary">DIMS</span>
            <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              Diploma IMS
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            {publicNavigation.map((item) => {
              const isActive = pathname === item.route;
              return (
                <Link
                  key={item.route}
                  href={item.route}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button size="sm">Portal Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Diploma Institute Management System. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/admission" className="hover:text-primary transition-colors">
              Admissions
            </Link>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default PublicLayout;
