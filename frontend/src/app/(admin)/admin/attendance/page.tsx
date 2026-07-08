'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { DashboardCard } from '@/components/shared/layout/DashboardCard';
import { DataTable } from '@/components/admin/DataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAttendanceSummary, useAttendanceReports } from '@/hooks/admin/useAttendanceReports';
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import { AttendanceReport } from '@/types/admin/attendance.types';

export default function AttendanceMonitoringPage() {
  const { data: summary, isLoading: isSummaryLoading } = useAttendanceSummary();
  const { data: reports = [], isLoading: isReportsLoading } = useAttendanceReports();
  const { data: departments = [] } = useAdminDepartments();

  const [deptFilter, setDeptFilter] = useState('');

  // Filter logs by department selection
  const filteredReports = React.useMemo(() => {
    return reports; // In simple mock reports, we return all or custom logic
  }, [reports, deptFilter]);

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'courseName', label: 'Subject Course' },
    { key: 'totalStudents', label: 'Total Enrolled' },
    { key: 'totalPresent', label: 'Present Students' },
    { key: 'totalAbsent', label: 'Absent Students' },
    {
      key: 'ratio',
      label: 'Ratio (%)',
      render: (row: AttendanceReport) => {
        const pct = ((row.totalPresent / row.totalStudents) * 100).toFixed(1);
        return <span className="font-bold text-primary">{pct}%</span>;
      },
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Attendance Monitoring Dashboard"
        description="Monitor institute classes attendance percentages, review audit logs, and scan technology averages."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
        <DashboardCard
          title="Total Lecture Classes Held"
          value={summary?.totalClasses.toString() || '0'}
          description="logged periods across all courses"
          trend={{ value: 'Realtime', type: 'positive' }}
        />
        <DashboardCard
          title="Average Attendance Percentage"
          value={`${summary?.attendancePercentage || 0}%`}
          description="present roll calls ratio"
          trend={{ value: 'Target 90%', type: 'neutral' }}
        />
        <DashboardCard
          title="Total Absent Logs"
          value={summary?.absentCount.toString() || '0'}
          description="missed roll entries"
          trend={{ value: 'Audited', type: 'negative' }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Department Ratios cards */}
        <div className="md:col-span-1 space-y-4">
          <Card className="border shadow-xs bg-card">
            <CardHeader className="border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">
                Technology Averages
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm">
              {summary?.departmentAverages.map((dept, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                  <span className="font-semibold text-muted-foreground truncate">{dept.departmentName}</span>
                  <span className="font-extrabold text-foreground">{dept.percentage}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Audit Log history table */}
        <div className="md:col-span-2">
          <Card className="border shadow-xs bg-card">
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">
                Attendance Audit Log Feed
              </CardTitle>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="flex h-7 rounded-md border bg-background px-2 text-[10px] focus-visible:outline-hidden"
              >
                <option value="">All Technologies</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.code}
                  </option>
                ))}
              </select>
            </CardHeader>
            <CardContent className="pt-6">
              <DataTable
                columns={columns}
                data={filteredReports}
                isLoading={isReportsLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
