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
import { useAdminNotices, useUpdateAdminNotice, useDeleteAdminNotice } from '@/hooks/admin/useAdminNotices';
import { AdminNotice } from '@/types/admin/notice-admin.types';

export default function NoticesAdminPage() {
  const addToast = useUiStore((state) => state.addToast);

  const { data: notices = [], isLoading } = useAdminNotices();
  const updateMutation = useUpdateAdminNotice();
  const deleteMutation = useDeleteAdminNotice();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<AdminNotice | null>(null);

  const handleOpenDelete = (notice: AdminNotice) => {
    setSelectedNotice(notice);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedNotice) return;
    try {
      await deleteMutation.mutateAsync(selectedNotice._id);
      addToast('Notice circular deleted successfully', 'success');
      setIsDeleteOpen(false);
    } catch {
      addToast('Deletion failed.', 'error');
    }
  };

  const handleTogglePublish = async (notice: AdminNotice) => {
    try {
      const nextStatus = notice.status === 'published' ? 'draft' : 'published';
      await updateMutation.mutateAsync({
        id: notice._id,
        data: { status: nextStatus },
      });
      addToast(`Notice status updated to ${nextStatus}`, 'success');
    } catch {
      addToast('Failed to switch status.', 'error');
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'category',
      label: 'Category',
      render: (row: AdminNotice) => <span className="capitalize">{row.category}</span>,
    },
    {
      key: 'targetAudience',
      label: 'Target Audience',
      render: (row: AdminNotice) => <span className="capitalize">{row.targetAudience}</span>,
    },
    { key: 'publishDate', label: 'Publish Date' },
    {
      key: 'status',
      label: 'Status',
      render: (row: AdminNotice) => (
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
      render: (row: AdminNotice) => (
        <div className="flex gap-2">
          <Link href={`/admin/notices/${row._id}`}>
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
        title="Notice Board Management"
        description="Write circular announcements, target students/faculty scopes, and attach notices documents."
        action={
          <Link href="/admin/notices/create">
            <Button>Compose Notice</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={notices}
        isLoading={isLoading}
        searchKey="title"
        searchPlaceholder="Search notices by title..."
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
