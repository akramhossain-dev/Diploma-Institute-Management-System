'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/store/ui/uiStore';
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import { useAdminSemesters } from '@/hooks/admin/useAdminSemesters';
import { useAdminSessions } from '@/hooks/admin/useAdminSessions';
import { useFeeStructure, useUpdateFeeStructure } from '@/hooks/admin/useFeeStructures';
import { FeeStructureFormInput, feeStructureSchema } from '@/types/admin/fee-structure.types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditFeeStructurePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const addToast = useUiStore((state) => state.addToast);

  const { data: feeStructure, isLoading: isFeeLoading } = useFeeStructure(id);
  const { data: departments = [], isLoading: deptsLoading } = useAdminDepartments();
  const { data: semesters = [], isLoading: semsLoading } = useAdminSemesters();
  const { data: sessions = [], isLoading: sessLoading } = useAdminSessions();
  const updateMutation = useUpdateFeeStructure();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FeeStructureFormInput>({
    resolver: zodResolver(feeStructureSchema),
    defaultValues: {
      name: '',
      departmentId: '',
      semesterId: '',
      sessionId: '',
      amount: 0,
      dueDate: '',
      description: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (feeStructure) {
      setValue('name', feeStructure.name);
      setValue('departmentId', feeStructure.departmentId || '');
      setValue('semesterId', feeStructure.semesterId || '');
      setValue('sessionId', feeStructure.sessionId);
      setValue('amount', feeStructure.amount);
      setValue('dueDate', feeStructure.dueDate || '');
      setValue('description', feeStructure.description || '');
      setValue('status', feeStructure.status);
    }
  }, [feeStructure, setValue]);

  const handleFormSubmit = async (data: FeeStructureFormInput) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      addToast('Fee structure updated successfully', 'success');
      router.push('/admin/fees');
    } catch (err) {
      addToast('Failed to update fee structure details.', 'error');
    }
  };

  if (isFeeLoading) {
    return (
      <PageContainer>
        <SectionHeader title="Edit Fee Structure" description="Loading details..." />
        <Card className="max-w-xl border shadow-md">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Edit Fee Structure"
        description="Modify fee component variables, select optional filter parameters, or schedule updates."
      />

      <Card className="max-w-xl border shadow-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Fee Title / Structure Name</label>
              <Input placeholder="e.g. Admission Fee 2026" error={errors.name?.message} {...register('name')} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Academic Session</label>
              <select
                disabled={sessLoading}
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
                <span className="text-xs text-destructive">{errors.sessionId.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Department (Optional)</label>
                <select
                  disabled={deptsLoading}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                  {...register('departmentId')}
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold">Semester (Optional)</label>
                <select
                  disabled={semsLoading}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                  {...register('semesterId')}
                >
                  <option value="">All Semesters</option>
                  {semesters.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Amount (BDT)</label>
                <Input type="number" step="0.01" error={errors.amount?.message} {...register('amount')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Due Date (Optional)</label>
                <Input type="date" error={errors.dueDate?.message} {...register('dueDate')} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Description</label>
              <textarea
                placeholder="Description of the fee item..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden"
                {...register('description')}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Status State</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                {...register('status')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/fees')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={updateMutation.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
