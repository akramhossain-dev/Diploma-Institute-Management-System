'use client';

import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  return (
    <AuthLayout
      title="Admin Login"
      description="Enter credentials to access DIMS administrative settings."
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Admin Email</label>
          <Input type="email" placeholder="admin@dims.edu.bd" disabled />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Password</label>
          <Input type="password" placeholder="••••••••" disabled />
        </div>
        <Button className="w-full font-semibold" disabled>
          Sign In (F1 Placeholder)
        </Button>
      </div>
    </AuthLayout>
  );
}
