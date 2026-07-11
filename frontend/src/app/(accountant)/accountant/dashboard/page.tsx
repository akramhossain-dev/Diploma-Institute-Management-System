'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { MetricCard } from '@/components/shared/finance/MetricCard';
import { useAccountantDashboard } from '@/hooks/accountant/useAccountantDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { AmountDisplay } from '@/components/shared/finance/AmountDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AccountantDashboardPage() {
  const { data: dashboard, isLoading, isError } = useAccountantDashboard();

  if (isLoading) {
    return (
      <PageContainer>
        <SectionHeader title="Financial Summary Workspace" description="Loading desk..." />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </PageContainer>
    );
  }

  if (isError || !dashboard) {
    return (
      <PageContainer>
        <SectionHeader title="Financial Summary Workspace" description="Welcome back." />
        <div className="text-center py-12 text-sm text-destructive border rounded-lg bg-card font-bold">
          Failed to load finance workdesk metrics. Please try again.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Financial Workspace Dashboard"
        description="Verify daily cash receipt logs, compile outstanding invoice collections status, and record transaction entries."
        action={
          <Link href="/accountant/payments">
            <Button size="sm">Record Payment Receipt</Button>
          </Link>
        }
      />

      {}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8 animate-in fade-in-50 duration-300">
        <MetricCard
          title="Daily Counters collected"
          value={<AmountDisplay amount={dashboard.todayCollection} />}
          description="counter collection cash today"
          icon={<LucideIcon name="DollarSign" size={18} />}
          trend={{ value: 'On Track', type: 'positive' }}
        />
        <MetricCard
          title="Total Outstanding Receivables"
          value={<AmountDisplay amount={dashboard.totalPendingDues} />}
          description="outstanding invoice dues"
          icon={<LucideIcon name="CreditCard" size={18} />}
          trend={{ value: 'Alert', type: 'negative' }}
        />
        <MetricCard
          title="Monthly Completed Payments"
          value={dashboard.paymentCountThisMonth}
          description="transaction receipts recorded"
          icon={<LucideIcon name="CheckCircle" size={18} />}
          trend={{ value: 'Normal', type: 'neutral' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent payments table */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <LucideIcon name="Activity" size={16} className="text-primary" />
                Recent Transaction Feeds
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {dashboard.recentTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Student Roll</TableHead>
                      <TableHead className="text-xs">Student Name</TableHead>
                      <TableHead className="text-xs">Fee structure item</TableHead>
                      <TableHead className="text-xs">Method</TableHead>
                      <TableHead className="text-xs text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboard.recentTransactions.map((trx) => (
                      <TableRow key={trx._id}>
                        <TableCell className="text-xs font-bold text-foreground">{trx.studentRoll}</TableCell>
                        <TableCell className="text-xs font-bold">{trx.studentName}</TableCell>
                        <TableCell className="text-xs font-semibold text-muted-foreground">{trx.feeTitle}</TableCell>
                        <TableCell className="text-xs capitalize font-semibold">{trx.paymentMethod.replace('_', ' ')}</TableCell>
                        <TableCell className="text-xs text-right font-bold text-emerald-600">
                          <AmountDisplay amount={trx.amount} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">No recent transactions recorded.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {}
        <div className="lg:col-span-1">
          <Card className="border shadow-md">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <LucideIcon name="Calendar" size={16} className="text-primary" />
                Latest Notices
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {dashboard.recentNotices.length > 0 ? (
                dashboard.recentNotices.map((not) => (
                  <div key={not._id} className="border rounded-md p-3 hover:bg-muted/30 transition-all">
                    <h4 className="text-xs font-bold text-foreground leading-normal">{not.title}</h4>
                    <span className="text-[9px] text-muted-foreground mt-1 block font-semibold">Published: {not.publishedDate}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">No announcement log files.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
