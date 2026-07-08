'use client';

import React from 'react';
import { useTeacherSession } from '@/hooks/auth/useTeacherSession';
import { LoadingScreen } from '@/components/shared/feedback/LoadingScreen';
import { TeacherLayout } from '@/components/layouts/TeacherLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useTeacherSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return <TeacherLayout>{children}</TeacherLayout>;
}
