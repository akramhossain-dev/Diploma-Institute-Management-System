'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useUiStore } from '@/store/ui/uiStore';
import { useAdminTeachers } from '@/hooks/admin/useAdminTeachers';
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import { useAdminSemesters } from '@/hooks/admin/useAdminSemesters';
import { useAdminSessions } from '@/hooks/admin/useAdminSessions';
import { useAdminCourses } from '@/hooks/admin/useAdminCourses';
import {
  useCourseAssignments,
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
} from '@/hooks/admin/useCourseAssignments';
import { CourseAssignment, courseAssignmentSchema } from '@/types/admin/course-assignment.types';

export default function CourseAssignmentsPage() {
  const addToast = useUiStore((state) => state.addToast);

  const { data: assignments = [], isLoading } = useCourseAssignments();
  const { data: teachers = [], isLoading: teachersLoading } = useAdminTeachers();
  const { data: departments = [], isLoading: deptsLoading } = useAdminDepartments();
  const { data: semesters = [], isLoading: semsLoading } = useAdminSemesters();
  const { data: sessions = [], isLoading: sessionsLoading } = useAdminSessions();
  const { data: courses = [], isLoading: coursesLoading } = useAdminCourses();

  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();
  const deleteMutation = useDeleteAssignment();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<CourseAssignment | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(courseAssignmentSchema),
  });

  const selectedDept = useWatch({ control, name: 'departmentId' });

  const filteredCourses = React.useMemo(() => {
    if (!selectedDept) return courses;
    return courses.filter((c) => c.departmentId === selectedDept);
  }, [courses, selectedDept]);

  const handleOpenCreate = () => {
    setSelectedAssignment(null);
    reset({
      teacherId: '',
      departmentId: '',
      courseId: '',
      semesterId: '',
      sessionId: '',
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (assign: CourseAssignment) => {
    setSelectedAssignment(assign);
    reset({
      teacherId: assign.teacherId,
      departmentId: assign.departmentId,
      courseId: assign.courseId,
      semesterId: assign.semesterId,
      sessionId: assign.sessionId,
      status: assign.status,
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (assign: CourseAssignment) => {
    setSelectedAssignment(assign);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedAssignment) {
        await updateMutation.mutateAsync({ id: selectedAssignment._id, data });
        addToast('Course assignment updated successfully', 'success');
      } else {
        await createMutation.mutateAsync(data);
        addToast('Teacher assigned to course successfully', 'success');
      }
      setIsFormOpen(false);
    } catch {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAssignment) return;
    try {
      await deleteMutation.mutateAsync(selectedAssignment._id);
      addToast('Course assignment removed successfully', 'success');
      setIsDeleteOpen(false);
    } catch {
      addToast('Deletion failed. Please try again.', 'error');
    }
  };

  const handleToggleStatus = async (assign: CourseAssignment) => {
    try {
      const nextStatus = assign.status === 'active' ? 'inactive' : 'active';
      await updateMutation.mutateAsync({
        id: assign._id,
        data: { status: nextStatus },
      });
      addToast(`Assignment status updated to ${nextStatus}`, 'success');
    } catch {
      addToast('Failed to switch status.', 'error');
    }
  };

  const columns = [
    { key: 'teacherName', label: 'Faculty Teacher' },
    { key: 'courseName', label: 'Course Curriculum' },
    { key: 'departmentName', label: 'Technology' },
    { key: 'semesterName', label: 'Semester' },
    { key: 'sessionName', label: 'Session' },
    {
      key: 'status',
      label: 'Status',
      render: (row: CourseAssignment) => (
        <Badge
          onClick={() => handleToggleStatus(row)}
          className="cursor-pointer capitalize text-white font-bold"
          variant={row.status === 'active' ? 'default' : 'secondary'}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: CourseAssignment) => (
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
        title="Course Allocations Board"
        description="Assign faculty instructors to curriculum courses, semester scopes, and technologies."
        action={<Button onClick={handleOpenCreate}>Assign Course</Button>}
      />

      <DataTable
        columns={columns}
        data={assignments}
        isLoading={isLoading}
        searchKey="teacherName"
        searchPlaceholder="Search allocations by teacher name..."
      />

      {}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedAssignment ? 'Edit Course Allocation' : 'Create Course Allocation'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Select Faculty Instructor</label>
              <select
                disabled={teachersLoading}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                {...register('teacherId')}
              >
                <option value="">Choose instructor...</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.fullName} ({t.designation})
                  </option>
                ))}
              </select>
              {errors.teacherId && (
                <span className="text-xs text-destructive">{errors.teacherId.message as string}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Select Technology Department</label>
              <select
                disabled={deptsLoading}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                {...register('departmentId')}
              >
                <option value="">Choose department...</option>
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
              <label className="text-sm font-semibold">Select Syllabus Course</label>
              <select
                disabled={coursesLoading}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Semester Level</label>
                <select
                  disabled={semsLoading}
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

              <div className="space-y-1">
                <label className="text-sm font-semibold">Academic Session</label>
                <select
                  disabled={sessionsLoading}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                  {...register('sessionId')}
                >
                  <option value="">Select session...</option>
                  {sessions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.sessionId && (
                  <span className="text-xs text-destructive">{errors.sessionId.message as string}</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Status state</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                {...register('status')}
              >
                <option value="active">Active allocation</option>
                <option value="inactive">Inactive/Suspended</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                Save Assignment
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
