'use client';

import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AccountantLoginPage() {
  return (
    <AuthLayout
      title="Finance Workspace Login"
      description="Enter credentials to manage ledgers and billing calculations."
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Accountant Email</label>
          <Input type="email" placeholder="accounts@dims.edu.bd" disabled />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Password</label>
          <Input type="password" placeholder="••••••••" disabled />
        </div>
        <Button className="w-full font-semibold bg-amber-600 hover:bg-amber-700 text-white" disabled>
          Sign In (F1 Placeholder)
        </Button>
      </div>
    </AuthLayout>
  );
}
