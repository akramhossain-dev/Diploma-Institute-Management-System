'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { useAdminAdmissionsReview } from '@/hooks/admin/useAdminAdmissionsReview';
import { AdmissionApplication } from '@/types/admin/admission-review.types';
import { cn } from '@/lib/utils';

export default function AdmissionsReviewPage() {
  const { data: applications = [], isLoading } = useAdminAdmissionsReview();
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Filter application rows
  const filteredApps = React.useMemo(() => {
    if (!statusFilter) return applications;
    return applications.filter((app) => app.status === statusFilter);
  }, [applications, statusFilter]);

  const columns = [
    { key: 'trackingId', label: 'Tracking ID' },
    { key: 'fullName', label: 'Applicant Name' },
    { key: 'departmentCode', label: 'Technology' },
    {
      key: 'createdAt',
      label: 'Submitted At',
      render: (row: AdmissionApplication) => (
        <span>{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: AdmissionApplication) => (
        <Badge
          className={cn('capitalize text-white font-bold', {
            'bg-amber-500': row.status === 'pending',
            'bg-emerald-500': row.status === 'approved',
            'bg-destructive': row.status === 'rejected',
          })}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: AdmissionApplication) => (
        <Link href={`/admin/admissions/${row._id}`}>
          <Button variant="outline" size="sm">
            Review Details
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Admission Review Board"
        description="Verify online applicant credentials, SSC transcripts, and approve/reject applications."
      />

      {/* Category filters */}
      <div className="flex gap-2 mb-4">
        <Button variant={statusFilter === '' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('')}>
          All Application
        </Button>
        <Button variant={statusFilter === 'pending' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('pending')}>
          Pending
        </Button>
        <Button variant={statusFilter === 'approved' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('approved')}>
          Approved
        </Button>
        <Button variant={statusFilter === 'rejected' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('rejected')}>
          Rejected
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredApps}
        isLoading={isLoading}
        searchKey="fullName"
        searchPlaceholder="Search applicants by name..."
      />
    </PageContainer>
  );
}
