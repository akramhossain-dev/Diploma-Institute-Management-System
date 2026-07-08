import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { DashboardCard } from '@/components/shared/layout/DashboardCard';

export default function StudentDashboardPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Student Dashboard"
        description="Welcome back! Here is a summary of your academic parameters."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Attendance Rate"
          value="92.4%"
          description="average across courses"
          trend={{ value: 'Good', type: 'positive' }}
        />
        <DashboardCard
          title="Current GPA"
          value="3.84"
          description="previous semester average"
          trend={{ value: '3.75 -> 3.84', type: 'positive' }}
        />
        <DashboardCard
          title="Enrolled Courses"
          value="6"
          description="active theory/lab courses"
        />
        <DashboardCard
          title="Due Invoices"
          value="৳0.00"
          description="accounts cleared"
          trend={{ value: 'Paid', type: 'positive' }}
        />
      </div>

      <div className="mt-8 border border-dashed rounded-lg p-12 text-center text-muted-foreground bg-card">
        Academic classes schedule, daily homework logs, and notification circular lists will be displayed here in Phase F2.
      </div>
    </PageContainer>
  );
}
