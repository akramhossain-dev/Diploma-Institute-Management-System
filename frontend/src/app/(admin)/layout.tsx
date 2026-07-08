'use client';

import React from 'react';
import { useAdminSession } from '@/hooks/auth/useAdminSession';
import { LoadingScreen } from '@/components/shared/feedback/LoadingScreen';
import { AdminLayout } from '@/components/layouts/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
