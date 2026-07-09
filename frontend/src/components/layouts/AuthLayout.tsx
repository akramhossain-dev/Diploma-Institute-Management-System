'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from '../shared/navigation/LucideIcon';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="aurora-hero min-h-screen flex flex-col items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1D4ED8] via-[#6366F1] to-[#06B6D4]" />

      <div className="w-full max-w-[420px] space-y-5 animate-fade-in-up">
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D4ED8] shadow-[0_0_20px_rgba(29,78,216,0.35)]">
              <span className="text-sm font-black text-white">D</span>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-foreground tracking-tight leading-none">DIMS</div>
              <div className="text-[10px] text-muted-foreground leading-none">Institute Portal</div>
            </div>
          </Link>
        </div>

        {/* Form Container */}
        <Card className="shadow-[0_8px_24px_rgba(29,78,216,0.08),0_2px_8px_rgba(0,0,0,0.04)] border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-center tracking-tight">{title}</CardTitle>
            <CardDescription className="text-center text-sm">{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <LucideIcon name="ArrowLeft" size={13} />
            Back to Portal Selection
          </Link>
        </div>
      </div>
    </div>
  );
}
export default AuthLayout;
