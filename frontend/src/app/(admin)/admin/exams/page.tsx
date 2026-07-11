'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { useUiStore } from '@/store/ui/uiStore';
import { useExams, useUpdateExam, useDeleteExam } from '@/hooks/admin/useExams';
import { Exam } from '@/types/admin/exam.types';

export default function ExamsAdminPage() {
  const addToast = useUiStore((state) => state.addToast);

  const { data: exams = [], isLoading } = useExams();
  const updateMutation = useUpdateExam();
  const deleteMutation = useDeleteExam();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const handleOpenDelete = (exam: Exam) => {
    setSelectedExam(exam);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExam) return;
    try {
      await deleteMutation.mutateAsync(selectedExam._id);
      addToast('Exam deleted successfully', 'success');
      setIsDeleteOpen(false);
    } catch {
      addToast('Deletion failed.', 'error');
    }
  };

  const handleToggleStatus = async (exam: Exam) => {
    try {
      const nextStatus = exam.status === 'published' ? 'draft' : 'published';
      await updateMutation.mutateAsync({
        id: exam._id,
        data: { status: nextStatus },
      });
      addToast(`Exam status updated to ${nextStatus}`, 'success');
    } catch {
      addToast('Failed to switch status.', 'error');
    }
  };

  const columns = [
    { key: 'name', label: 'Exam Name' },
    {
      key: 'type',
      label: 'Exam Type',
      render: (row: Exam) => <span className="capitalize">{row.type}</span>,
    },
    { key: 'sessionName', label: 'Session' },
    { key: 'semesterName', label: 'Semester' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    {
      key: 'status',
      label: 'Status',
      render: (row: Exam) => (
        <Badge
          onClick={() => handleToggleStatus(row)}
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
      render: (row: Exam) => (
        <div className="flex gap-2">
          <Link href={`/admin/exams/${row._id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={() => handleOpenDelete(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Examinations Registry"
        description="Establish mid-term and final examination structures, academic sessions criteria, and publish results status."
        action={
          <Link href="/admin/exams/create">
            <Button>Configure Exam</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={exams}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search exams by name..."
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
