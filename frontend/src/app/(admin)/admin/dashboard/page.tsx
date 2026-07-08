import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { DashboardCard } from '@/components/shared/layout/DashboardCard';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Admin Overview"
        description="General statistics, user indices, and administrative configurations."
        action={<Button size="sm">Create New Account</Button>}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Students"
          value="1,248"
          description="enrolled active students"
          trend={{ value: '+4%', type: 'positive' }}
        />
        <DashboardCard
          title="Total Faculty"
          value="84"
          description="active teachers"
          trend={{ value: '+12%', type: 'positive' }}
        />
        <DashboardCard
          title="Outstanding Fees"
          value="৳45,200"
          description="pending collections"
          trend={{ value: '-8%', type: 'negative' }}
        />
        <DashboardCard
          title="Pending Admissions"
          value="34"
          description="new submissions"
          trend={{ value: 'New', type: 'neutral' }}
        />
      </div>

      <div className="mt-8 border border-dashed rounded-lg p-12 text-center text-muted-foreground bg-card">
        Dashboard charts, event streams, and activity audit logs will be displayed here in Phase F2.
      </div>
    </PageContainer>
  );
}
