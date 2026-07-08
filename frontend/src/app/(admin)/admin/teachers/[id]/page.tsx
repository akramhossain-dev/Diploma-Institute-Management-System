'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useAdminTeacher } from '@/hooks/admin/useAdminTeachers';
import { ProfileHeader } from '@/components/admin/profile/ProfileHeader';
import { ProfileSection } from '@/components/admin/profile/ProfileSection';
import { ProfileInformation } from '@/components/admin/profile/ProfileInformation';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeacherProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: teacher, isLoading } = useAdminTeacher(id);

  return (
    <PageContainer>
      <SectionHeader
        title="Teacher Faculty Profile"
        description="Verify personal credentials, research profiles details, and department allocations tags."
      />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : teacher ? (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <ProfileHeader
            fullName={teacher.fullName}
            role="Teacher"
            idLabel="Faculty ID"
            idValue={teacher.teacherId}
            status={teacher.status === 'active' ? 'active' : 'inactive'}
            photoUrl={teacher.photoUrl}
          />

          <ProfileSection title="Personal Particulars">
            <ProfileInformation label="Full Name" value={teacher.fullName} />
            <ProfileInformation label="Email Address" value={teacher.email} />
            <ProfileInformation label="Mobile Phone" value={teacher.phone} />
            <ProfileInformation label="Home Address" value={teacher.address} />
          </ProfileSection>

          <ProfileSection title="Academic Parameters">
            <ProfileInformation label="Allocated Department" value={`${teacher.departmentName} (${teacher.departmentCode})`} />
            <ProfileInformation label="Designation Position" value={teacher.designation} />
            <ProfileInformation label="Qualifications Details" value={teacher.qualification} />
            <ProfileInformation label="Joining Date" value={teacher.joiningDate} />
          </ProfileSection>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">Teacher profile not found in system registers.</div>
      )}
    </PageContainer>
  );
}
