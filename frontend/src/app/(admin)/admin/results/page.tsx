'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useUiStore } from '@/store/ui/uiStore';
import { useResultsOverview, usePublishResult } from '@/hooks/admin/useResultsAdmin';
import { ProcessedResultOverview } from '@/types/admin/result-admin.types';

export default function AdminResultsOverviewPage() {
  const addToast = useUiStore((state) => state.addToast);

  const { data: sheets = [], isLoading } = useResultsOverview();
  const publishMutation = usePublishResult();

  const [selectedSheet, setSelectedSheet] = useState<ProcessedResultOverview | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleTogglePublish = async (sheet: ProcessedResultOverview) => {
    try {
      const nextPublish = sheet.status !== 'published';
      await publishMutation.mutateAsync({
        id: sheet._id,
        publish: nextPublish,
      });
      addToast(
        nextPublish
          ? 'Exam results published to student dashboards successfully'
          : 'Exam results sheet unpublished successfully',
        'success'
      );
    } catch (err) {
      addToast('Status toggle failed.', 'error');
    }
  };

  const handleOpenPreview = (sheet: ProcessedResultOverview) => {
    setSelectedSheet(sheet);
    setIsPreviewOpen(true);
  };

  const columns = [
    { key: 'examName', label: 'Exam Structure' },
    { key: 'departmentName', label: 'Technology' },
    { key: 'semesterName', label: 'Semester' },
    { key: 'totalStudents', label: 'Total Enrolled' },
    {
      key: 'status',
      label: 'Status State',
      render: (row: ProcessedResultOverview) => (
        <Badge
          onClick={() => handleTogglePublish(row)}
          className="cursor-pointer capitalize text-white font-bold"
          variant={row.status === 'published' ? 'default' : 'secondary'}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: ProcessedResultOverview) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenPreview(row)}>
            Preview Sheet
          </Button>
          <Button
            variant={row.status === 'published' ? 'destructive' : 'default'}
            size="sm"
            onClick={() => handleTogglePublish(row)}
            isLoading={publishMutation.isPending}
          >
            {row.status === 'published' ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Results Authorize Board"
        description="Preview computed technology GPA averages ledger, authorize results publishing, or unpublish circular sheets."
      />

      <DataTable
        columns={columns}
        data={sheets}
        isLoading={isLoading}
        searchKey="examName"
        searchPlaceholder="Search sheets by exam name..."
      />

      {/* Preview Sheet dialog modal */}
      {selectedSheet && (
        <Dialog open={isPreviewOpen} onOpenChange={(open) => !open && setIsPreviewOpen(false)}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Preview Sheet - {selectedSheet.examName} ({selectedSheet.departmentName})
              </DialogTitle>
            </DialogHeader>
            <div className="pt-4 space-y-4">
              <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1">
                <p><span className="font-semibold">Semester:</span> {selectedSheet.semesterName}</p>
                <p><span className="font-semibold">Total Students Passed:</span> {selectedSheet.totalStudents}</p>
                <p><span className="font-semibold">Class GPA average:</span> 3.82</p>
              </div>

              {/* Renders mock roster data logs */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Average GPA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold text-xs">CST-2026-001</TableCell>
                    <TableCell className="font-semibold text-xs">Akram Hossain</TableCell>
                    <TableCell className="text-center font-bold text-primary text-xs">3.80</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold text-xs">ENT-2026-005</TableCell>
                    <TableCell className="font-semibold text-xs">Sara Khan</TableCell>
                    <TableCell className="text-center font-bold text-primary text-xs">3.90</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Close Preview
                </Button>
                <Button onClick={() => {
                  handleTogglePublish(selectedSheet);
                  setIsPreviewOpen(false);
                }}>
                  {selectedSheet.status === 'published' ? 'Unpublish Results' : 'Confirm Publish'}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}
