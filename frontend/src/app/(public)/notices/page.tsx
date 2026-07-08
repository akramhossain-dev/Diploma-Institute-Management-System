'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useNotices } from '@/hooks/public/useNotices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/feedback/ErrorState';
import { EmptyState } from '@/components/shared/feedback/EmptyState';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';

export default function NoticesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: noticesResponse, isLoading, isError, refetch } = useNotices({
    page,
    limit: 6,
    search: search || undefined,
    category: category || undefined,
  });

  const notices = noticesResponse?.data || [];
  const pagination = noticesResponse?.pagination;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset page to 1 on new search query
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    setPage(1); // Reset page to 1 on filter
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Notice Board"
        description="Verify official notices, schedules, holidays, and circulars from the academic committee."
      />

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Input
              placeholder="Search notice titles or keywords..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <div className="absolute left-3 top-2.5 text-muted-foreground">
              <LucideIcon name="Search" size={16} />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-48">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">All Categories</option>
            <option value="general">General</option>
            <option value="admission">Admissions</option>
            <option value="exam">Examinations</option>
            <option value="holiday">Holidays</option>
          </select>
        </div>
      </div>

      {/* Notice List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border shadow-xs">
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <ErrorState message="Could not retrieve notices." onRetry={refetch} />
      ) : notices.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 animate-in fade-in-50 duration-300">
            {notices.map((notice) => (
              <Card key={notice._id} className="border shadow-xs hover:border-primary/20 transition-all">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
                  <CardTitle className="text-lg font-bold text-foreground">
                    {notice.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline">{notice.publishDate}</Badge>
                    <Badge variant="secondary" className="capitalize">
                      {notice.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">{notice.content}</p>
                  
                  {notice.attachmentUrl && (
                    <div className="pt-2 border-t flex justify-end">
                      <a
                        href={notice.attachmentUrl}
                        download
                        className="inline-flex items-center text-xs font-semibold text-primary hover:underline gap-1.5"
                      >
                        <LucideIcon name="Download" size={14} />
                        Download Attachment Document copy
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous Page
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                Next Page
              </Button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No notices found"
          description="We couldn't find any notices matching your query filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setCategory('');
            setPage(1);
          }}
        />
      )}
    </PageContainer>
  );
}
