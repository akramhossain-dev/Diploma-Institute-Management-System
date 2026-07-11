'use client';

import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { DataTable } from '@/components/admin/DataTable';
import { useAccountantFees } from '@/hooks/accountant/useAccountantFees';
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import { useAdminSemesters } from '@/hooks/admin/useAdminSemesters';
import { useAdminSessions } from '@/hooks/admin/useAdminSessions';
import { StudentBillingOverview } from '@/types/accountant/payment.types';
import { AmountDisplay } from '@/components/shared/finance/AmountDisplay';
import { PaymentStatusBadge } from '@/components/shared/finance/PaymentStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AccountantFeesPage() {
  const { data: billingData = [], isLoading } = useAccountantFees();
  const { data: departments = [] } = useAdminDepartments();
  const { data: semesters = [] } = useAdminSemesters();
  const { data: sessions = [] } = useAdminSessions();

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredBilling = useMemo(() => {
    return billingData.filter((item) => {
      const matchDept = !selectedDept || item.departmentName === selectedDept;
      const matchSem = !selectedSem || item.semesterName === selectedSem;
      const matchSession = !selectedSession || item.sessionName === selectedSession;
      const matchStatus = !selectedStatus || item.paymentStatus === selectedStatus;
      return matchDept && matchSem && matchSession && matchStatus;
    });
  }, [billingData, selectedDept, selectedSem, selectedSession, selectedStatus]);

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
      label: 'Total Assigned',
      render: (row: StudentBillingOverview) => <AmountDisplay amount={row.totalAssigned} />,
    },
    {
      key: 'totalPaid',
      label: 'Total Paid',
      render: (row: StudentBillingOverview) => <AmountDisplay amount={row.totalPaid} className="text-emerald-600" />,
    },
    {
      key: 'totalDue',
      label: 'Outstanding Due',
      render: (row: StudentBillingOverview) => <AmountDisplay amount={row.totalDue} className={row.totalDue > 0 ? 'text-destructive font-bold' : 'text-muted-foreground'} />,
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (row: StudentBillingOverview) => <PaymentStatusBadge status={row.paymentStatus} />,
    },
    {
      key: 'lastPaymentDate',
      label: 'Last Payment Date',
      render: (row: StudentBillingOverview) => (
        <span className="text-xs text-muted-foreground">{row.lastPaymentDate || 'No payment logged'}</span>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Student Dues & Billing Overview"
        description="Verify overall student billing, filter by semester level, department categories, and review payments histories."
      />

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in fade-in-50 duration-300">
        <Card className="border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Assigned Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <AmountDisplay amount={stats.assigned} className="text-2xl font-bold text-foreground" />
          </CardContent>
        </Card>
        <Card className="border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Collected Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <AmountDisplay amount={stats.paid} className="text-2xl font-bold text-emerald-600" />
          </CardContent>
        </Card>
        <Card className="border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Outstanding Receivables</CardTitle>
          </CardHeader>
          <CardContent>
            <AmountDisplay amount={stats.due} className="text-2xl font-bold text-destructive" />
          </CardContent>
        </Card>
      </div>

      {}
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
        searchPlaceholder="Search students by name..."
      />
    </PageContainer>
  );
}
