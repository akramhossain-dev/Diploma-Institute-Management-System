'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAssignedCourses, useCourseStudents } from '@/hooks/teacher/useAssignedCourses';
import { useMarkAttendance } from '@/hooks/teacher/useMarkAttendance';
import { useUiStore } from '@/store/ui/uiStore';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function TeacherAttendancePage() {
  const addToast = useUiStore((state) => state.addToast);

  // Queries & Mutations
  const { data: courses = [], isLoading: isCoursesLoading } = useAssignedCourses();
  const markMutation = useMarkAttendance();

  // Selected filters state
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Load students for selected course
  const { data: students = [], isLoading: isStudentsLoading } = useCourseStudents(courseId);

  // Map to hold student attendance state: { [studentId]: 'present' | 'absent' }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'absent'>>({});

  // Trigger mapping initialization when students list changes
  React.useEffect(() => {
    if (students.length > 0) {
      const initialMap: Record<string, 'present' | 'absent'> = {};
      students.forEach((s) => {
        initialMap[s._id] = 'present'; // Default to present
      });
      setAttendanceMap(initialMap);
    } else {
      setAttendanceMap({});
    }
  }, [students]);

  const handleToggleStatus = (studentId: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleMarkAllPresent = () => {
    const updatedMap: Record<string, 'present' | 'absent'> = {};
    students.forEach((s) => {
      updatedMap[s._id] = 'present';
    });
    setAttendanceMap(updatedMap);
    addToast('Marked all students as present', 'success');
  };

  const handleFormSubmit = async () => {
    if (!courseId) {
      addToast('Please select a course syllabus.', 'error');
      return;
    }
    try {
      const records = Object.keys(attendanceMap).map((studentId) => ({
        studentId,
        status: attendanceMap[studentId],
      }));
      await markMutation.mutateAsync({
        courseId,
        date,
        records,
      });
      addToast('Attendance sheet submitted successfully', 'success');
    } catch (err) {
      addToast('Failed to record attendance sheet.', 'error');
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Roll Call Attendance Marking"
        description="Select assigned syllabus subject course, set calendar date, and check attendance roster."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Selection Parameter controls */}
        <div className="md:col-span-1 space-y-4">
          <Card className="border shadow-xs bg-card">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Select Course Subject</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-hidden"
                >
                  <option value="">Select course...</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Roster Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              {courseId && students.length > 0 && (
                <div className="pt-2 border-t space-y-2">
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleMarkAllPresent}>
                    Mark All Present
                  </Button>
                  <Button onClick={handleFormSubmit} size="sm" className="w-full text-xs font-bold" isLoading={markMutation.isPending}>
                    Submit Attendance Sheet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side Students Roster List table */}
        <div className="md:col-span-2">
          <Card className="border shadow-xs bg-card">
            <CardContent className="pt-6">
              {!courseId ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  Select a course from the parameters side panel to load student roster list.
                </div>
              ) : isStudentsLoading ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  Loading class roster list...
                </div>
              ) : students.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead className="text-center">Roll Call Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((stu) => {
                      const status = attendanceMap[stu._id] || 'present';
                      return (
                        <TableRow key={stu._id}>
                          <TableCell className="font-bold text-primary text-xs">{stu.studentId}</TableCell>
                          <TableCell className="font-bold text-xs">{stu.fullName}</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              onClick={() => handleToggleStatus(stu._id)}
                              className="cursor-pointer capitalize text-white font-bold w-20 text-center justify-center"
                              variant={status === 'present' ? 'default' : 'destructive'}
                            >
                              {status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  No students enrolled in this course segment.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
