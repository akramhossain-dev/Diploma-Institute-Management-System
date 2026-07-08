'use client';

import React from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTeacherExams } from '@/hooks/teacher/useTeacherExams';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherExamsPage() {
  const { data: duties = [], isLoading } = useTeacherExams();

  return (
    <PageContainer>
      <SectionHeader
        title="Assigned Exam Duties"
        description="Verify assigned exam courses mapping parameters, check full/pass marks settings, and enter student marks."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
          {duties.map((duty) => (
            <Card key={duty._id} className="border shadow-xs hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 border-b pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-primary tracking-wide">
                  {duty.examName}
                </CardTitle>
                <Badge
                  variant={duty.marksStatus === 'submitted' ? 'default' : 'secondary'}
                  className="capitalize text-white font-bold"
                >
                  {duty.marksStatus}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-foreground block">{duty.courseName}</span>
                  <span className="text-muted-foreground block font-semibold">Semester: {duty.semesterName}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t pt-2 text-muted-foreground font-semibold">
                  <span>Full Marks: {duty.fullMarks}</span>
                  <span>Pass Marks: {duty.passMarks}</span>
                </div>

                <div className="flex pt-2 border-t">
                  <Link href={`/teacher/marks?examId=${duty.examId}&courseId=${duty.courseId}&fullMarks=${duty.fullMarks}&passMarks=${duty.passMarks}`} className="w-full">
                    <Button className="w-full font-bold" size="sm">
                      {duty.marksStatus === 'submitted' ? 'Update Marks Sheet' : 'Enter Student Marks'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
