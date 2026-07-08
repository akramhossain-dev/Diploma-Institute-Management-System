'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useDepartments } from '@/hooks/public/useDepartments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/feedback/ErrorState';

export default function DepartmentsPage() {
  const { data: departments = [], isLoading, isError, refetch } = useDepartments();

  return (
    <PageContainer>
      <SectionHeader
        title="Engineering Departments"
        description="Explore the diploma engineering departments, laboratory descriptions, and department chairs."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border shadow-xs">
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="Could not retrieve departments listing." onRetry={refetch} />
      ) : departments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50 duration-300">
          {departments.map((dept) => (
            <Card key={dept._id} className="border shadow-xs hover:shadow-md transition-all">
              <CardHeader className="border-b pb-4 mb-4">
                <CardTitle className="flex justify-between items-center text-lg">
                  <span>{dept.name}</span>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                    {dept.code}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {dept.description}
                </p>
                {dept.headTeacherName && (
                  <div className="text-xs text-muted-foreground bg-muted/40 p-2 rounded-md border flex justify-between items-center">
                    <span>Department Chair:</span>
                    <span className="font-semibold text-foreground">{dept.headTeacherName}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">No academic departments offer programs at this time.</div>
      )}
    </PageContainer>
  );
}
