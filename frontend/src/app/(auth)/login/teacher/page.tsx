'use client';

import React from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TeacherLoginPage() {
  return (
    <AuthLayout
      title="Faculty Portal Login"
      description="Enter credentials to access class schedules and evaluate grading records."
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Teacher Email</label>
          <Input type="email" placeholder="faculty@dims.edu.bd" disabled />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-foreground">Password</label>
          <Input type="password" placeholder="••••••••" disabled />
        </div>
        <Button className="w-full font-semibold bg-indigo-600 hover:bg-indigo-700 text-white" disabled>
          Sign In (F1 Placeholder)
        </Button>
      </div>
    </AuthLayout>
  );
}
