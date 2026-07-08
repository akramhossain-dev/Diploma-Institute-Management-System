'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useCourses } from '@/hooks/public/useCourses';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/feedback/ErrorState';
import { Badge } from '@/components/ui/badge';

export default function PublicCoursesPage() {
  const { data: courses = [], isLoading, isError, refetch } = useCourses();

  return (
    <PageContainer>
      <SectionHeader
        title="Courses Syllabus"
        description="Public list of technology-based syllabus courses offered this semester."
      />

      {isLoading ? (
        <div className="border rounded-lg overflow-hidden bg-card">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-1/4" />
          </div>
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState message="Could not retrieve academic courses listing." onRetry={refetch} />
      ) : courses.length > 0 ? (
        <div className="bg-card border rounded-lg overflow-hidden shadow-xs animate-in fade-in-50 duration-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Credits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className="font-semibold text-primary">{course.code}</TableCell>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.departmentCode}</Badge>
                  </TableCell>
                  <TableCell>{course.semester} Semester</TableCell>
                  <TableCell className="capitalize">{course.type}</TableCell>
                  <TableCell className="text-right font-semibold">{course.credits}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">No syllabus courses found.</div>
      )}
    </PageContainer>
  );
}
