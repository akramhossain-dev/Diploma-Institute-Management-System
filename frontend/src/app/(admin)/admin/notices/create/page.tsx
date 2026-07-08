'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/upload/FileUploader';
import { useUiStore } from '@/store/ui/uiStore';
import { useCreateAdminNotice } from '@/hooks/admin/useAdminNotices';
import { NoticeFormInput, noticeFormSchema } from '@/types/admin/notice-admin.types';

export default function CreateNoticePage() {
  const router = useRouter();
  const addToast = useUiStore((state) => state.addToast);
  const createMutation = useCreateAdminNotice();
  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'general',
      targetAudience: 'all',
      status: 'published',
    },
  });

  const handleFormSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        attachmentUrl: attachmentUrl || '',
      };
      await createMutation.mutateAsync(payload);
      addToast('Notice published successfully', 'success');
      router.push('/admin/notices');
    } catch (err) {
      addToast('Failed to compose notice circular.', 'error');
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Compose New Notice"
        description="Write notice boards announcement, define audiences group, and attach schedules/flyers."
      />

      <Card className="max-w-2xl border shadow-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Notice Title</label>
              <Input placeholder="e.g. Class Reschedules for Summer Holidays" error={errors.title?.message as string} {...register('title')} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Notice Content Details</label>
              <textarea
                placeholder="Enter details..."
                rows={5}
                {...register('content')}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
              {errors.content && (
                <span className="text-xs text-destructive">{errors.content.message as string}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Notice Category</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('category')}
                >
                  <option value="general">General Announcements</option>
                  <option value="admission">Admissions Portal</option>
                  <option value="exam">Examinations Routine</option>
                  <option value="holiday">Holiday Circulars</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold">Target Audience</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('targetAudience')}
                >
                  <option value="all">All Audiences</option>
                  <option value="students">Students Scope Only</option>
                  <option value="teachers">Faculty Members Only</option>
                  <option value="accountants">Accounting Office Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Status state</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('status')}
                >
                  <option value="published">Publish circular instantly</option>
                  <option value="draft">Save draft copy</option>
                </select>
              </div>
            </div>

            {/* Document attachment loader */}
            <div className="space-y-2 pt-2 border-t">
              <label className="text-sm font-semibold block">Attach document flyers (PDF only)</label>
              {attachmentUrl ? (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                  <span className="text-sm font-semibold text-emerald-800">Document Uploaded</span>
                  <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => setAttachmentUrl(undefined)}>
                    Replace
                  </Button>
                </div>
              ) : (
                <FileUploader
                  label="Upload circular attachment document copy"
                  allowedTypes={['application/pdf']}
                  onUploadSuccess={(url) => setAttachmentUrl(url)}
                />
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/notices')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                Publish Circular
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
