'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useUiStore } from '@/store/ui/uiStore';
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import {
  useAdminCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from '@/hooks/admin/useAdminCourses';
import { Course, courseFormSchema } from '@/types/admin/course.types';

export default function CoursesCrudPage() {
  const addToast = useUiStore((state) => state.addToast);

  // Queries & Mutations
  const { data: courses = [], isLoading, isError } = useAdminCourses();
  const { data: departments = [], isLoading: deptsLoading } = useAdminDepartments();
  
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(courseFormSchema),
  });

  const handleOpenCreate = () => {
    setSelectedCourse(null);
    reset({
      name: '',
      code: '',
      departmentId: '',
      credits: 3,
      type: 'both',
      status: 'active',
      description: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setSelectedCourse(course);
    reset({
      name: course.name,
      code: course.code,
      departmentId: course.departmentId,
      credits: course.credits,
      type: course.type,
      status: course.status,
      description: course.description || '',
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedCourse) {
        await updateMutation.mutateAsync({ id: selectedCourse._id, data });
        addToast('Course curriculum updated successfully', 'success');
      } else {
        await createMutation.mutateAsync(data);
        addToast('Course registered successfully', 'success');
      }
      setIsFormOpen(false);
    } catch (err) {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCourse) return;
    try {
      await deleteMutation.mutateAsync(selectedCourse._id);
      addToast('Course removed successfully', 'success');
      setIsDeleteOpen(false);
    } catch (err) {
      addToast('Deletion failed. Please try again.', 'error');
    }
  };

  const handleToggleStatus = async (course: Course) => {
    try {
      const nextStatus = course.status === 'active' ? 'inactive' : 'active';
      await updateMutation.mutateAsync({
        id: course._id,
        data: { status: nextStatus },
      });
      addToast(`Course status updated to ${nextStatus}`, 'success');
    } catch (err) {
      addToast('Failed to switch course status.', 'error');
    }
  };

  // Columns definition
  const columns = [
    { key: 'code', label: 'Course Code' },
    { key: 'name', label: 'Course Name' },
    { key: 'departmentName', label: 'Technology' },
    {
      key: 'type',
      label: 'Course Type',
      render: (row: Course) => <span className="capitalize">{row.type}</span>,
    },
    { key: 'credits', label: 'Credits' },
    {
      key: 'status',
      label: 'Status',
      render: (row: Course) => (
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
      render: (row: Course) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleOpenDelete(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Courses Management"
        description="Establish engineering diploma syllabus courses, credits weight, and map to respective technologies."
        action={<Button onClick={handleOpenCreate}>Add Course</Button>}
      />

      <DataTable
        columns={columns}
        data={courses}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search courses by name..."
      />

      {/* CRUD dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedCourse ? 'Edit Course Syllabus details' : 'Register Syllabus Course'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Course Name</label>
              <Input placeholder="e.g. Microcontroller Interfacing" error={errors.name?.message as string} {...register('name')} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Course Code</label>
              <Input placeholder="e.g. CST-422" error={errors.code?.message as string} {...register('code')} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Technology Department</label>
              <select
                disabled={deptsLoading}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                {...register('departmentId')}
              >
                <option value="">Select department program...</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <span className="text-xs text-destructive">{errors.departmentId.message as string}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Credits Weight</label>
                <Input type="number" placeholder="e.g. 3" error={errors.credits?.message as string} {...register('credits')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Course Type</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('type')}
                >
                  <option value="both">Theory + Practical</option>
                  <option value="theory">Theory Only</option>
                  <option value="practical">Practical Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Description</label>
              <Input placeholder="Syllabus overview" error={errors.description?.message as string} {...register('description')} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Status</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                {...register('status')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
