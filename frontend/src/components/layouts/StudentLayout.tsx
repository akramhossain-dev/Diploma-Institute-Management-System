'use client';

import React from 'react';
import { Sidebar } from '@/components/shared/navigation/Sidebar';
import { Header } from '@/components/shared/navigation/Header';
import { studentNavigation } from '@/constants/navigation/student-navigation';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Entity Sidebar */}
      <Sidebar
        title="Student Portal"
        items={studentNavigation}
        entityType="student"
        profileName="Akram Hossain"
        profileRole="Roll: CST-24-001"
      />

      {/* Main View Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header panelTitle="Student Portal Dashboard" />
        
        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
export default StudentLayout;
