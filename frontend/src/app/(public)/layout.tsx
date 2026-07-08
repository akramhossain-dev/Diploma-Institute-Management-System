import React from 'react';
import { PublicLayout } from '@/components/layouts/PublicLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicLayout>{children}</PublicLayout>;
}
