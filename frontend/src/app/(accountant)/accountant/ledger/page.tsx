'use client';

import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAccountantFees } from '@/hooks/accountant/useAccountantFees';
import { useStudentLedger } from '@/hooks/accountant/useStudentLedger';
import { StudentBillingOverview } from '@/types/accountant/payment.types';
import { AmountDisplay } from '@/components/shared/finance/AmountDisplay';
import { PaymentStatusBadge } from '@/components/shared/finance/PaymentStatusBadge';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';

export default function AccountantLedgerPage() {
  const { data: studentsOverview = [] } = useAccountantFees();

  const [selectedStudent, setSelectedStudent] = useState<StudentBillingOverview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch ledger
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

  const handleSelectStudent = (student: StudentBillingOverview) => {
    setSelectedStudent(student);
    setSearchQuery(''); 
  };

  // Filter ledger entries by date range
  const filteredLedger = useMemo(() => {
    return ledgerEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      if (startDate && entryDate < new Date(startDate)) return false;
      if (endDate && entryDate > new Date(endDate)) return false;
      return true;
    });
  }, [ledgerEntries, startDate, endDate]);

  return (
    <PageContainer>
      <SectionHeader
        title="Student Financial Ledgers"
        description="Select a student to audit detailed debits, credits, adjustments, and run audit histories."
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Student Audit Search</CardTitle>
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
                    <div className="p-3 text-xs text-muted-foreground text-center">No matching students.</div>
                  )}
                </div>
              )}

              {}
              {selectedStudent ? (
                <div className="pt-4 border-t space-y-3 animate-in fade-in-50 duration-200">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{selectedStudent.studentName}</h3>
                    <p className="text-xs text-muted-foreground font-semibold">Roll: {selectedStudent.studentRoll}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{selectedStudent.departmentName}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{selectedStudent.semesterName} • {selectedStudent.sessionName}</p>
                  </div>
                  <div className="border rounded-md p-3 bg-muted/20 space-y-2 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground font-semibold">Assigned Total:</span>
                      <AmountDisplay amount={selectedStudent.totalAssigned} />
                    </div>
                    <div className="flex justify-between font-bold text-emerald-600">
                      <span className="text-muted-foreground font-semibold">Total Paid:</span>
                      <AmountDisplay amount={selectedStudent.totalPaid} />
                    </div>
                    <div className="flex justify-between font-bold text-destructive">
                      <span className="text-muted-foreground font-semibold">Net Outstanding:</span>
                      <AmountDisplay amount={selectedStudent.totalDue} />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedStudent(null)}>
                    Clear Selection
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-md bg-muted/10">
                  Search and click on a student to examine ledger.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Ledger Sheet area */}
        <div className="space-y-6 lg:col-span-3">
          {selectedStudent ? (
            <Card className="border shadow-xs animate-in fade-in-50 duration-300">
              <CardHeader className="pb-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-semibold">Ledger Statement</CardTitle>
                  <p className="text-xs text-muted-foreground font-semibold">Statement of accounts for student ID: {selectedStudent.studentId}</p>
                </div>
                {/* Ledger Date filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">From</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="flex h-8 rounded-md border border-input bg-background px-2 text-xs shadow-xs focus-visible:outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">To</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex h-8 rounded-md border border-input bg-background px-2 text-xs shadow-xs focus-visible:outline-hidden"
                    />
                  </div>
                  {(startDate || endDate) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="h-8 text-xs"
                    >
                      Clear Range
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isLedgerLoading ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">Loading ledger history sheets...</div>
                ) : filteredLedger.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Transaction Date</TableHead>
                        <TableHead className="text-xs">Description / Details</TableHead>
                        <TableHead className="text-xs text-right">Debit (Charge)</TableHead>
                        <TableHead className="text-xs text-right">Credit (Payment)</TableHead>
                        <TableHead className="text-xs text-right">Outstanding Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLedger.map((entry) => (
                        <TableRow key={entry._id}>
                          <TableCell className="text-xs font-bold">{entry.date}</TableCell>
                          <TableCell className="text-xs font-semibold">{entry.description}</TableCell>
                          <TableCell className="text-xs text-right font-semibold">
                            {entry.debit > 0 ? <AmountDisplay amount={entry.debit} /> : '-'}
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
                  <div className="text-center py-12 text-xs text-muted-foreground bg-muted/5 border rounded-lg">
                    No transactions recorded matching the selected filter range.
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="border border-dashed rounded-lg p-16 text-center text-muted-foreground text-sm bg-card">
              Please select a student profile from the sidebar to review detailed ledger statements.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
