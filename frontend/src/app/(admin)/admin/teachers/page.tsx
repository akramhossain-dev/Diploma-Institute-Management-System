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
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import {
  useAdminTeachers,
  useCreateTeacher,
  useUpdateTeacher,
} from '@/hooks/admin/useAdminTeachers';
import { Teacher, teacherFormSchema } from '@/types/admin/teacher.types';

export default function TeachersCrudPage() {
  const addToast = useUiStore((state) => state.addToast);

  // Queries & Mutations
  const { data: teachers = [], isLoading } = useAdminTeachers();
  const { data: departments = [], isLoading: deptsLoading } = useAdminDepartments();

  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [deptFilter, setDeptFilter] = useState<string>('');

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(teacherFormSchema),
  });

  const handleOpenCreate = () => {
    setSelectedTeacher(null);
    setAvatarUrl(undefined);
    reset({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      designation: 'Senior Lecturer',
      departmentId: '',
      qualification: '',
      joiningDate: new Date().toISOString().split('T')[0],
      teacherId: 'TCH-2026-0' + Math.floor(10 + Math.random() * 90),
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tch: Teacher) => {
    setSelectedTeacher(tch);
    setAvatarUrl(tch.photoUrl);
    reset({
      fullName: tch.fullName,
      email: tch.email,
      phone: tch.phone,
      address: tch.address,
      designation: tch.designation,
      departmentId: tch.departmentId,
      qualification: tch.qualification,
      joiningDate: tch.joiningDate,
      teacherId: tch.teacherId,
      status: tch.status,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        photoUrl: avatarUrl || '',
      };
      if (selectedTeacher) {
        await updateMutation.mutateAsync({ id: selectedTeacher._id, data: payload });
        addToast('Teacher profile updated successfully', 'success');
      } else {
        await createMutation.mutateAsync(payload);
        addToast('Teacher registered successfully', 'success');
      }
      setIsFormOpen(false);
    } catch (err) {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleToggleStatus = async (tch: Teacher) => {
    try {
      const nextStatus = tch.status === 'active' ? 'inactive' : 'active';
      await updateMutation.mutateAsync({
        id: tch._id,
        data: { status: nextStatus },
      });
      addToast(`Teacher status updated to ${nextStatus}`, 'success');
    } catch (err) {
      addToast('Failed to switch status.', 'error');
    }
  };

  // Filter rows by departmentId
  const filteredTeachers = React.useMemo(() => {
    if (!deptFilter) return teachers;
    return teachers.filter((t) => t.departmentId === deptFilter || t.departmentCode === deptFilter);
  }, [teachers, deptFilter]);

  const columns = [
    { key: 'teacherId', label: 'Teacher ID' },
    { key: 'fullName', label: 'Name' },
    { key: 'departmentName', label: 'Technology' },
    { key: 'designation', label: 'Designation' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (row: Teacher) => (
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
      render: (row: Teacher) => (
        <div className="flex gap-2">
          <Link href={`/admin/teachers/${row._id}`}>
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
        title="Faculty Management"
        description="Verify school teachers registers, configure designations, and assign engineering technology scopes."
        action={<Button onClick={handleOpenCreate}>Add Teacher</Button>}
      />

      {/* Department Filter Option */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold text-muted-foreground uppercase">Filter Technology:</span>
        <select
          disabled={deptsLoading}
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="flex h-8 rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-hidden"
        >
          <option value="">All Technologies</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredTeachers}
        isLoading={isLoading}
        searchKey="fullName"
        searchPlaceholder="Search faculty members by name..."
      />

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedTeacher ? 'Edit Faculty Details' : 'Register Faculty Member'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <h4 className="text-xs font-bold text-primary uppercase border-b pb-1">Personal Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Full Name</label>
                <Input placeholder="Dr. John Doe" error={errors.fullName?.message as string} {...register('fullName')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Faculty Phone</label>
                <Input placeholder="+8801700" error={errors.phone?.message as string} {...register('phone')} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Email Address</label>
              <Input type="email" placeholder="faculty@ndi.edu.bd" error={errors.email?.message as string} {...register('email')} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Home Address</label>
              <Input placeholder="Mirpur, Dhaka" error={errors.address?.message as string} {...register('address')} />
            </div>

            <h4 className="text-xs font-bold text-primary uppercase border-b pb-1 pt-2">Professional details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Designation</label>
                <Input placeholder="Senior Lecturer" error={errors.designation?.message as string} {...register('designation')} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Technology Department</label>
                <select
                  disabled={deptsLoading}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('departmentId')}
                >
                  <option value="">Select department...</option>
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
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Qualifications Details</label>
              <Input placeholder="e.g. M.Sc. in CSE" error={errors.qualification?.message as string} {...register('qualification')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-2">
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

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold">Faculty ID code</label>
              <Input error={errors.teacherId?.message as string} {...register('teacherId')} />
            </div>

            {/* Avatar uploader */}
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
                Save Faculty
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
