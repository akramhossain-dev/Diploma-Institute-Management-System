'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
import { useCreateExam } from '@/hooks/admin/useExams';
import { examSchema } from '@/types/admin/exam.types';

export default function CreateExamPage() {
  const router = useRouter();
  const addToast = useUiStore((state) => state.addToast);

  const { data: semesters = [], isLoading: semsLoading } = useAdminSemesters();
  const { data: sessions = [], isLoading: sessLoading } = useAdminSessions();
  const createMutation = useCreateExam();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: '',
      type: 'midterm',
      sessionId: '',
      semesterId: '',
      status: 'draft',
    },
  });

  const handleFormSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      addToast('Exam created successfully', 'success');
      router.push('/admin/exams');
    } catch {
      addToast('Failed to configure exam details.', 'error');
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Configure New Exam"
        description="Establish mid-term or final term durations, active sessions, and status settings."
      />

      <Card className="max-w-xl border shadow-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Exam Label Name</label>
              <Input placeholder="e.g. Mid Term Exam Summer 2026" error={errors.name?.message as string} {...register('name')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <span className="text-xs text-destructive">{errors.sessionId.message as string}</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold">Semester Level</label>
                <select
                  disabled={semsLoading}
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
                  <option value="draft">Draft details copy</option>
                  <option value="published">Publish circular instantly</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/exams')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                Create Exam
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
