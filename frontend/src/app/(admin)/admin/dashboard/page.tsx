'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { MetricCard } from '@/components/shared/finance/MetricCard';
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { Skeleton } from '@/components/ui/skeleton';
import { AmountDisplay } from '@/components/shared/finance/AmountDisplay';

export default function AdminDashboardPage() {
  const { data: summary, isLoading, isError } = useAdminDashboard();

  if (isLoading) {
    return (
      <PageContainer>
        <SectionHeader title="Admin Workspace Dashboard" description="Loading status..." />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !summary) {
    return (
      <PageContainer>
        <SectionHeader title="Admin Workspace Dashboard" description="Operational overview dashboard." />
        <div className="text-center py-12 text-sm text-destructive border rounded-lg bg-card font-bold">
          Failed to load operational summaries. Please try again.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Admin Workspace Dashboard"
        description="Consolidated overview of institute metrics, student registrations, outstanding accounts, and circular notice statuses."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Active Students"
          value={summary.totalStudents}
          description="registered in semesters"
          icon={<LucideIcon name="Users" size={18} />}
          trend={{ value: 'Stable', type: 'positive' }}
        />
        <MetricCard
          title="Total Faculty Staff"
          value={summary.totalTeachers}
          description="assigned course teachers"
          icon={<LucideIcon name="GraduationCap" size={18} />}
          trend={{ value: 'Full strength', type: 'neutral' }}
        />
        <MetricCard
          title="Academic Departments"
          value={summary.totalDepartments}
          description="active technologies"
          icon={<LucideIcon name="Building" size={18} />}
          trend={{ value: 'Online', type: 'positive' }}
        />
        <MetricCard
          title="New Admissions"
          value={summary.totalAdmissions}
          description="enrolled this session"
          icon={<LucideIcon name="UserPlus" size={18} />}
          trend={{ value: '+8%', type: 'positive' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Outstanding Dues"
          value={<AmountDisplay amount={summary.totalDues} />}
          description="unpaid invoices"
          icon={<LucideIcon name="CreditCard" size={18} />}
          trend={{ value: 'Defaulters Alert', type: 'negative' }}
        />
        <MetricCard
          title="Total Collected"
          value={<AmountDisplay amount={summary.totalCollections} />}
          description="cumulative receipts"
          icon={<LucideIcon name="DollarSign" size={18} />}
          trend={{ value: 'On track', type: 'positive' }}
        />
        <MetricCard
          title="Daily Attendance Snapshot"
          value={`${summary.attendanceOverview.presentRate}%`}
          description="average present rate"
          icon={<LucideIcon name="CheckCircle" size={18} />}
          trend={{ value: 'Good', type: 'positive' }}
        />
        <MetricCard
          title="Examinations Registry"
          value={summary.examOverview.publishedExams}
          description={`${summary.examOverview.draftExams} drafts config`}
          icon={<LucideIcon name="FileText" size={18} />}
          trend={{ value: 'Published', type: 'positive' }}
        />
      </div>

      {/* Main Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Admissions */}
        <Card className="border shadow-md">
          <CardHeader className="bg-muted/10 border-b pb-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
              <LucideIcon name="UserPlus" size={16} className="text-primary" />
              Recent Admissions Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Student Name</TableHead>
                  <TableHead className="text-xs">Technology Department</TableHead>
                  <TableHead className="text-xs">Admission Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.recentAdmissions.map((adm) => (
                  <TableRow key={adm._id}>
                    <TableCell className="text-xs font-bold text-foreground">{adm.studentName}</TableCell>
                    <TableCell className="text-xs font-semibold text-muted-foreground">{adm.departmentName}</TableCell>
                    <TableCell className="text-xs font-semibold text-muted-foreground">{adm.admissionDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Notices Board */}
        <Card className="border shadow-md">
          <CardHeader className="bg-muted/10 border-b pb-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
              <LucideIcon name="Calendar" size={16} className="text-primary" />
              Recent System Circular Notices
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {summary.recentNotices.map((not) => (
              <div key={not._id} className="border rounded-md p-3 hover:bg-muted/30 transition-all">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-bold text-foreground leading-relaxed">{not.title}</h4>
                  <span className="text-[9px] font-extrabold bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded-full capitalize">
                    {not.audience}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground block mt-1 font-semibold">Published: {not.publishedDate}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
