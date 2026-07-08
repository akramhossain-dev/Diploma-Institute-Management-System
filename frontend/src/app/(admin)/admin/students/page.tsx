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
import { useAdminSemesters } from '@/hooks/admin/useAdminSemesters';
import { useAdminSessions } from '@/hooks/admin/useAdminSessions';
import {
  useAdminStudents,
  useCreateStudent,
  useUpdateStudent,
} from '@/hooks/admin/useAdminStudents';
import { Student, studentFormSchema } from '@/types/admin/student.types';

export default function StudentsCrudPage() {
  const addToast = useUiStore((state) => state.addToast);

  // Queries & Mutations
  const { data: students = [], isLoading } = useAdminStudents();
  const { data: departments = [], isLoading: deptsLoading } = useAdminDepartments();
  const { data: semesters = [], isLoading: semsLoading } = useAdminSemesters();
  const { data: sessions = [], isLoading: sessLoading } = useAdminSessions();

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  // Filter states
  const [deptFilter, setDeptFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(studentFormSchema),
  });

  const handleOpenCreate = () => {
    setSelectedStudent(null);
    setAvatarUrl(undefined);
    reset({
      fullName: '',
      dateOfBirth: '2005-01-01',
      gender: 'male',
      phone: '',
      email: '',
      address: '',
      departmentId: '',
      semesterId: '',
      sessionId: '',
      studentId: 'STU-2026-0' + Math.floor(10 + Math.random() * 90),
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (stu: Student) => {
    setSelectedStudent(stu);
    setAvatarUrl(stu.photoUrl);
    reset({
      fullName: stu.fullName,
      dateOfBirth: stu.dateOfBirth,
      gender: stu.gender,
      phone: stu.phone,
      email: stu.email,
      address: stu.address,
      departmentId: stu.departmentId,
      semesterId: stu.semesterId,
      sessionId: stu.sessionId,
      studentId: stu.studentId,
      admissionDate: stu.admissionDate,
      status: stu.status,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        photoUrl: avatarUrl || '',
      };
      if (selectedStudent) {
        await updateMutation.mutateAsync({ id: selectedStudent._id, data: payload });
        addToast('Student details updated successfully', 'success');
      } else {
        await createMutation.mutateAsync(payload);
        addToast('Student enrolled successfully', 'success');
      }
      setIsFormOpen(false);
    } catch (err) {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleToggleStatus = async (stu: Student) => {
    try {
      const nextStatus = stu.status === 'active' ? 'inactive' : 'active';
      await updateMutation.mutateAsync({
        id: stu._id,
        data: { status: nextStatus },
      });
      addToast(`Student status updated to ${nextStatus}`, 'success');
    } catch (err) {
      addToast('Failed to switch status.', 'error');
    }
  };

  // Filter application rows dynamically
  const filteredStudents = React.useMemo(() => {
    return students.filter((s) => {
      const matchDept = !deptFilter || s.departmentId === deptFilter || s.departmentCode === deptFilter;
      const matchSem = !semesterFilter || s.semesterId === semesterFilter;
      const matchSess = !sessionFilter || s.sessionId === sessionFilter;
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchDept && matchSem && matchSess && matchStatus;
    });
  }, [students, deptFilter, semesterFilter, sessionFilter, statusFilter]);

  const columns = [
    { key: 'studentId', label: 'Student ID' },
    { key: 'fullName', label: 'Name' },
    { key: 'departmentName', label: 'Technology' },
    { key: 'semesterName', label: 'Semester' },
    { key: 'sessionName', label: 'Session' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (row: Student) => (
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
      render: (row: Student) => (
        <div className="flex gap-2">
          <Link href={`/admin/students/${row._id}`}>
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
        title="Students Registry"
        description="Search students index profiles, configure active semesters enrollment parameters, or edit profiles."
        action={<Button onClick={handleOpenCreate}>Enroll Student</Button>}
      />

      {/* Multi-Select Filters block */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 bg-muted/30 p-4 border rounded-lg">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Technology</label>
          <select
            disabled={deptsLoading}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-xs shadow-xs"
          >
            <option value="">All Technologies</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Semester</label>
          <select
            disabled={semsLoading}
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-xs shadow-xs"
          >
            <option value="">All Semesters</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Session</label>
          <select
            disabled={sessLoading}
            value={sessionFilter}
            onChange={(e) => setSessionFilter(e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-xs shadow-xs"
          >
            <option value="">All Sessions</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Status State</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-8 w-full rounded-md border border-input bg-background px-3 text-xs shadow-xs"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredStudents}
        isLoading={isLoading}
        searchKey="fullName"
        searchPlaceholder="Search students by name..."
      />

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedStudent ? 'Edit Student Details' : 'Register Student Enrollment'}
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
                <label className="text-xs font-semibold">Date of Birth</label>
                <Input type="date" error={errors.dateOfBirth?.message as string} {...register('dateOfBirth')} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Gender</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('gender')}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">Phone Number</label>
                <Input placeholder="+8801700" error={errors.phone?.message as string} {...register('phone')} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Email Address</label>
              <Input type="email" placeholder="student@gmail.com" error={errors.email?.message as string} {...register('email')} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Permanent Address</label>
              <Input placeholder="Adabor, Dhaka" error={errors.address?.message as string} {...register('address')} />
            </div>

            <h4 className="text-xs font-bold text-primary uppercase border-b pb-1 pt-2">Academic parameters</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="space-y-1">
                <label className="text-xs font-semibold">Semester Level</label>
                <select
                  disabled={semsLoading}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('semesterId')}
                >
                  <option value="">Select semester...</option>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Academic Session</label>
                <select
                  disabled={sessLoading}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
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

              <div className="space-y-1">
                <label className="text-xs font-semibold">Admission Date</label>
                <Input type="date" error={errors.admissionDate?.message as string} {...register('admissionDate')} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Student ID tag</label>
                <Input error={errors.studentId?.message as string} {...register('studentId')} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Status state</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('status')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Photo uploader */}
            <div className="space-y-1 pt-2 border-t">
              <label className="text-xs font-semibold block">Profile Photo Image</label>
              {avatarUrl ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                  <span className="text-sm font-semibold text-emerald-800">Photo attached</span>
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
                Enroll Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
