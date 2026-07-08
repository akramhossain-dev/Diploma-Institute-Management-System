'use client';

import React from 'react';
import { Sidebar } from '@/components/shared/navigation/Sidebar';
import { Header } from '@/components/shared/navigation/Header';
import { teacherNavigation } from '@/constants/navigation/teacher-navigation';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Entity Sidebar */}
      <Sidebar
        title="Teacher Portal"
        items={teacherNavigation}
        entityType="teacher"
        profileName="Dr. Rahman"
        profileRole="Head of CST"
      />

      {/* Main View Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header panelTitle="Faculty Panel Dashboard" />
        
        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
export default TeacherLayout;
