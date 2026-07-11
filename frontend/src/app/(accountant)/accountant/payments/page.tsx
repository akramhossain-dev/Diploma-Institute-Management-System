'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/store/ui/uiStore';
import { useAccountantFees } from '@/hooks/accountant/useAccountantFees';
import { useCollectPayment } from '@/hooks/accountant/useAccountantPayments';
import { useStudentLedger } from '@/hooks/accountant/useStudentLedger';
import { paymentCollectionSchema, PaymentCollectionFormInput, StudentBillingOverview } from '@/types/accountant/payment.types';
import { AmountDisplay } from '@/components/shared/finance/AmountDisplay';
import { PaymentStatusBadge } from '@/components/shared/finance/PaymentStatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';

export default function AccountantPaymentsPage() {
  const addToast = useUiStore((state) => state.addToast);
  const { data: studentsOverview = [] } = useAccountantFees();
  const collectPaymentMutation = useCollectPayment();

  const [selectedStudent, setSelectedStudent] = useState<StudentBillingOverview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch ledger for selected student
  const { data: ledgerEntries = [], isLoading: isLedgerLoading } = useStudentLedger(
    selectedStudent?.studentId || ''
  );

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return studentsOverview.filter(
      (s) =>
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentRoll.includes(searchQuery) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [studentsOverview, searchQuery]);

  // Payment Form Setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PaymentCollectionFormInput>({
    resolver: zodResolver(paymentCollectionSchema),
    defaultValues: {
      studentId: '',
      feeStructureId: '',
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      reference: '',
    },
  });

  const mockFeeItems = [
    { id: 'fee-1', name: 'Admission Fee 2026', amount: 15000 },
    { id: 'fee-2', name: 'Semester Exam Fee 2026', amount: 3000 },
  ];

  const handleSelectStudent = (student: StudentBillingOverview) => {
    setSelectedStudent(student);
    setValue('studentId', student.studentId);
    setSearchQuery(''); 
  };

  const handleCollectPayment = async (data: PaymentCollectionFormInput) => {
    try {
      await collectPaymentMutation.mutateAsync(data);
      addToast('Payment collected successfully', 'success');
      reset({
        studentId: selectedStudent?.studentId || '',
        feeStructureId: '',
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'cash',
        reference: '',
      });
      
      if (selectedStudent) {
        const nextPaid = selectedStudent.totalPaid + data.amount;
        const nextDue = Math.max(0, selectedStudent.totalDue - data.amount);
        setSelectedStudent({
          ...selectedStudent,
          totalPaid: nextPaid,
          totalDue: nextDue,
          paymentStatus: nextDue === 0 ? 'paid' : 'partial',
          lastPaymentDate: data.paymentDate,
        });
      }
    } catch {
      addToast('Failed to log payment transaction.', 'error');
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Collect Student Payments"
        description="Search students, review billing dues summaries, and log payment transactions in real-time."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Student Directory Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Enter name or Roll No..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute left-3 top-2.5 text-muted-foreground">
                  <LucideIcon name="Search" size={16} />
                </div>
              </div>

              {}
              {searchQuery && (
                <div className="border rounded-md divide-y max-h-60 overflow-y-auto bg-card shadow-lg">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <button
                        key={s.studentId}
                        type="button"
                        onClick={() => handleSelectStudent(s)}
                        className="w-full text-left px-3 py-2 hover:bg-muted text-xs flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-foreground">{s.studentName}</p>
                          <p className="text-muted-foreground font-semibold">Roll: {s.studentRoll} • {s.departmentName}</p>
                        </div>
                        <PaymentStatusBadge status={s.paymentStatus} />
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-muted-foreground text-center">No students match your query.</div>
                  )}
                </div>
              )}

              {}
              {selectedStudent ? (
                <div className="pt-4 border-t space-y-4 animate-in fade-in-50 duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{selectedStudent.studentName}</h3>
                      <p className="text-xs text-muted-foreground font-semibold">Roll: {selectedStudent.studentRoll}</p>
                      <p className="text-xs text-muted-foreground font-semibold">{selectedStudent.departmentName} • {selectedStudent.semesterName}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                      Clear
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2">
                    <div className="border rounded p-2 bg-muted/20">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Assigned</span>
                      <p className="text-xs font-bold text-foreground">
                        <AmountDisplay amount={selectedStudent.totalAssigned} />
                      </p>
                    </div>
                    <div className="border rounded p-2 bg-emerald-50/50 dark:bg-emerald-950/20">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Paid</span>
                      <p className="text-xs font-bold text-emerald-600">
                        <AmountDisplay amount={selectedStudent.totalPaid} />
                      </p>
                    </div>
                    <div className="border rounded p-2 bg-destructive/5 dark:bg-destructive/10">
                      <span className="text-[10px] font-bold text-destructive uppercase">Due</span>
                      <p className="text-xs font-bold text-destructive">
                        <AmountDisplay amount={selectedStudent.totalDue} />
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-md bg-muted/10">
                  Search and select a student to start collection process.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {}
        <div className="space-y-6 lg:col-span-2">
          {selectedStudent ? (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <Card className="border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Payment Log Entry</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(handleCollectPayment)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold">Select Billing Item / Fee</label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden"
                          {...register('feeStructureId')}
                        >
                          <option value="">Choose item...</option>
                          {mockFeeItems.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} (৳{item.amount})
                            </option>
                          ))}
                        </select>
                        {errors.feeStructureId && (
                          <span className="text-[10px] text-destructive">{errors.feeStructureId.message}</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold">Payment Amount (BDT)</label>
                        <Input type="number" step="0.01" error={errors.amount?.message} {...register('amount', { valueAsNumber: true })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold">Payment Date</label>
                        <Input type="date" error={errors.paymentDate?.message} {...register('paymentDate')} />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold">Payment Method</label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden"
                          {...register('paymentMethod')}
                        >
                          <option value="cash">Cash Counter</option>
                          <option value="bank">Bank Transfer / Deposit</option>
                          <option value="mobile_banking">Mobile Banking (bKash/Nagad)</option>
                        </select>
                        {errors.paymentMethod && (
                          <span className="text-[10px] text-destructive">{errors.paymentMethod.message}</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold">Transaction Reference / Remark (Optional)</label>
                      <Input placeholder="e.g. Bank scroll no, bkash trx ID, notes..." {...register('reference')} />
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <Button type="submit" isLoading={collectPaymentMutation.isPending}>
                        Confirm Payment Receipt
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Student Ledger Quickview */}
              <Card className="border shadow-xs">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Ledger & Transaction Log (Quickview)</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLedgerLoading ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">Loading ledger entries...</div>
                  ) : ledgerEntries.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="text-xs">Description</TableHead>
                          <TableHead className="text-xs text-right">Debit (+)</TableHead>
                          <TableHead className="text-xs text-right">Credit (-)</TableHead>
                          <TableHead className="text-xs text-right">Running Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ledgerEntries.map((entry) => (
                          <TableRow key={entry._id}>
                            <TableCell className="text-xs font-semibold">{entry.date}</TableCell>
                            <TableCell className="text-xs font-bold">{entry.description}</TableCell>
                            <TableCell className="text-xs text-right font-semibold">
                              {entry.debit > 0 ? <AmountDisplay amount={entry.debit} className="text-foreground" /> : '-'}
                            </TableCell>
                            <TableCell className="text-xs text-right font-semibold">
                              {entry.credit > 0 ? <AmountDisplay amount={entry.credit} className="text-emerald-600" /> : '-'}
                            </TableCell>
                            <TableCell className="text-xs text-right font-bold">
                              <AmountDisplay amount={entry.balance} className={entry.balance > 0 ? 'text-destructive' : 'text-muted-foreground'} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-xs text-muted-foreground">No ledger log matches found.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="border border-dashed rounded-lg p-12 text-center text-muted-foreground text-sm bg-card">
              No student selection is currently active. Search and choose a student profile from the sidebar panel.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
