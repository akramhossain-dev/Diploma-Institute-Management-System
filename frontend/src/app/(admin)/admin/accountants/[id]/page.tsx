'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useAdminAccountant } from '@/hooks/admin/useAdminAccountants';
import { ProfileHeader } from '@/components/admin/profile/ProfileHeader';
import { ProfileSection } from '@/components/admin/profile/ProfileSection';
import { ProfileInformation } from '@/components/admin/profile/ProfileInformation';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountantProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: accountant, isLoading } = useAdminAccountant(id);

  return (
    <PageContainer>
      <SectionHeader
        title="Accountant Staff Profile"
        description="Verify personal particulars, contract records, and active credentials status."
      />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : accountant ? (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <ProfileHeader
            fullName={accountant.fullName}
            role="Accountant"
            idLabel="Staff ID"
            idValue={accountant.accountantId}
            status={accountant.status === 'active' ? 'active' : 'inactive'}
            photoUrl={accountant.photoUrl}
          />

          <ProfileSection title="Personal Particulars">
            <ProfileInformation label="Full Name" value={accountant.fullName} />
            <ProfileInformation label="Email Address" value={accountant.email} />
            <ProfileInformation label="Helpline Phone" value={accountant.phone} />
            <ProfileInformation label="Permanent Address" value={accountant.address} />
          </ProfileSection>

          <ProfileSection title="Professional parameters">
            <ProfileInformation label="Designation" value={accountant.designation} />
            <ProfileInformation label="Joining Date" value={accountant.joiningDate} />
            <ProfileInformation label="Contract Status" value={accountant.status} />
          </ProfileSection>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">Accountant member profile not found.</div>
      )}
    </PageContainer>
  );
}
