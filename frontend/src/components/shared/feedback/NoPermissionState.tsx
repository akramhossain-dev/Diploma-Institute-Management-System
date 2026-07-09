import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';

interface NoPermissionStateProps {
  entityType?: 'admin' | 'student' | 'teacher' | 'accountant';
}

export function NoPermissionState({ entityType = 'admin' }: NoPermissionStateProps) {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-8 text-center animate-in fade-in-50 duration-300">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6 shadow-xs">
        <LucideIcon name="ShieldAlert" size={28} />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Access Denied</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
        You do not possess the required privileges to view this restricted module. If this is an error, please coordinate with your portal administrators.
      </p>
      <Link href={`/${entityType}/dashboard`}>
        <Button variant="default" className="shadow-md">
          <LucideIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}

export default NoPermissionState;
