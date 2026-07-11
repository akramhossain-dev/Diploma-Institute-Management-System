'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useAssignedCourses, useCourseStudents } from '@/hooks/teacher/useAssignedCourses';
import { Course } from '@/types/admin/course.types';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherCoursesPage() {
  const { data: courses = [], isLoading } = useAssignedCourses();
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);

  const handleOpenStudents = (course: Course) => {
    setSelectedCourse(course);
    setIsStudentsOpen(true);
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Assigned Syllabus Courses"
        description="Verify assigned syllabus programs, examine student directories list, and start attendance marking."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in-50 duration-300">
          {courses.map((course) => (
            <Card key={course._id} className="border shadow-xs hover:shadow-md transition-shadow">
              <CardHeader className="bg-muted/30 border-b pb-3">
                <CardTitle className="text-sm font-bold text-primary tracking-wide">
                  {course.code}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="font-extrabold text-sm text-foreground block">{course.name}</span>
                  <span className="text-muted-foreground block font-semibold">{course.departmentName || 'Computer Technology'}</span>
                </div>

                <div className="flex justify-between border-t pt-2 text-muted-foreground font-semibold">
                  <span>Credits: {course.credits}</span>
                  <span className="capitalize">{course.type} Only</span>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" className="w-full text-[10px]" size="sm" onClick={() => handleOpenStudents(course)}>
                    View Students
                  </Button>
                  <Link href="/teacher/attendance" className="w-full">
                    <Button className="w-full text-[10px] font-bold" size="sm">
                      Mark Attendance
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {}
      {selectedCourse && (
        <StudentListDialog
          course={selectedCourse}
          isOpen={isStudentsOpen}
          onClose={() => setIsStudentsOpen(false)}
        />
      )}
    </PageContainer>
  );
}

interface StudentListDialogProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

function StudentListDialog({ course, isOpen, onClose }: StudentListDialogProps) {
  const { data: students = [], isLoading } = useCourseStudents(course._id);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Enrolled Students - {course.name}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto pt-2">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((stu) => (
                  <TableRow key={stu._id}>
                    <TableCell className="font-bold text-primary text-xs">{stu.studentId}</TableCell>
                    <TableCell className="font-bold text-xs">{stu.fullName}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{stu.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center text-xs text-muted-foreground py-8">
              No students enrolled in this course syllabus.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
