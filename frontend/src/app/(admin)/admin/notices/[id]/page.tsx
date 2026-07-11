'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/upload/FileUploader';
import { useUiStore } from '@/store/ui/uiStore';
import { useAdminNotice, useUpdateAdminNotice } from '@/hooks/admin/useAdminNotices';
import { noticeFormSchema } from '@/types/admin/notice-admin.types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditNoticePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const addToast = useUiStore((state) => state.addToast);
  
  const { data: notice, isLoading } = useAdminNotice(id);
  const updateMutation = useUpdateAdminNotice();

  const [attachmentUrl, setAttachmentUrl] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(noticeFormSchema),
  });

  useEffect(() => {
    if (notice) {
      setValue('title', notice.title);
      setValue('content', notice.content);
      setValue('category', notice.category);
      setValue('targetAudience', notice.targetAudience);
      setValue('status', notice.status);
      if (notice.attachmentUrl) {
        setAttachmentUrl(notice.attachmentUrl);
      }
    }
  }, [notice, setValue]);

  const handleFormSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        attachmentUrl: attachmentUrl || '',
      };
      await updateMutation.mutateAsync({ id, data: payload });
      addToast('Notice updated successfully', 'success');
      router.push('/admin/notices');
    } catch {
      addToast('Failed to update notice circular.', 'error');
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Edit Notice Circular"
        description="Modify announcement scopes, rewrite descriptions details, or replacement attachments file."
      />

      {isLoading ? (
        <Card className="max-w-2xl border">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-28 w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl border shadow-md animate-in fade-in-50 duration-300">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Notice Title</label>
                <Input placeholder="Enter title" error={errors.title?.message as string} {...register('title')} />
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
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {}
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
