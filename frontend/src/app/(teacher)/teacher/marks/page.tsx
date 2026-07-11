'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCourseStudents } from '@/hooks/teacher/useAssignedCourses';
import { useSubmitMarks } from '@/hooks/teacher/useTeacherMarks';
import { useUiStore } from '@/store/ui/uiStore';
import { Input } from '@/components/ui/input';

export default function TeacherMarksEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addToast = useUiStore((state) => state.addToast);

  const examId = searchParams.get('examId') || '';
  const courseId = searchParams.get('courseId') || '';
  const fullMarks = Number(searchParams.get('fullMarks') || 100);
  const passMarks = Number(searchParams.get('passMarks') || 40);

  const { data: students = [], isLoading } = useCourseStudents(courseId);
  const submitMutation = useSubmitMarks();

  const [marksMap, setMarksMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (students.length > 0) {
      const initialMap: Record<string, string> = {};
      students.forEach((s) => {
        initialMap[s._id] = '80'; 
      });
      setMarksMap(initialMap);
    }
  }, [students]);

  const handleMarkChange = (studentId: string, val: string) => {
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: val,
    }));
  };

  const handleFormSubmit = async () => {
    if (!examId || !courseId) {
      addToast('Exam and Course params must be mapped.', 'error');
      return;
    }

    // Validation checks
    let hasError = false;
    const records = Object.keys(marksMap).map((studentId) => {
      const obtainedMarks = Number(marksMap[studentId]);
      if (isNaN(obtainedMarks) || obtainedMarks < 0 || obtainedMarks > fullMarks) {
        hasError = true;
      }
      return {
        studentId,
        obtainedMarks,
        isAbsent: false,
      };
    });

    if (hasError) {
      addToast(`Obtained marks must be between 0 and Full Marks (${fullMarks})`, 'error');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        examId,
        courseId,
        records,
      });
      addToast('Marks sheet submitted to board registry successfully', 'success');
      router.push('/teacher/exams');
    } catch {
      addToast('Failed to submit marks ledger.', 'error');
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Student Marks Ledger Entry"
        description={`Enter marks for enrolled students. Parameter settings: Full Marks = ${fullMarks}, Pass Marks = ${passMarks}.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {}
        <div className="md:col-span-1 space-y-4">
          <Card className="border shadow-xs bg-card text-xs">
            <CardContent className="pt-6 space-y-3">
              <h4 className="font-bold border-b pb-1 text-primary uppercase">Parameters Summary</h4>
              <p><span className="font-semibold">Full Exam Marks:</span> {fullMarks}</p>
              <p><span className="font-semibold">Passing Threshold:</span> {passMarks}</p>
              <div className="pt-2 border-t">
                <Button onClick={handleFormSubmit} className="w-full font-bold" isLoading={submitMutation.isPending}>
                  Submit Marks Ledger
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ledger entry table */}
        <div className="md:col-span-2">
          <Card className="border shadow-xs bg-card">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="text-center py-8 text-sm text-muted-foreground">Loading student roster...</div>
              ) : students.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="w-32 text-center">Obtained Marks</TableHead>
                      <TableHead className="text-center">Pass Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((stu) => {
                      const val = marksMap[stu._id] || '';
                      const isPass = Number(val) >= passMarks;
                      return (
                        <TableRow key={stu._id}>
                          <TableCell className="font-bold text-primary text-xs">{stu.studentId}</TableCell>
                          <TableCell className="font-bold text-xs">{stu.fullName}</TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min={0}
                              max={fullMarks}
                              value={val}
                              onChange={(e) => handleMarkChange(stu._id, e.target.value)}
                              className="w-24 text-center font-bold"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`text-xs font-bold ${isPass ? 'text-emerald-600' : 'text-destructive'}`}>
                              {isPass ? 'Pass' : 'Fail'}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">No students enrolled.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
