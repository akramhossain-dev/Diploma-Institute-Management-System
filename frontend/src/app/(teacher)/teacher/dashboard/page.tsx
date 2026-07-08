'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { MetricCard } from '@/components/shared/finance/MetricCard';
import { useTeacherDashboard } from '@/hooks/teacher/useTeacherDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TeacherDashboardPage() {
  const { data: dashboard, isLoading, isError } = useTeacherDashboard();

  if (isLoading) {
    return (
      <PageContainer>
        <SectionHeader title="Faculty Workdesk" description="Loading workspace..." />
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
        <SectionHeader title="Faculty Workdesk" description="Welcome back." />
        <div className="text-center py-12 text-sm text-destructive border rounded-lg bg-card font-bold">
          Failed to load faculty portal summaries. Please try again.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Faculty Workdesk Dashboard"
        description="Monitor active course assignments schedules, check pending grading updates, record attendances, and check recent notices."
      />

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8 animate-in fade-in-50 duration-300">
        <MetricCard
          title="Assigned Catalog Courses"
          value={dashboard.assignedCoursesCount}
          description="theory and laboratory modules"
          icon={<LucideIcon name="BookOpen" size={18} />}
          trend={{ value: 'Curriculum', type: 'neutral' }}
        />
        <MetricCard
          title="Attendance Logs Required"
          value={dashboard.pendingAttendanceCount}
          description="sessions needing log validation"
          icon={<LucideIcon name="Clock" size={18} />}
          trend={{ value: 'Action Needed', type: 'negative' }}
        />
        <MetricCard
          title="Exams Marks Pending"
          value={dashboard.pendingMarksCount}
          description="grades entry sheets outstanding"
          icon={<LucideIcon name="Award" size={18} />}
          trend={{ value: 'Due Soon', type: 'negative' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lectures routines snapshot */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="bg-muted/10 border-b pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <LucideIcon name="Calendar" size={16} className="text-primary" />
                Today's Lecture Schedule
              </CardTitle>
              <Link href="/teacher/attendance">
                <Button size="sm">Record Attendance</Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-6">
              {dashboard.todayClasses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Time Schedule</TableHead>
                      <TableHead className="text-xs">Class Details</TableHead>
                      <TableHead className="text-xs">Location Room</TableHead>
                      <TableHead className="text-xs">Semester Batch</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboard.todayClasses.map((cls) => (
                      <TableRow key={cls._id}>
                        <TableCell className="text-xs font-bold text-primary">{cls.timeSlot}</TableCell>
                        <TableCell className="text-xs font-bold">
                          {cls.courseName} <span className="text-[10px] text-muted-foreground font-semibold">({cls.courseCode})</span>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-foreground">{cls.roomNo}</TableCell>
                        <TableCell className="text-xs font-semibold text-muted-foreground">
                          {cls.departmentName} • {cls.semesterName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-xs text-muted-foreground">No lectures mapped for today.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notices Board Widget */}
        <div className="lg:col-span-1">
          <Card className="border shadow-md">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                <LucideIcon name="MessageSquare" size={16} className="text-primary" />
                Latest Announcements
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
                <div className="text-center py-6 text-xs text-muted-foreground">No Announcement bulletins.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
