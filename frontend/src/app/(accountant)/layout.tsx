'use client';

import React from 'react';
import { useAccountantSession } from '@/hooks/auth/useAccountantSession';
import { LoadingScreen } from '@/components/shared/feedback/LoadingScreen';
import { AccountantLayout } from '@/components/layouts/AccountantLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAccountantSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return <AccountantLayout>{children}</AccountantLayout>;
}
