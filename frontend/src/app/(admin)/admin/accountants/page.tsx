'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/admin/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useUiStore } from '@/store/ui/uiStore';
import { ImageUploader } from '@/components/upload/ImageUploader';
import {
  useAdminAccountants,
  useCreateAccountant,
  useUpdateAccountant,
} from '@/hooks/admin/useAdminAccountants';
import { Accountant, accountantFormSchema } from '@/types/admin/accountant.types';

export default function AccountantsCrudPage() {
  const addToast = useUiStore((state) => state.addToast);

  const { data: accountants = [], isLoading } = useAdminAccountants();
  const createMutation = useCreateAccountant();
  const updateMutation = useUpdateAccountant();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState<Accountant | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(accountantFormSchema),
  });

  const handleOpenCreate = () => {
    setSelectedAcc(null);
    setAvatarUrl(undefined);
    reset({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      designation: 'Senior Accountant',
      joiningDate: new Date().toISOString().split('T')[0],
      accountantId: 'ACC-2026-0' + Math.floor(10 + Math.random() * 90),
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (acc: Accountant) => {
    setSelectedAcc(acc);
    setAvatarUrl(acc.photoUrl);
    reset({
      fullName: acc.fullName,
      email: acc.email,
      phone: acc.phone,
      address: acc.address,
      designation: acc.designation,
      joiningDate: acc.joiningDate,
      accountantId: acc.accountantId,
      status: acc.status,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        photoUrl: avatarUrl || '',
      };
      if (selectedAcc) {
        await updateMutation.mutateAsync({ id: selectedAcc._id, data: payload });
        addToast('Accountant details updated successfully', 'success');
      } else {
        await createMutation.mutateAsync(payload);
        addToast('Accountant account registered successfully', 'success');
      }
      setIsFormOpen(false);
    } catch {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleToggleStatus = async (acc: Accountant) => {
    try {
      const nextStatus = acc.status === 'active' ? 'inactive' : 'active';
      await updateMutation.mutateAsync({
        id: acc._id,
        data: { status: nextStatus },
      });
      addToast(`Accountant status updated to ${nextStatus}`, 'success');
    } catch {
      addToast('Failed to switch status.', 'error');
    }
  };

  const columns = [
    { key: 'accountantId', label: 'Accountant ID' },
    { key: 'fullName', label: 'Name' },
    { key: 'designation', label: 'Designation' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (row: Accountant) => (
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
      render: (row: Accountant) => (
        <div className="flex gap-2">
          <Link href={`/admin/accountants/${row._id}`}>
            <Button variant="outline" size="sm">
              Profile
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Accountants Registry"
        description="Verify accountants registers, edit job profile metrics, or configure active operational accounts."
        action={<Button onClick={handleOpenCreate}>Add Accountant</Button>}
      />

      <DataTable
        columns={columns}
        data={accountants}
        isLoading={isLoading}
        searchKey="fullName"
        searchPlaceholder="Search accountants by name..."
      />

      {}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedAcc ? 'Edit Accountant Details' : 'Register Accounting Staff'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <h4 className="text-xs font-bold text-primary uppercase border-b pb-1">Personal Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Full Name</label>
                <Input placeholder="John Doe" error={errors.fullName?.message as string} {...register('fullName')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Staff Phone</label>
                <Input placeholder="+880170000" error={errors.phone?.message as string} {...register('phone')} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Email Address</label>
              <Input type="email" placeholder="accounts@ndi.edu.bd" error={errors.email?.message as string} {...register('email')} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Permanent Address</label>
              <Input placeholder="Dhanmondi, Dhaka" error={errors.address?.message as string} {...register('address')} />
            </div>

            <h4 className="text-xs font-bold text-primary uppercase border-b pb-1 pt-2">Professional details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Designation</label>
                <Input placeholder="Senior Accountant" error={errors.designation?.message as string} {...register('designation')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Staff ID tag</label>
                <Input error={errors.accountantId?.message as string} {...register('accountantId')} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Joining Date</label>
                <Input type="date" error={errors.joiningDate?.message as string} {...register('joiningDate')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Status State</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('status')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {}
            <div className="space-y-1 pt-2 border-t">
              <label className="text-xs font-semibold block">Profile Avatar Image</label>
              {avatarUrl ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                  <span className="text-sm font-semibold text-emerald-800">Avatar uploaded</span>
                  <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setAvatarUrl(undefined)}>
                    Replace
                  </Button>
                </div>
              ) : (
                <ImageUploader onUploadSuccess={(url) => setAvatarUrl(url)} />
              )}
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                Save Accountant
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
