import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PublicNoticesPage() {
  const notices = [
    {
      id: 1,
      title: 'Online Admission Application Deadline Extended',
      date: '2026-07-08',
      category: 'Admission',
      content: 'The deadline for submitting online admission applications for the upcoming 2026-2027 academic session has been extended to August 15th, 2026.',
    },
    {
      id: 2,
      title: 'Semester Final Examinations Schedule',
      date: '2026-07-01',
      category: 'Exams',
      content: 'The final examinations schedule for semesters 2, 4, 6, and 8 has been published and assigned. Students can check their portal profiles for exam dates.',
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Notice Board"
        description="Public circulars, general announcements, and notice updates."
      />
      <div className="space-y-6">
        {notices.map((notice) => (
          <Card key={notice.id} className="border shadow-xs">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-xl font-bold">{notice.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{notice.date}</Badge>
                <Badge variant="secondary">{notice.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">{notice.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
