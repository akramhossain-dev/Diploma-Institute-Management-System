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
import { useFeeStructures, useUpdateFeeStructure, useDeleteFeeStructure } from '@/hooks/admin/useFeeStructures';
import { FeeStructure } from '@/types/admin/fee-structure.types';
import { AmountDisplay } from '@/components/shared/finance/AmountDisplay';

export default function FeeStructuresAdminPage() {
  const addToast = useUiStore((state) => state.addToast);

  const { data: feeStructures = [], isLoading } = useFeeStructures();
  const updateMutation = useUpdateFeeStructure();
  const deleteMutation = useDeleteFeeStructure();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeStructure | null>(null);

  const handleOpenDelete = (fee: FeeStructure) => {
    setSelectedFee(fee);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFee) return;
    try {
      await deleteMutation.mutateAsync(selectedFee._id);
      addToast('Fee structure deleted successfully', 'success');
      setIsDeleteOpen(false);
    } catch (err) {
      addToast('Deletion failed.', 'error');
    }
  };

  const handleToggleStatus = async (fee: FeeStructure) => {
    try {
      const nextStatus = fee.status === 'active' ? 'inactive' : 'active';
      await updateMutation.mutateAsync({
        id: fee._id,
        data: { status: nextStatus },
      });
      addToast(`Fee structure status updated to ${nextStatus}`, 'success');
    } catch (err) {
      addToast('Failed to toggle status.', 'error');
    }
  };

  const columns = [
    { key: 'name', label: 'Fee Structure Name' },
    { key: 'departmentName', label: 'Department' },
    { key: 'semesterName', label: 'Semester' },
    { key: 'sessionName', label: 'Session' },
    {
      key: 'amount',
      label: 'Amount',
      render: (row: FeeStructure) => <AmountDisplay amount={row.amount} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: FeeStructure) => (
        <Badge
          onClick={() => handleToggleStatus(row)}
          className="cursor-pointer capitalize text-white font-bold"
          variant={row.status === 'active' ? 'success' : 'secondary'}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: FeeStructure) => (
        <div className="flex gap-2">
          <Link href={`/admin/fees/${row._id}`}>
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
        title="Fee Structure Management"
        description="Configure academic fee structures, select department/semester specific criteria, and activate/deactivate schedules."
        action={
          <Link href="/admin/fees/create">
            <Button>Create Fee Structure</Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={feeStructures}
        isLoading={isLoading}
        searchKey="name"
        searchPlaceholder="Search fee structures by title..."
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
