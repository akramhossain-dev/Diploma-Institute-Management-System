'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useAdminStudent } from '@/hooks/admin/useAdminStudents';
import { ProfileHeader } from '@/components/admin/profile/ProfileHeader';
import { ProfileSection } from '@/components/admin/profile/ProfileSection';
import { ProfileInformation } from '@/components/admin/profile/ProfileInformation';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: student, isLoading } = useAdminStudent(id);

  return (
    <PageContainer>
      <SectionHeader
        title="Student Registry Profile"
        description="Verify personal credentials, active semesters enrollment parameter list, and technology indices."
      />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : student ? (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <ProfileHeader
            fullName={student.fullName}
            role="Student"
            idLabel="Student ID"
            idValue={student.studentId}
            status={student.status}
            photoUrl={student.photoUrl}
          />

          <ProfileSection title="Personal Particulars">
            <ProfileInformation label="Full Name" value={student.fullName} />
            <ProfileInformation label="Date of Birth" value={student.dateOfBirth} />
            <ProfileInformation label="Gender" value={student.gender} />
            <ProfileInformation label="Phone Number" value={student.phone} />
            <ProfileInformation label="Email Address" value={student.email} />
            <ProfileInformation label="Home Address" value={student.address} />
          </ProfileSection>

          <ProfileSection title="Academic Parameters">
            <ProfileInformation label="Technology Department" value={`${student.departmentName} (${student.departmentCode})`} />
            <ProfileInformation label="Semester Level" value={student.semesterName} />
            <ProfileInformation label="Academic Session" value={student.sessionName} />
            <ProfileInformation label="Enrollment Date" value={student.admissionDate} />
            <ProfileInformation label="Registration Status" value={student.status} />
          </ProfileSection>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">Student profile not found in system registers.</div>
      )}
    </PageContainer>
  );
}
