'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { DashboardCard } from '@/components/shared/layout/DashboardCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentAttendanceSummary, useStudentAttendanceHistory } from '@/hooks/student/useStudentAttendance';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentAttendancePage() {
  const { data: summary, isLoading: isSummaryLoading } = useStudentAttendanceSummary();
  const { data: history = [], isLoading: isHistoryLoading } = useStudentAttendanceHistory();

  return (
    <PageContainer>
      <SectionHeader
        title="My Attendance Profile"
        description="Monitor present/absent ratios, review monthly schedules logs, and track criteria margins."
      />

      {isSummaryLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8 animate-in fade-in-50 duration-300">
          <DashboardCard
            title="Total Session Classes"
            value={summary?.totalClasses.toString() || '0'}
            description="total class hours held"
            trend={{ value: 'Realtime', type: 'positive' }}
          />
          <DashboardCard
            title="Classes Attended"
            value={summary?.attendedClasses.toString() || '0'}
            description="verified present sessions"
            trend={{ value: 'Logged', type: 'positive' }}
          />
          <DashboardCard
            title="Classes Absent"
            value={summary?.absentClasses.toString() || '0'}
            description="unexcused absences"
            trend={{ value: 'Audit checks', type: 'negative' }}
          />
          <DashboardCard
            title="Present Ratio (%)"
            value={`${summary?.percentage || 0}%`}
            description="overall presence average"
            trend={{ value: 'Criteria 75%', type: 'neutral' }}
          />
        </div>
      )}

      {}
      <Card className="border shadow-xs bg-card max-w-4xl">
        <CardHeader className="border-b">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">
            Roster Log Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isHistoryLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead className="text-center">Roll Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-bold text-xs">{item.date}</TableCell>
                    <TableCell className="font-bold text-primary text-xs">{item.courseCode}</TableCell>
                    <TableCell className="font-semibold text-xs text-foreground">{item.courseName}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className="capitalize text-white font-bold w-20 text-center justify-center"
                        variant={item.status === 'present' ? 'default' : 'destructive'}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No attendance logs saved yet for this session.
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
