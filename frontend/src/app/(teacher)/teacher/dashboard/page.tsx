import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { DashboardCard } from '@/components/shared/layout/DashboardCard';
import { Button } from '@/components/ui/button';

export default function TeacherDashboardPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Faculty Overview"
        description="Monitor assigned classes, grade entry states, and attendance sessions."
        action={<Button size="sm">Record Today's Classes</Button>}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Assigned Courses"
          value="4"
          description="theory and laboratory modules"
        />
        <DashboardCard
          title="Students Taught"
          value="240"
          description="across all batches"
        />
        <DashboardCard
          title="Attendance Completed"
          value="18/20"
          description="sessions recorded this week"
          trend={{ value: '90%', type: 'positive' }}
        />
        <DashboardCard
          title="Grades Pending"
          value="2"
          description="exams awaiting marks entry"
          trend={{ value: 'Urgent', type: 'negative' }}
        />
      </div>

      <div className="mt-8 border border-dashed rounded-lg p-12 text-center text-muted-foreground bg-card">
        Daily class timetables, grading lists queues, and departmental circular notes will be displayed here in Phase F2.
      </div>
    </PageContainer>
  );
}
