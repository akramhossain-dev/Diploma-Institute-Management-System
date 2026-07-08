'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/store/ui/uiStore';
import { LucideIcon } from '../shared/navigation/LucideIcon';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const theme = useUiStore((state) => state.theme);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background transition-colors duration-300">
      {/* Utilities Header */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <LucideIcon name={theme === 'light' ? 'Moon' : 'Sun'} size={18} />
        </Button>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-wider text-primary">DIMS</span>
          </Link>
          <h2 className="text-xl font-semibold tracking-tight">Portal Authentication</h2>
        </div>

        {/* Form Container */}
        <Card className="border shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
            <CardDescription className="text-center">{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/login" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
            <LucideIcon name="ArrowLeft" size={14} />
            Back to Portal Selection
          </Link>
        </div>
      </div>
    </div>
  );
}
export default AuthLayout;
