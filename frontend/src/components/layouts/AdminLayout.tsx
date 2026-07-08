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
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Entity Sidebar */}
      <Sidebar
        title="Admin Portal"
        items={adminNavigation}
        entityType="admin"
        profileName="Super Admin"
        profileRole="Administrator"
      />

      {/* Main View Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header panelTitle="DIMS Administration Panel" />
        
        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;
