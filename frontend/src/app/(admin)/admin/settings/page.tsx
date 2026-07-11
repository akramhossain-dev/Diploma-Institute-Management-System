'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/upload/FileUploader';
import { useUiStore } from '@/store/ui/uiStore';
import { useAdminSettings, useUpdateSettings } from '@/hooks/admin/useAdminSettings';
import { SettingsFormInput, settingsFormSchema } from '@/types/admin/settings.types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSettingsPage() {
  const addToast = useUiStore((state) => state.addToast);

  const { data: settings, isLoading } = useAdminSettings();
  const updateMutation = useUpdateSettings();

  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormInput>({
    resolver: zodResolver(settingsFormSchema),
  });

  useEffect(() => {
    if (settings) {
      setValue('name', settings.name);
      setValue('code', settings.code);
      setValue('established', settings.established);
      setValue('address', settings.address);
      setValue('email', settings.email);
      setValue('phone', settings.phone);
      setValue('website', settings.website);
      setValue('admissionOpen', settings.admissionOpen);
      setValue('description', settings.description || '');
      setValue('socialLinks.facebook', settings.socialLinks?.facebook || '');
      setValue('socialLinks.twitter', settings.socialLinks?.twitter || '');
      setValue('socialLinks.linkedin', settings.socialLinks?.linkedin || '');
      if (settings.logo) {
        setLogoUrl(settings.logo);
      }
    }
  }, [settings, setValue]);

  const handleFormSubmit = async (data: SettingsFormInput) => {
    try {
      const payload = {
        ...data,
        logo: logoUrl || '',
      };
      await updateMutation.mutateAsync(payload);
      addToast('Institute configurations updated successfully', 'success');
    } catch {
      addToast('Failed to update configurations.', 'error');
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Institute Configurations"
        description="Manage school EMIS details, helpline numbers, online admission triggers, and brand logo settings."
      />

      {isLoading ? (
        <Card className="border shadow-xs">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-3xl animate-in fade-in-50 duration-300">
          <Card className="border shadow-md">
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-md font-bold border-b pb-2 text-foreground">Basic Profile</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Institute Name</label>
                  <Input placeholder="Enter school name" error={errors.name?.message} {...register('name')} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">EMIS/EIIN Code</label>
                  <Input placeholder="Enter code" error={errors.code?.message} {...register('code')} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Establishment Year</label>
                  <Input placeholder="e.g. 1998" error={errors.established?.message} {...register('established')} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Address</label>
                  <Input placeholder="Campus location" error={errors.address?.message} {...register('address')} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold">Description Summary</label>
                <textarea
                  rows={3}
                  placeholder="Tell something about the institute..."
                  {...register('description')}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-md">
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-md font-bold border-b pb-2 text-foreground">Helpline & Website</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">General Email</label>
                  <Input placeholder="e.g. info@ndi.edu.bd" error={errors.email?.message} {...register('email')} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Helpline Phone</label>
                  <Input placeholder="e.g. +8802-998877" error={errors.phone?.message} {...register('phone')} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold">Website Address URL</label>
                <Input placeholder="https://www.ndi.edu.bd" error={errors.website?.message} {...register('website')} />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-md">
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-md font-bold border-b pb-2 text-foreground">Brand Logo</h3>
              
              {logoUrl ? (
                <div className="flex items-center gap-4 p-3 bg-muted/40 border rounded-md max-w-sm">
                  <div className="h-12 w-12 rounded border bg-white flex items-center justify-center overflow-hidden shrink-0">
                    <img src={logoUrl} alt="Institute Logo Preview" className="h-10 w-10 object-contain" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-foreground block">Logo Image Attached</span>
                    <button
                      type="button"
                      onClick={() => setLogoUrl(undefined)}
                      className="text-destructive font-semibold hover:underline mt-0.5"
                    >
                      Delete and Replace
                    </button>
                  </div>
                </div>
              ) : (
                <FileUploader
                  label="Upload Institute Logo (PNG/JPG)"
                  allowedTypes={['image/jpeg', 'image/png']}
                  onUploadSuccess={(url) => setLogoUrl(url)}
                />
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-md">
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-md font-bold border-b pb-2 text-foreground">Online Admissions Trigger</h3>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="admissionOpen"
                  {...register('admissionOpen')}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="admissionOpen" className="text-sm font-semibold cursor-pointer select-none">
                  Open Online Admission Application portal link to the public website
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-md">
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-md font-bold border-b pb-2 text-foreground">Social Links</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Facebook URL</label>
                  <Input placeholder="https://facebook.com/..." {...register('socialLinks.facebook')} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Twitter URL</label>
                  <Input placeholder="https://twitter.com/..." {...register('socialLinks.twitter')} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold">LinkedIn URL</label>
                  <Input placeholder="https://linkedin.com/..." {...register('socialLinks.linkedin')} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" className="w-full sm:w-auto font-bold" isLoading={updateMutation.isPending}>
              Save Configurations
            </Button>
          </div>
        </form>
      )}
    </PageContainer>
  );
}
