'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useAdmissionStatus } from '@/hooks/public/useAdmission';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { cn } from '@/lib/utils';

function AdmissionStatusContent() {
  const searchParams = useSearchParams();
  const initialTrackingId = searchParams.get('trackingId') || '';

  const [inputTrackingId, setInputTrackingId] = useState(initialTrackingId);
  const [activeTrackingId, setActiveTrackingId] = useState(initialTrackingId);

  const { data: record, isLoading, isError, error } = useAdmissionStatus(activeTrackingId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputTrackingId.trim()) {
      setActiveTrackingId(inputTrackingId.trim());
    }
  };

  useEffect(() => {
    if (initialTrackingId) {
      setInputTrackingId(initialTrackingId);
      setActiveTrackingId(initialTrackingId);
    }
  }, [initialTrackingId]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Tracker Search Form */}
      <Card className="border shadow-xs">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">Application Tracking ID</label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. ADM-123456"
                  value={inputTrackingId}
                  onChange={(e) => setInputTrackingId(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !inputTrackingId.trim()}>
                  Search
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Screen */}
      {isLoading && (
        <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm text-muted-foreground font-semibold">Fetching status...</span>
        </div>
      )}

      {isError && (
        <Card className="border border-destructive/20 bg-destructive/10 text-destructive text-center py-8">
          <CardContent className="space-y-2">
            <LucideIcon name="AlertTriangle" size={32} className="mx-auto text-destructive" />
            <h3 className="font-bold">No Records Found</h3>
            <p className="text-sm opacity-90 max-w-xs mx-auto">
              {(error as any)?.message || 'We could not find an admission record matching that tracking ID.'}
            </p>
          </CardContent>
        </Card>
      )}

      {record && !isLoading && (
        <Card className="border shadow-md animate-in fade-in-50 duration-300">
          <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-md font-bold">
              Application Record
            </CardTitle>
            <Badge
              className={cn('capitalize text-white font-bold', {
                'bg-amber-500': record.status === 'pending',
                'bg-emerald-500': record.status === 'approved',
                'bg-destructive': record.status === 'rejected',
              })}
            >
              {record.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Profile Overview */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">Applicant Name</span>
                <span className="font-semibold text-foreground">{record.fullName}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">Desired Department</span>
                <span className="font-semibold text-foreground">{record.departmentCode}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">Registered Email</span>
                <span className="font-semibold text-foreground text-xs truncate block">{record.email}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">Submitted At</span>
                <span className="font-semibold text-foreground">{new Date(record.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Committee Remarks */}
            {record.remarks && (
              <div className="p-4 bg-muted/40 rounded-lg border text-sm space-y-1">
                <span className="font-bold text-xs text-foreground uppercase tracking-wide block">
                  Committee Remarks
                </span>
                <p className="text-muted-foreground leading-relaxed">{record.remarks}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AdmissionStatusPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Check Admission Status"
        description="Verify your submitted application, document approvals, and enrollment status using your Tracking ID."
      />
      <Suspense
        fallback={
          <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground font-semibold">Loading tracker...</span>
          </div>
        }
      >
        <AdmissionStatusContent />
      </Suspense>
    </PageContainer>
  );
}
