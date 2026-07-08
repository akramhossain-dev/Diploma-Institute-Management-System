'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { AdmissionForm } from '@/components/admission/AdmissionForm';

export default function AdmissionPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Online Admission Application"
        description="Fill out the multi-step admission wizard and attach document copies to apply for engineering diploma programs."
      />
      <AdmissionForm />
    </PageContainer>
  );
}
