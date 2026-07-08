'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUiStore } from '@/store/ui/uiStore';
import { useAdminAdmissionReview, useUpdateAdmissionReviewStatus } from '@/hooks/admin/useAdminAdmissionsReview';
import { ProfileHeader } from '@/components/admin/profile/ProfileHeader';
import { ProfileSection } from '@/components/admin/profile/ProfileSection';
import { ProfileInformation } from '@/components/admin/profile/ProfileInformation';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { reviewActionSchema, ReviewActionInput } from '@/types/admin/admission-review.types';

export default function AdmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const addToast = useUiStore((state) => state.addToast);

  const { data: application, isLoading } = useAdminAdmissionReview(id);
  const statusMutation = useUpdateAdmissionReviewStatus();

  // Dialog controllers
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Form for rejection reasons
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewActionInput>({
    resolver: zodResolver(reviewActionSchema),
    defaultValues: {
      status: 'rejected',
      remarks: '',
    },
  });

  const handleApprove = async () => {
    try {
      await statusMutation.mutateAsync({
        id,
        status: 'approved',
        remarks: 'Admission application approved. Transcripts validated.',
      });
      addToast('Admission application approved', 'success');
      setIsApproveOpen(false);
      router.push('/admin/admissions');
    } catch (err) {
      addToast('Failed to approve application.', 'error');
    }
  };

  const handleReject = async (data: ReviewActionInput) => {
    try {
      await statusMutation.mutateAsync({
        id,
        status: 'rejected',
        remarks: data.remarks,
      });
      addToast('Admission application rejected', 'warning');
      setIsRejectOpen(false);
      router.push('/admin/admissions');
    } catch (err) {
      addToast('Failed to record rejection.', 'error');
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Application Review Board"
        description="Verify applicant credentials, review academic qualifications, and authorize enrollment."
      />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : application ? (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Header block */}
          <ProfileHeader
            fullName={application.fullName}
            role="Applicant"
            idLabel="Tracking ID"
            idValue={application.trackingId}
            status={application.status === 'approved' ? 'active' : application.status === 'rejected' ? 'suspended' : 'inactive'}
            photoUrl={application.photoUrl}
          />

          {/* Action buttons */}
          {application.status === 'pending' && (
            <div className="flex gap-3 bg-muted/40 p-4 border rounded-lg">
              <Button onClick={() => setIsApproveOpen(true)} className="font-bold">
                Approve Enrollment
              </Button>
              <Button variant="destructive" onClick={() => setIsRejectOpen(true)} className="font-bold">
                Reject Application
              </Button>
            </div>
          )}

          {/* Remarks display if reviewed */}
          {application.status !== 'pending' && application.remarks && (
            <div className="p-4 bg-muted/40 rounded-lg border text-sm space-y-1">
              <span className="font-bold text-xs uppercase tracking-wide block">
                Review Decision Remarks
              </span>
              <p className="text-muted-foreground leading-relaxed">{application.remarks}</p>
            </div>
          )}

          {/* Personal Info Grid */}
          <ProfileSection title="Personal Information">
            <ProfileInformation label="Full Name" value={application.fullName} />
            <ProfileInformation label="Date of Birth" value={application.dateOfBirth} />
            <ProfileInformation label="Gender" value={application.gender} />
            <ProfileInformation label="Phone Number" value={application.phone} />
            <ProfileInformation label="Email Address" value={application.email} />
            <ProfileInformation label="Permanent Address" value={application.address} />
          </ProfileSection>

          {/* Academic Info Grid */}
          <ProfileSection title="Academic Profile">
            <ProfileInformation label="SSC Roll Index" value={application.sscRoll} />
            <ProfileInformation label="Education Board" value={application.sscBoard} />
            <ProfileInformation label="Passing Year" value={application.sscYear} />
            <ProfileInformation label="SSC GPA achieved" value={application.sscGpa} />
            <ProfileInformation label="Previous School" value={application.previousInstitute} />
            <ProfileInformation label="Desired Technology" value={application.departmentCode} />
          </ProfileSection>

          {/* Uploaded Documents preview links */}
          <Card className="border shadow-xs">
            <div className="border-b py-4 px-6 bg-card">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wide">
                Uploaded Verification Files
              </h4>
            </div>
            <CardContent className="pt-6 space-y-4 text-sm">
              {application.documentsUrls && application.documentsUrls.map((url, i) => (
                <div key={i} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-2">
                    <LucideIcon name="FileText" className="text-primary shrink-0" />
                    <span className="font-semibold text-muted-foreground">Document copy #{i + 1}</span>
                  </div>
                  <div className="flex gap-2">
                    <a href={url} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm">Preview</Button>
                    </a>
                    <a href={url} download>
                      <Button size="sm">Download</Button>
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Approve Modal */}
          <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-foreground">Approve Application Enrollment</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground leading-relaxed py-2">
                This will authorize enrollment for {application.fullName} into Technology Program {application.departmentCode}.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApprove} isLoading={statusMutation.isPending}>
                  Confirm Approval
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Reject Modal */}
          <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-foreground">Reject Application</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleReject)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Reason for Rejection</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details e.g. SSC GPA criteria failed or missing transcripts copy..."
                    {...register('remarks')}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.remarks && (
                    <span className="text-xs text-destructive">{errors.remarks.message as string}</span>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsRejectOpen(false)} disabled={statusMutation.isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive" isLoading={statusMutation.isPending}>
                    Record Rejection
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">Application not found.</div>
      )}
    </PageContainer>
  );
}
