'use client';

import React from 'react';
import { Sidebar } from '@/components/shared/navigation/Sidebar';
import { Header } from '@/components/shared/navigation/Header';
import { adminNavigation } from '@/constants/navigation/admin-navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar
        title="Admin Portal"
        items={adminNavigation}
        entityType="admin"
        profileName="Super Admin"
        profileRole="Administrator"
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header panelTitle="Administration Panel" />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;
