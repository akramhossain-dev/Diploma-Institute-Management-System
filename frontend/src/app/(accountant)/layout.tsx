import React from 'react';
import { AccountantLayout } from '@/components/layouts/AccountantLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AccountantLayout>{children}</AccountantLayout>;
}
