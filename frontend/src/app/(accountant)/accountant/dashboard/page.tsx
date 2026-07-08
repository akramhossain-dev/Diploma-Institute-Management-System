import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { DashboardCard } from '@/components/shared/layout/DashboardCard';
import { Button } from '@/components/ui/button';

export default function AccountantDashboardPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Financial Overview"
        description="Daily collection statistics, unpaid invoices, and payment registries."
        action={<Button size="sm">Record Payment</Button>}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Daily Collection"
          value="৳12,500"
          description="collected today"
          trend={{ value: '+15%', type: 'positive' }}
        />
        <DashboardCard
          title="Monthly Total"
          value="৳340,000"
          description="cumulative collection"
          trend={{ value: 'On track', type: 'positive' }}
        />
        <DashboardCard
          title="Defaulters List"
          value="18"
          description="students with pending invoices"
          trend={{ value: 'Alert', type: 'negative' }}
        />
        <DashboardCard
          title="Unprocessed Waivers"
          value="4"
          description="requests awaiting approval"
          trend={{ value: 'Pending', type: 'neutral' }}
        />
      </div>

      <div className="mt-8 border border-dashed rounded-lg p-12 text-center text-muted-foreground bg-card">
        Daily collection registries, invoice history diagrams, and ledger summaries will be displayed here in Phase F2.
      </div>
    </PageContainer>
  );
}
