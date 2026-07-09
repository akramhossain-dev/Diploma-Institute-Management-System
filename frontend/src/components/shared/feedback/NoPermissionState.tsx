import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';

interface NoPermissionStateProps {
  entityType?: 'admin' | 'student' | 'teacher' | 'accountant';
}

export function NoPermissionState({ entityType = 'admin' }: NoPermissionStateProps) {
  return (
    <div className="flex min-h-[440px] flex-col items-center justify-center rounded-xl border border-[#FCA5A5]/40 bg-[#FEF2F2] p-10 text-center animate-fade-in">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEE2E2] text-[#DC2626]">
        <LucideIcon name="ShieldAlert" size={26} />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">Access Restricted</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
        You do not have the required privileges to access this module. Contact your administrator if you believe this is an error.
      </p>
      <Link href={`/${entityType}/dashboard`}>
        <Button size="sm">
          <LucideIcon name="ArrowLeft" size={15} className="mr-1.5" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}

export default NoPermissionState;
