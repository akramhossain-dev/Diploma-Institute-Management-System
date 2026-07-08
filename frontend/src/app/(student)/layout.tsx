'use client';

import React from 'react';
import { useStudentSession } from '@/hooks/auth/useStudentSession';
import { LoadingScreen } from '@/components/shared/feedback/LoadingScreen';
import { StudentLayout } from '@/components/layouts/StudentLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useStudentSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return <StudentLayout>{children}</StudentLayout>;
}
