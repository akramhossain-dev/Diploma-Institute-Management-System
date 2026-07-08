'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useInstituteInfo } from '@/hooks/public/useInstituteInfo';
import { Skeleton } from '@/components/ui/skeleton';

export default function AboutPage() {
  const { data: institute, isLoading } = useInstituteInfo();

  return (
    <PageContainer>
      <SectionHeader
        title="About Our Institute"
        description="Learn more about our heritage, vision statement, and facilities."
      />

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : institute ? (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          {/* History */}
          <div className="bg-card border p-6 rounded-lg shadow-xs space-y-3">
            <h2 className="text-xl font-bold text-foreground">Institute History</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{institute.history}</p>
            <div className="text-xs text-muted-foreground pt-2">
              <span>Established: </span>
              <span className="font-semibold text-foreground">{institute.established}</span>
              <span className="mx-2">|</span>
              <span>EMIS Code: </span>
              <span className="font-semibold text-foreground">{institute.code}</span>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border p-6 rounded-lg shadow-xs space-y-3">
              <h2 className="text-lg font-bold text-primary">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{institute.mission}</p>
            </div>
            <div className="bg-card border p-6 rounded-lg shadow-xs space-y-3">
              <h2 className="text-lg font-bold text-primary">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{institute.vision}</p>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-card border p-6 rounded-lg shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-foreground">Campus Facilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-muted/40 rounded-md border text-center">
                <span className="font-semibold block mb-1">State-of-the-art Labs</span>
                <span className="text-xs text-muted-foreground">Physics, Chemistry, Electronics & CST labs.</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-md border text-center">
                <span className="font-semibold block mb-1">Central Library</span>
                <span className="text-xs text-muted-foreground">Over 15,000 engineering and reference books.</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-md border text-center">
                <span className="font-semibold block mb-1">Job Placement Cell</span>
                <span className="text-xs text-muted-foreground">Coordinates internships & mock job interviews.</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">Unable to retrieve institute settings.</div>
      )}
    </PageContainer>
  );
}
