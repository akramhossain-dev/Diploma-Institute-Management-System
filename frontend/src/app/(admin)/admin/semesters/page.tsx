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
import {
  useAdminSemesters,
  useCreateSemester,
  useUpdateSemester,
  useDeleteSemester,
} from '@/hooks/admin/useAdminSemesters';
import { Semester, semesterFormSchema } from '@/types/admin/semester.types';

export default function SemestersCrudPage() {
  const addToast = useUiStore((state) => state.addToast);

  // Queries & Mutations
  const { data: semesters = [], isLoading, isError } = useAdminSemesters();
  const createMutation = useCreateSemester();
  const updateMutation = useUpdateSemester();
  const deleteMutation = useDeleteSemester();

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSem, setSelectedSem] = useState<Semester | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(semesterFormSchema),
  });

  const handleOpenCreate = () => {
    setSelectedSem(null);
    reset({
      name: '',
      number: 1,
      durationMonths: 6,
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (sem: Semester) => {
    setSelectedSem(sem);
    reset({
      name: sem.name,
      number: sem.number,
      durationMonths: sem.durationMonths,
      status: sem.status,
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (sem: Semester) => {
    setSelectedSem(sem);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedSem) {
        await updateMutation.mutateAsync({ id: selectedSem._id, data });
        addToast('Semester updated successfully', 'success');
      } else {
        await createMutation.mutateAsync(data);
        addToast('Semester created successfully', 'success');
      }
      setIsFormOpen(false);
    } catch (err) {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSem) return;
    try {
      await deleteMutation.mutateAsync(selectedSem._id);
      addToast('Semester deleted successfully', 'success');
      setIsDeleteOpen(false);
    } catch (err) {
      addToast('Deletion failed. Please try again.', 'error');
    }
  };

  const handleToggleStatus = async (sem: Semester) => {
    try {
      const nextStatus = sem.status === 'active' ? 'inactive' : 'active';
      await updateMutation.mutateAsync({
        id: sem._id,
        data: { status: nextStatus },
      });
      addToast(`Semester status updated to ${nextStatus}`, 'success');
    } catch (err) {
      addToast('Failed to switch status.', 'error');
    }
  };

  // Columns definition
  const columns = [
    { key: 'name', label: 'Semester Name' },
    { key: 'number', label: 'Semester Index' },
    {
      key: 'durationMonths',
      label: 'Duration',
      render: (row: Semester) => <span>{row.durationMonths} Months</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Semester) => (
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
      render: (row: Semester) => (
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
        title="Semester Structures"
        description="Establish engineering diploma semesters indices, active schedules, and term months duration."
        action={<Button onClick={handleOpenCreate}>Add Semester</Button>}
      />

      <DataTable
        columns={columns}
        data={semesters}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search semesters by name..."
      />

      {/* CRUD dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedSem ? 'Edit Semester details' : 'Configure Semester Index'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Semester Name</label>
              <Input placeholder="e.g. 1st Semester" error={errors.name?.message as string} {...register('name')} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Semester Number (Index)</label>
              <Input type="number" placeholder="e.g. 1" error={errors.number?.message as string} {...register('number')} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Duration (Months)</label>
              <Input type="number" placeholder="e.g. 6" error={errors.durationMonths?.message as string} {...register('durationMonths')} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Default Status</label>
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
