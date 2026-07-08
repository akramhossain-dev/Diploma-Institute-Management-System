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
import { useAdminSemesters } from '@/hooks/admin/useAdminSemesters';
import { useAdminSessions } from '@/hooks/admin/useAdminSessions';
import { useExam, useUpdateExam } from '@/hooks/admin/useExams';
import { ExamFormInput, examSchema } from '@/types/admin/exam.types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const addToast = useUiStore((state) => state.addToast);

  const { data: exam, isLoading } = useExam(id);
  const { data: semesters = [] } = useAdminSemesters();
  const { data: sessions = [] } = useAdminSessions();
  const updateMutation = useUpdateExam();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(examSchema),
  });

  useEffect(() => {
    if (exam) {
      setValue('name', exam.name);
      setValue('type', exam.type);
      setValue('sessionId', exam.sessionId);
      setValue('semesterId', exam.semesterId);
      setValue('startDate', exam.startDate);
      setValue('endDate', exam.endDate);
      setValue('status', exam.status);
    }
  }, [exam, setValue]);

  const handleFormSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      addToast('Exam details updated successfully', 'success');
      router.push('/admin/exams');
    } catch (err) {
      addToast('Failed to update exam.', 'error');
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Edit Examination details"
        description="Modify exam calendar parameters, sessions registry tags, or update status states."
      />

      {isLoading ? (
        <Card className="max-w-xl border shadow-xs">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-xl border shadow-md animate-in fade-in-50 duration-300">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Exam Label Name</label>
                <Input placeholder="Enter exam label name" error={errors.name?.message as string} {...register('name')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Academic Session</label>
                  <select
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

                <div className="space-y-1">
                  <label className="text-sm font-semibold">Semester Level</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Start Date</label>
                  <Input type="date" error={errors.startDate?.message as string} {...register('startDate')} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">End Date</label>
                  <Input type="date" error={errors.endDate?.message as string} {...register('endDate')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Exam Type</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                    {...register('type')}
                  >
                    <option value="midterm">Mid Term Exam</option>
                    <option value="final">Final Term Exam</option>
                    <option value="practical">Practical Exam</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold">Status State</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                    {...register('status')}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/exams')}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={updateMutation.isPending}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
