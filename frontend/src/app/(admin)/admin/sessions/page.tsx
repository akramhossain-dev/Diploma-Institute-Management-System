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
  useAdminSessions,
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
} from '@/hooks/admin/useAdminSessions';
import { AcademicSession, sessionFormSchema } from '@/types/admin/session.types';

export default function SessionsCrudPage() {
  const addToast = useUiStore((state) => state.addToast);

  const { data: sessions = [], isLoading } = useAdminSessions();
  const createMutation = useCreateSession();
  const updateMutation = useUpdateSession();
  const deleteMutation = useDeleteSession();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSess, setSelectedSess] = useState<AcademicSession | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(sessionFormSchema),
  });

  const handleOpenCreate = () => {
    setSelectedSess(null);
    reset({
      name: '',
      startYear: 2026,
      endYear: 2027,
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (sess: AcademicSession) => {
    setSelectedSess(sess);
    reset({
      name: sess.name,
      startYear: sess.startYear,
      endYear: sess.endYear,
      status: sess.status,
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (sess: AcademicSession) => {
    setSelectedSess(sess);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedSess) {
        await updateMutation.mutateAsync({ id: selectedSess._id, data });
        addToast('Academic session updated successfully', 'success');
      } else {
        await createMutation.mutateAsync(data);
        addToast('Academic session created successfully', 'success');
      }
      setIsFormOpen(false);
    } catch {
      addToast('An error occurred. Please check year ranges.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSess) return;
    try {
      await deleteMutation.mutateAsync(selectedSess._id);
      addToast('Academic session deleted successfully', 'success');
      setIsDeleteOpen(false);
    } catch {
      addToast('Deletion failed. Please try again.', 'error');
    }
  };

  const handleToggleStatus = async (sess: AcademicSession) => {
    try {
      const nextStatus = sess.status === 'active' ? 'inactive' : 'active';
      await updateMutation.mutateAsync({
        id: sess._id,
        data: { status: nextStatus },
      });
      addToast(`Session status updated to ${nextStatus}`, 'success');
    } catch {
      addToast('Failed to switch active status.', 'error');
    }
  };

  const columns = [
    { key: 'name', label: 'Academic Session' },
    { key: 'startYear', label: 'Start Year' },
    { key: 'endYear', label: 'End Year' },
    {
      key: 'status',
      label: 'Active Status',
      render: (row: AcademicSession) => (
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
      render: (row: AcademicSession) => (
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
        title="Academic Sessions"
        description="Establish years calendars, sessions enrollment tags, and set current active sessions."
        action={<Button onClick={handleOpenCreate}>Add Session</Button>}
      />

      <DataTable
        columns={columns}
        data={sessions}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search sessions by name..."
      />

      {}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedSess ? 'Edit Session details' : 'Configure Enrollment Session'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Session Name</label>
              <Input placeholder="e.g. 2026-2027" error={errors.name?.message as string} {...register('name')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Start Year</label>
                <Input type="number" placeholder="e.g. 2026" error={errors.startYear?.message as string} {...register('startYear')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">End Year</label>
                <Input type="number" placeholder="e.g. 2027" error={errors.endYear?.message as string} {...register('endYear')} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Active Status</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                {...register('status')}
              >
                <option value="active">Active (Primary)</option>
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

      {}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
