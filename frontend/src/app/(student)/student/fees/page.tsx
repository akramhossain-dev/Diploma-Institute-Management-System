'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStudentFees, useStudentPaymentHistory, useStudentFeeSummary } from '@/hooks/student/useStudentFees';
import { AmountDisplay } from '@/components/shared/finance/AmountDisplay';
import { PaymentStatusBadge } from '@/components/shared/finance/PaymentStatusBadge';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentFeesPage() {
  const { data: summary, isLoading: isSummaryLoading } = useStudentFeeSummary();
  const { data: fees = [], isLoading: isFeesLoading } = useStudentFees();
  const { data: payments = [], isLoading: isPaymentsLoading } = useStudentPaymentHistory();

  return (
    <PageContainer>
      <SectionHeader
        title="My Financial Overview"
        description="Verify assigned fees, monitor outstanding dues, and check payment history records."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {isSummaryLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))
        ) : summary ? (
          <>
            <Card className="border shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Fees Assigned</CardTitle>
              </CardHeader>
              <CardContent>
                <AmountDisplay amount={summary.totalAssigned} className="text-2xl font-bold text-foreground" />
              </CardContent>
            </Card>
            <Card className="border shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Paid Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <AmountDisplay amount={summary.totalPaid} className="text-2xl font-bold text-emerald-600" />
              </CardContent>
            </Card>
            <Card className="border shadow-xs animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Due / Outstanding</CardTitle>
              </CardHeader>
              <CardContent>
                <AmountDisplay amount={summary.totalDue} className="text-2xl font-bold text-destructive" />
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="col-span-3 text-center text-xs text-muted-foreground">Failed to load billing metrics.</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Assigned Fees */}
        <div className="space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-sm font-bold text-foreground">Assigned Fee Schedules</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isFeesLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : fees.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Fee Item Name</TableHead>
                      <TableHead className="text-xs text-right">Assigned</TableHead>
                      <TableHead className="text-xs text-right">Paid</TableHead>
                      <TableHead className="text-xs text-right">Remaining Due</TableHead>
                      <TableHead className="text-xs text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fees.map((fee) => (
                      <TableRow key={fee._id}>
                        <TableCell className="text-xs font-bold text-foreground">{fee.name}</TableCell>
                        <TableCell className="text-xs text-right font-semibold">
                          <AmountDisplay amount={fee.amount} />
                        </TableCell>
                        <TableCell className="text-xs text-right font-semibold text-emerald-600">
                          <AmountDisplay amount={fee.paidAmount} />
                        </TableCell>
                        <TableCell className="text-xs text-right font-semibold text-destructive">
                          <AmountDisplay amount={fee.dueAmount} />
                        </TableCell>
                        <TableCell className="text-center">
                          <PaymentStatusBadge status={fee.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-xs text-muted-foreground">No assigned academic fees recorded.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Payment History Log */}
        <div className="space-y-6">
          <Card className="border shadow-md">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-sm font-bold text-foreground">Payment History Logs</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isPaymentsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : payments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs text-right">Received Amount</TableHead>
                      <TableHead className="text-xs">Payment Method</TableHead>
                      <TableHead className="text-xs">Reference Remark</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((pay) => (
                      <TableRow key={pay._id}>
                        <TableCell className="text-xs font-semibold">{pay.paymentDate}</TableCell>
                        <TableCell className="text-xs text-right font-bold text-emerald-600">
                          <AmountDisplay amount={pay.amount} />
                        </TableCell>
                        <TableCell className="text-xs capitalize font-semibold">{pay.paymentMethod.replace('_', ' ')}</TableCell>
                        <TableCell className="text-xs font-semibold text-muted-foreground">{pay.reference || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-xs text-muted-foreground">No recent payments transactions found.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
