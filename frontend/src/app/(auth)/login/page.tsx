'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useUiStore } from '@/store/ui/uiStore';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { Button } from '@/components/ui/button';

export default function PortalSelectorPage() {
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const theme = useUiStore((state) => state.theme);

  const portals = [
    {
      id: 'admin',
      title: 'Administrator Portal',
      description: 'Manage accounts, departments, courses, batch setups, and institute-wide controls.',
      route: '/login/admin',
      icon: 'ShieldAlert',
      color: 'text-rose-500 bg-rose-500/10',
    },
    {
      id: 'teacher',
      title: 'Faculty Portal',
      description: 'Mark student attendance, enter examination grading lists, and coordinate courses.',
      route: '/login/teacher',
      icon: 'GraduationCap',
      color: 'text-indigo-500 bg-indigo-500/10',
    },
    {
      id: 'student',
      title: 'Student Portal',
      description: 'View academic syllabus, check attendance levels, pull grades, and verify invoices.',
      route: '/login/student',
      icon: 'User',
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      id: 'accountant',
      title: 'Finance & Accounts',
      description: 'Process payments, run collection calculations, and manage default notices.',
      route: '/login/accountant',
      icon: 'Wallet',
      color: 'text-amber-500 bg-amber-500/10',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background transition-colors duration-300">
      {/* Utilities Header */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          <LucideIcon name={theme === 'light' ? 'Moon' : 'Sun'} size={18} />
        </Button>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="text-3xl font-extrabold tracking-wider text-primary">DIMS</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">Select your Workspace Portal</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Choose your corresponding entity department portal. Strict access logs are maintained.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {portals.map((portal) => (
            <Card key={portal.id} className="border hover:shadow-lg transition-all hover:-translate-y-0.5 group">
              <CardHeader className="flex flex-row items-start space-x-4">
                <div className={`p-3 rounded-lg ${portal.color} shrink-0`}>
                  <LucideIcon name={portal.icon} size={24} />
                </div>
                <div className="space-y-1">
                  <CardTitle className="group-hover:text-primary transition-colors">{portal.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">{portal.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex justify-end">
                <Link href={portal.route}>
                  <Button size="sm" variant="secondary" className="group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    Access Portal
                    <LucideIcon name="ChevronRight" size={14} className="ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
