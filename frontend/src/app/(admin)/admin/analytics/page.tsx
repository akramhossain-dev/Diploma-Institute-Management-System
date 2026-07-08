'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useAdminAnalytics } from '@/hooks/admin/useAdminDashboard';
import { ChartCard, SvgLineChart, SvgBarChart } from '@/components/shared/charts/SvgCharts';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading, isError } = useAdminAnalytics();

  if (isLoading) {
    return (
      <PageContainer>
        <SectionHeader title="Institute Analytics Dashboard" description="Analyzing trends..." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !analytics) {
    return (
      <PageContainer>
        <SectionHeader title="Institute Analytics Dashboard" description="Operational charts." />
        <div className="text-center py-12 text-sm text-destructive border rounded-lg bg-card font-bold">
          Failed to load analytics trends. Please try again.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Institute Analytics Dashboard"
        description="Visual trend tracking for student growth registers, fee collections, attendances, and semester GPA performance metrics."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Growth */}
        <ChartCard title="Student Enrollment Growth (Current Year)">
          <SvgLineChart data={analytics.studentGrowth} color="#3b82f6" />
        </ChartCard>

        {/* Collections */}
        <ChartCard title="Monthly Fees Collection Stream (BDT)">
          <SvgBarChart data={analytics.feeCollection} color="#10b981" />
        </ChartCard>

        {/* Attendance trend */}
        <ChartCard title="Weekly Student Attendance Performance Trend (%)">
          <SvgLineChart data={analytics.attendanceTrend} color="#f59e0b" />
        </ChartCard>

        {/* Result performance benchmark */}
        <ChartCard title="GPA Average Benchmarks by Technology Department">
          <SvgBarChart data={analytics.resultPerformance} color="#8b5cf6" />
        </ChartCard>

        {/* Admission trend */}
        <ChartCard title="Yearly Admission Registrations History Trends">
          <SvgLineChart data={analytics.admissionTrend} color="#ec4899" />
        </ChartCard>
      </div>
    </PageContainer>
  );
}
