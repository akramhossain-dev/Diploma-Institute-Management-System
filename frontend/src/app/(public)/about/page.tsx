import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';

export default function AboutPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="About DIMS"
        description="Learn more about the Diploma Institute Management System."
      />
      <div className="bg-card border p-6 rounded-lg shadow-xs space-y-4">
        <h2 className="text-xl font-bold">Platform Overview</h2>
        <p className="text-muted-foreground leading-relaxed">
          The Diploma Institute Management System (DIMS) is a comprehensive academic ERP designed to manage administrative workflows, faculty schedules, student portfolios, attendance cycles, and financial accounts.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Aligning with standard technical board curricula, DIMS provides structured entity workspaces for administrators, teachers, students, and accountants, enforcing strict route isolation and clean API consumption layers.
        </p>
      </div>
    </PageContainer>
  );
}
