'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStudentResults } from '@/hooks/student/useStudentResults';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentResultsPage() {
  const { data: summaries = [], isLoading } = useStudentResults();

  return (
    <PageContainer>
      <SectionHeader
        title="My Semester Academic Results"
        description="Verify semester grades, check credit weights details, and view GPA averages."
      />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : summaries.length > 0 ? (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          {summaries.map((summary) => (
            <Card key={summary._id} className="border shadow-md bg-card">
              <CardHeader className="bg-muted/30 border-b pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-md font-bold text-foreground">
                    {summary.examName}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground font-semibold">Semester: {summary.semesterName}</span>
                </div>
                <div className="flex gap-2">
                  <Badge className="font-extrabold text-xs text-white" variant="default">
                    GPA: {summary.gpa.toFixed(2)}
                  </Badge>
                  <Badge
                    className="font-extrabold text-xs text-white capitalize"
                    variant={summary.status === 'pass' ? 'default' : 'destructive'}
                  >
                    {summary.status === 'pass' ? 'Passed' : 'Failed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead className="text-center">Marks</TableHead>
                      <TableHead className="text-center">Letter Grade</TableHead>
                      <TableHead className="text-center">Grade Point</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.details.map((course, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-bold text-primary text-xs">{course.courseCode}</TableCell>
                        <TableCell className="font-bold text-xs">{course.courseName}</TableCell>
                        <TableCell className="font-semibold text-xs text-muted-foreground">{course.credits}</TableCell>
                        <TableCell className="text-center font-bold text-xs">{course.obtainedMarks}</TableCell>
                        <TableCell className="text-center font-bold text-xs">
                          <Badge className="bg-primary/20 text-primary border border-primary/30 font-extrabold hover:bg-primary/20">
                            {course.letterGrade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-xs text-primary">{course.gradePoint.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <span className={`text-xs font-bold capitalize ${course.status === 'pass' ? 'text-emerald-600' : 'text-destructive'}`}>
                            {course.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-muted-foreground border rounded-lg bg-card">
          No published academic results sheets available for this session.
        </div>
      )}
    </PageContainer>
  );
}
