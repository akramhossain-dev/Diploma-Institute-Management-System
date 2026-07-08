'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { MetricCard } from '@/components/shared/finance/MetricCard';
import { useStudentDashboard } from '@/hooks/student/useStudentDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { AmountDisplay } from '@/components/shared/finance/AmountDisplay';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboardPage() {
  const { data: dashboard, isLoading, isError } = useStudentDashboard();

  if (isLoading) {
    return (
      <PageContainer>
        <SectionHeader title="Student Self Dashboard" description="Loading metrics..." />
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
        <SectionHeader title="Student Self Dashboard" description="Welcome back." />
        <div className="text-center py-12 text-sm text-destructive border rounded-lg bg-card font-bold">
          Failed to load student dashboard details. Please try again.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Student Portal Dashboard"
        description="Welcome back! Verify attendance indexes, outstanding dues, results records, and today's schedule calendar."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8 animate-in fade-in-50 duration-300">
        <MetricCard
          title="Attendance Rate"
          value={`${dashboard.attendanceRate}%`}
          description="average present logs"
          icon={<LucideIcon name="CheckCircle" size={18} />}
          trend={{ value: 'Good', type: 'positive' }}
        />
        <MetricCard
          title="Outstanding Due"
          value={<AmountDisplay amount={dashboard.totalDue} />}
          description="fees awaiting clearance"
          icon={<LucideIcon name="CreditCard" size={18} />}
          trend={{ value: dashboard.totalDue > 0 ? 'Pending Payment' : 'Paid', type: dashboard.totalDue > 0 ? 'negative' : 'positive' }}
        />
        <MetricCard
          title="Academic Grade GPA"
          value={dashboard.latestGpa.toFixed(2)}
          description="previous term average"
          icon={<LucideIcon name="Award" size={18} />}
          trend={{ value: dashboard.latestGpaStatus.toUpperCase(), type: dashboard.latestGpaStatus === 'pass' ? 'positive' : 'negative' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Classes Routines snapshot */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <LucideIcon name="BookOpen" size={16} className="text-primary" />
                Today's Lecture Routines
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {dashboard.nextClasses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Time Slot</TableHead>
                      <TableHead className="text-xs">Course Label</TableHead>
                      <TableHead className="text-xs">Location Room</TableHead>
                      <TableHead className="text-xs">Faculty Teacher</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboard.nextClasses.map((cls) => (
                      <TableRow key={cls._id}>
                        <TableCell className="text-xs font-bold text-primary">{cls.timeSlot}</TableCell>
                        <TableCell className="text-xs font-bold">
                          {cls.courseName} <span className="text-[10px] text-muted-foreground font-semibold">({cls.courseCode})</span>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-foreground">{cls.roomNo}</TableCell>
                        <TableCell className="text-xs font-semibold text-muted-foreground">{cls.teacherName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground">No lectures scheduled for today.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notices Board Widget */}
        <div className="lg:col-span-1">
          <Card className="border shadow-md">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <LucideIcon name="Calendar" size={16} className="text-primary" />
                Latest Bulletin Board
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
                <div className="text-center py-6 text-xs text-muted-foreground">No announcement logs found.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
