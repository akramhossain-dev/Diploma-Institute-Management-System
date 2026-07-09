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
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Sidebar
        title="Student Portal"
        items={studentNavigation}
        entityType="student"
        profileName="Akram Hossain"
        profileRole="Roll: CST-24-001"
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header panelTitle="Student Portal" />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export default StudentLayout;
