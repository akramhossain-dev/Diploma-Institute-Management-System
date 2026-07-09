'use client';

import React from 'react';
import { Sidebar } from '@/components/shared/navigation/Sidebar';
import { Header } from '@/components/shared/navigation/Header';
import { accountantNavigation } from '@/constants/navigation/accountant-navigation';

interface AccountantLayoutProps {
  children: React.ReactNode;
}

export function AccountantLayout({ children }: AccountantLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar
        title="Accounts Portal"
        items={accountantNavigation}
        entityType="accountant"
        profileName="Mr. Karim"
        profileRole="Senior Accountant"
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header panelTitle="Financial Management" />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export default AccountantLayout;
