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
  useAdminDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from '@/hooks/admin/useAdminDepartments';
import { Department, departmentFormSchema, DepartmentFormInput } from '@/types/admin/department.types';

export default function DepartmentsCrudPage() {
  const addToast = useUiStore((state) => state.addToast);

  // Queries & Mutations
  const { data: departments = [], isLoading, isError } = useAdminDepartments();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormInput>({
    resolver: zodResolver(departmentFormSchema),
  });

  const handleOpenCreate = () => {
    setSelectedDept(null);
    reset({
      name: '',
      code: '',
      description: '',
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setSelectedDept(dept);
    reset({
      name: dept.name,
      code: dept.code,
      description: dept.description,
      status: dept.status,
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (dept: Department) => {
    setSelectedDept(dept);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: DepartmentFormInput) => {
    try {
      if (selectedDept) {
        await updateMutation.mutateAsync({ id: selectedDept._id, data });
        addToast('Department updated successfully', 'success');
      } else {
        await createMutation.mutateAsync(data);
        addToast('Department registered successfully', 'success');
      }
      setIsFormOpen(false);
    } catch (err) {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDept) return;
    try {
      await deleteMutation.mutateAsync(selectedDept._id);
      addToast('Department deleted successfully', 'success');
      setIsDeleteOpen(false);
    } catch (err) {
      addToast('Deletion failed. Please try again.', 'error');
    }
  };

  const handleToggleStatus = async (dept: Department) => {
    try {
      const nextStatus = dept.status === 'active' ? 'inactive' : 'active';
      await updateMutation.mutateAsync({
        id: dept._id,
        data: { status: nextStatus },
      });
      addToast(`Department status updated to ${nextStatus}`, 'success');
    } catch (err) {
      addToast('Failed to switch status.', 'error');
    }
  };

  // Columns definition
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Technology Code' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      render: (row: Department) => (
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
      render: (row: Department) => (
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
        title="Departments Management"
        description="Configure academic engineering technologies, course tags, and departments status."
        action={<Button onClick={handleOpenCreate}>Add Department</Button>}
      />

      <DataTable
        columns={columns}
        data={departments}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search departments by name..."
      />

      {/* CRUD dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedDept ? 'Edit Department Details' : 'Create Academic Department'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Department Name</label>
              <Input placeholder="e.g. Computer Technology" error={errors.name?.message} {...register('name')} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Technology Code</label>
              <Input placeholder="e.g. CST" error={errors.code?.message} {...register('code')} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Description</label>
              <Input placeholder="e.g. Computing studies" error={errors.description?.message} {...register('description')} />
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
