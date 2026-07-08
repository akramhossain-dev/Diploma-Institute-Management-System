'use client';

import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function StudentLoginPage() {
  return (
    <AuthLayout
      title="Student Portal Login"
      description="Enter credentials to check profiles, classes, grades, and fee balances."
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Student Email</label>
          <Input type="email" placeholder="student@dims.edu.bd" disabled />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Password</label>
          <Input type="password" placeholder="••••••••" disabled />
        </div>
        <Button className="w-full font-semibold bg-emerald-600 hover:bg-emerald-700 text-white" disabled>
          Sign In (F1 Placeholder)
        </Button>
      </div>
    </AuthLayout>
  );
}
