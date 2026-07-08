'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { DashboardCard } from '@/components/shared/layout/DashboardCard';
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import { useAdminCourses } from '@/hooks/admin/useAdminCourses';
import { useAdminSemesters } from '@/hooks/admin/useAdminSemesters';
import { useAdminSessions } from '@/hooks/admin/useAdminSessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';

export default function AdminDashboardPage() {
  const { data: departments = [] } = useAdminDepartments();
  const { data: courses = [] } = useAdminCourses();
  const { data: semesters = [] } = useAdminSemesters();
  const { data: sessions = [] } = useAdminSessions();

  return (
    <PageContainer>
      <SectionHeader
        title="Admin Workspace Overview"
        description="General statistics, academic master data indices, and administrative configurations."
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Departments/Technologies"
          value={departments.length.toString()}
          description="active academic technologies"
          trend={{ value: 'Active', type: 'positive' }}
        />
        <DashboardCard
          title="Total Catalog Courses"
          value={courses.length.toString()}
          description="assigned program modules"
          trend={{ value: 'Curriculum', type: 'neutral' }}
        />
        <DashboardCard
          title="Active Semesters"
          value={semesters.length.toString()}
          description="duration parameters"
          trend={{ value: 'Calibrated', type: 'positive' }}
        />
        <DashboardCard
          title="Registered Sessions"
          value={sessions.length.toString()}
          description="academic calendars"
          trend={{ value: 'Configured', type: 'neutral' }}
        />
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="text-md font-bold flex items-center gap-2">
              <LucideIcon name="Settings" size={16} className="text-primary" />
              Administrative Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground leading-relaxed">
              Use the sidebar menu navigation links to edit departments, update semester calendars, declare academic sessions, and register curriculum courses.
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="text-md font-bold flex items-center gap-2">
              <LucideIcon name="Building" size={16} className="text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between items-center border-b pb-2">
              <span>Database Server:</span>
              <span className="text-emerald-500 font-bold">Online</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>Client Session:</span>
              <span className="text-emerald-500 font-bold">Admin Verified</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Semester:</span>
              <span className="font-semibold text-foreground">
                {semesters.find(s => s.status === 'active')?.name || 'Not Started'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
