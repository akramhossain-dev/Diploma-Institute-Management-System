'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUiStore } from '@/store/ui/uiStore';
import { useExams } from '@/hooks/admin/useExams';
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import { useAdminSemesters } from '@/hooks/admin/useAdminSemesters';
import { useAdminCourses } from '@/hooks/admin/useAdminCourses';
import { useAdminTeachers } from '@/hooks/admin/useAdminTeachers';
import {
  useExamMappings,
  useCreateExamMapping,
  useUpdateExamMapping,
  useDeleteExamMapping,
} from '@/hooks/admin/useExamMappings';
import { ExamMapping, examMappingSchema } from '@/types/admin/exam-mapping.types';

export default function ExamMappingsPage() {
  const addToast = useUiStore((state) => state.addToast);

  const { data: mappings = [], isLoading } = useExamMappings();
  const { data: exams = [] } = useExams();
  const { data: departments = [] } = useAdminDepartments();
  const { data: semesters = [] } = useAdminSemesters();
  const { data: courses = [] } = useAdminCourses();
  const { data: teachers = [] } = useAdminTeachers();

  const createMutation = useCreateExamMapping();
  const updateMutation = useUpdateExamMapping();
  const deleteMutation = useDeleteExamMapping();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<ExamMapping | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(examMappingSchema),
  });

  const selectedDept = useWatch({ control, name: 'departmentId' });

  const filteredCourses = React.useMemo(() => {
    if (!selectedDept) return courses;
    return courses.filter((c) => c.departmentId === selectedDept);
  }, [courses, selectedDept]);

  const handleOpenCreate = () => {
    setSelectedMapping(null);
    reset({
      examId: '',
      departmentId: '',
      semesterId: '',
      courseId: '',
      teacherId: '',
      fullMarks: 100,
      passMarks: 40,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (map: ExamMapping) => {
    setSelectedMapping(map);
    reset({
      examId: map.examId,
      departmentId: map.departmentId,
      semesterId: map.semesterId,
      courseId: map.courseId,
      teacherId: map.teacherId,
      fullMarks: map.fullMarks,
      passMarks: map.passMarks,
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (map: ExamMapping) => {
    setSelectedMapping(map);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedMapping) {
        await updateMutation.mutateAsync({ id: selectedMapping._id, data });
        addToast('Exam course mapping updated successfully', 'success');
      } else {
        await createMutation.mutateAsync(data);
        addToast('Course mapped to exam successfully', 'success');
      }
      setIsFormOpen(false);
    } catch {
      addToast('An error occurred. Check marks thresholds.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedMapping) return;
    try {
      await deleteMutation.mutateAsync(selectedMapping._id);
      addToast('Mapping removed successfully', 'success');
      setIsDeleteOpen(false);
    } catch {
      addToast('Deletion failed. Please try again.', 'error');
    }
  };

  const columns = [
    { key: 'examName', label: 'Exam Structure' },
    { key: 'courseName', label: 'Syllabus Course' },
    { key: 'departmentName', label: 'Technology' },
    { key: 'semesterName', label: 'Semester' },
    { key: 'teacherName', label: 'Assigned Evaluator' },
    { key: 'fullMarks', label: 'Full Marks' },
    { key: 'passMarks', label: 'Pass Marks' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: ExamMapping) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleOpenDelete(row)}>
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Exam Syllabus Mappings"
        description="Map program courses to active examinations, set total full/pass marks, and assign faculty evaluators."
        action={<Button onClick={handleOpenCreate}>Map Syllabus Course</Button>}
      />

      <DataTable
        columns={columns}
        data={mappings}
        isLoading={isLoading}
        searchKey="examName"
        searchPlaceholder="Search mappings by exam name..."
      />

      {}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedMapping ? 'Edit Syllabus Mapping' : 'Map Syllabus Course'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Select Examination</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                {...register('examId')}
              >
                <option value="">Choose exam...</option>
                {exams.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.name}
                  </option>
                ))}
              </select>
              {errors.examId && (
                <span className="text-xs text-destructive">{errors.examId.message as string}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Technology</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                  {...register('departmentId')}
                >
                  <option value="">Select tech...</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <span className="text-xs text-destructive">{errors.departmentId.message as string}</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold">Semester Level</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                  {...register('semesterId')}
                >
                  <option value="">Select level...</option>
                  {semesters.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.semesterId && (
                  <span className="text-xs text-destructive">{errors.semesterId.message as string}</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Select Curriculum Course</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                {...register('courseId')}
              >
                <option value="">Choose course...</option>
                {filteredCourses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <span className="text-xs text-destructive">{errors.courseId.message as string}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Select Evaluator Teacher</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                {...register('teacherId')}
              >
                <option value="">Choose teacher...</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
              {errors.teacherId && (
                <span className="text-xs text-destructive">{errors.teacherId.message as string}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Full Marks</label>
                <Input type="number" error={errors.fullMarks?.message as string} {...register('fullMarks')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Pass Marks Threshold</label>
                <Input type="number" error={errors.passMarks?.message as string} {...register('passMarks')} />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                Save Mapping
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
