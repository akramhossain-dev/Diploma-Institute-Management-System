'use client';

import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { DataTable } from '@/components/admin/DataTable';
import { useAdminPaymentsOverview } from '@/hooks/admin/useAdminPayments';
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import { useAdminSemesters } from '@/hooks/admin/useAdminSemesters';
import { useAdminSessions } from '@/hooks/admin/useAdminSessions';
import { StudentBillingOverview } from '@/types/accountant/payment.types';
import { AmountDisplay } from '@/components/shared/finance/AmountDisplay';
import { PaymentStatusBadge } from '@/components/shared/finance/PaymentStatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminPaymentsPage() {
  const { data: billingData = [], isLoading } = useAdminPaymentsOverview();
  const { data: departments = [] } = useAdminDepartments();
  const { data: semesters = [] } = useAdminSemesters();
  const { data: sessions = [] } = useAdminSessions();

  // Filters state
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Filtering logic
  const filteredBilling = useMemo(() => {
    return billingData.filter((item) => {
      const matchDept = !selectedDept || item.departmentName === selectedDept;
      const matchSem = !selectedSem || item.semesterName === selectedSem;
      const matchSession = !selectedSession || item.sessionName === selectedSession;
      const matchStatus = !selectedStatus || item.paymentStatus === selectedStatus;
      return matchDept && matchSem && matchSession && matchStatus;
    });
  }, [billingData, selectedDept, selectedSem, selectedSession, selectedStatus]);

  // Aggregate stats
  const stats = useMemo(() => {
    let assigned = 0;
    let paid = 0;
    let due = 0;
    filteredBilling.forEach((item) => {
      assigned += item.totalAssigned;
      paid += item.totalPaid;
      due += item.totalDue;
    });
    return { assigned, paid, due };
  }, [filteredBilling]);

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'studentRoll', label: 'Roll No' },
    { key: 'departmentName', label: 'Department' },
    { key: 'semesterName', label: 'Semester' },
    {
      key: 'totalAssigned',
      label: 'Assigned',
      render: (row: StudentBillingOverview) => <AmountDisplay amount={row.totalAssigned} />,
    },
    {
      key: 'totalPaid',
      label: 'Paid',
      render: (row: StudentBillingOverview) => <AmountDisplay amount={row.totalPaid} className="text-emerald-600" />,
    },
    {
      key: 'totalDue',
      label: 'Due',
      render: (row: StudentBillingOverview) => <AmountDisplay amount={row.totalDue} className={row.totalDue > 0 ? 'text-destructive' : 'text-muted-foreground'} />,
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (row: StudentBillingOverview) => <PaymentStatusBadge status={row.paymentStatus} />,
    },
    {
      key: 'lastPaymentDate',
      label: 'Last Payment',
      render: (row: StudentBillingOverview) => (
        <span className="text-xs text-muted-foreground">{row.lastPaymentDate || 'No record'}</span>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Institute Billing & Payments Overview"
        description="Monitor assignments status, collect cumulative statistics, and overview general cashflow metrics."
      />

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Fees Assigned</CardTitle>
          </CardHeader>
          <CardContent>
            <AmountDisplay amount={stats.assigned} className="text-2xl font-bold text-foreground" />
          </CardContent>
        </Card>
        <Card className="border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Paid / Received</CardTitle>
          </CardHeader>
          <CardContent>
            <AmountDisplay amount={stats.paid} className="text-2xl font-bold text-emerald-600" />
          </CardContent>
        </Card>
        <Card className="border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Outstanding Dues</CardTitle>
          </CardHeader>
          <CardContent>
            <AmountDisplay amount={stats.due} className="text-2xl font-bold text-destructive" />
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between border rounded-lg p-4 mb-6 bg-card">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground">Department</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="flex h-9 w-48 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground">Semester</span>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="flex h-9 w-40 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden"
            >
              <option value="">All Semesters</option>
              {semesters.map((s) => (
                <option key={s._id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground">Session</span>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="flex h-9 w-36 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden"
            >
              <option value="">All Sessions</option>
              {sessions.map((s) => (
                <option key={s._id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground">Payment Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex h-9 w-36 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedDept('');
            setSelectedSem('');
            setSelectedSession('');
            setSelectedStatus('');
          }}
          className="self-end"
        >
          Clear Filters
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredBilling}
        isLoading={isLoading}
        searchKey="studentName"
        searchPlaceholder="Search student by name..."
      />
    </PageContainer>
  );
}
