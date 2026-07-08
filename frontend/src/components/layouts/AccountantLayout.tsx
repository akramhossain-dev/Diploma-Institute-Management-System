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
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Entity Sidebar */}
      <Sidebar
        title="Accounts Portal"
        items={accountantNavigation}
        entityType="accountant"
        profileName="Mr. Karim"
        profileRole="Senior Accountant"
      />

      {/* Main View Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header panelTitle="Financial Management Console" />
        
        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
export default AccountantLayout;
