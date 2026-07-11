'use client';

import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { ReportFilterBar } from '@/components/shared/filters/ReportFilterBar';
import { useAdminReports } from '@/hooks/admin/useAdminDashboard';
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import { useAdminSemesters } from '@/hooks/admin/useAdminSemesters';
import { useAdminSessions } from '@/hooks/admin/useAdminSessions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AmountDisplay } from '@/components/shared/finance/AmountDisplay';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminReportsPage() {
  
  const { data: departments = [] } = useAdminDepartments();
  const { data: semesters = [] } = useAdminSemesters();
  const { data: sessions = [] } = useAdminSessions();

  const { studentsQuery, attendanceQuery, financeQuery, isLoading } = useAdminReports();

  const [reportType, setReportType] = useState('student');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportTypes = [
    { value: 'student', label: 'Student Enrollment Report' },
    { value: 'attendance', label: 'Attendance Analysis Report' },
    { value: 'finance', label: 'Financial Transactions Report' },
  ];

  const handleClearFilters = () => {
    setSelectedDept('');
    setSelectedSem('');
    setSelectedSession('');
    setStartDate('');
    setEndDate('');
  };

  const filteredStudents = useMemo(() => {
    if (reportType !== 'student' || !studentsQuery.data) return [];
    return studentsQuery.data.filter((item) => {
      const matchDept = !selectedDept || item.departmentName === selectedDept;
      const matchSem = !selectedSem || item.semesterName === selectedSem;
      const matchStart = !startDate || new Date(item.admissionDate) >= new Date(startDate);
      const matchEnd = !endDate || new Date(item.admissionDate) <= new Date(endDate);
      return matchDept && matchSem && matchStart && matchEnd;
    });
  }, [studentsQuery.data, reportType, selectedDept, selectedSem, startDate, endDate]);

  const filteredAttendance = useMemo(() => {
    if (reportType !== 'attendance' || !attendanceQuery.data) return [];
    return attendanceQuery.data.filter((item) => {
      const matchDept = !selectedDept || item.departmentName === selectedDept;
      const matchSem = !selectedSem || item.semesterName === selectedSem;
      const matchStart = !startDate || new Date(item.date) >= new Date(startDate);
      const matchEnd = !endDate || new Date(item.date) <= new Date(endDate);
      return matchDept && matchSem && matchStart && matchEnd;
    });
  }, [attendanceQuery.data, reportType, selectedDept, selectedSem, startDate, endDate]);

  const filteredFinance = useMemo(() => {
    if (reportType !== 'finance' || !financeQuery.data) return [];
    return financeQuery.data.filter((item) => {
      const matchStart = !startDate || new Date(item.date) >= new Date(startDate);
      const matchEnd = !endDate || new Date(item.date) <= new Date(endDate);
      return matchStart && matchEnd;
    });
  }, [financeQuery.data, reportType, startDate, endDate]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Institute Operational Reports"
        description="Run query listings, compile student enrollment reports, examine class attendances, and download ledger transactions logs."
        action={
          <Button onClick={handlePrint} variant="outline" className="print:hidden">
            Print / Save PDF
          </Button>
        }
      />

      {}
      <div className="print:hidden">
        <ReportFilterBar
          reportTypes={reportTypes}
          selectedReportType={reportType}
          onReportTypeChange={setReportType}
          departments={departments}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
          semesters={semesters}
          selectedSem={selectedSem}
          onSemChange={setSelectedSem}
          sessions={sessions}
          selectedSession={selectedSession}
          onSessionChange={setSelectedSession}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onClear={handleClearFilters}
        />
      </div>

      {}
      <Card className="border shadow-md">
        <CardContent className="pt-6">
          <div className="text-center mb-6 hidden print:block">
            <h2 className="text-xl font-bold uppercase">Diploma Institute Management System</h2>
            <p className="text-sm font-semibold text-muted-foreground">{reportTypes.find(r => r.value === reportType)?.label}</p>
            {startDate && endDate && (
              <p className="text-xs text-muted-foreground mt-1">Period: {startDate} to {endDate}</p>
            )}
            <hr className="my-4 border-2" />
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <>
              {}
              {reportType === 'student' && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Roll No</TableHead>
                        <TableHead className="text-xs">Student Full Name</TableHead>
                        <TableHead className="text-xs">Department Technology</TableHead>
                        <TableHead className="text-xs">Semester</TableHead>
                        <TableHead className="text-xs">Admission Date</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-xs font-bold text-foreground">{row.studentRoll}</TableCell>
                            <TableCell className="text-xs font-bold">{row.fullName}</TableCell>
                            <TableCell className="text-xs font-semibold text-muted-foreground">{row.departmentName}</TableCell>
                            <TableCell className="text-xs font-semibold text-muted-foreground">{row.semesterName}</TableCell>
                            <TableCell className="text-xs font-semibold text-muted-foreground">{row.admissionDate}</TableCell>
                            <TableCell className="text-xs capitalize font-bold text-emerald-600">{row.status}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                            No students match the selected filter parameters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {}
              {reportType === 'attendance' && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Session Date</TableHead>
                        <TableHead className="text-xs">Technology Department</TableHead>
                        <TableHead className="text-xs">Semester</TableHead>
                        <TableHead className="text-xs text-right">Present Count</TableHead>
                        <TableHead className="text-xs text-right">Absent Count</TableHead>
                        <TableHead className="text-xs text-right">Attendance Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttendance.length > 0 ? (
                        filteredAttendance.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-xs font-bold text-foreground">{row.date}</TableCell>
                            <TableCell className="text-xs font-semibold text-muted-foreground">{row.departmentName}</TableCell>
                            <TableCell className="text-xs font-semibold text-muted-foreground">{row.semesterName}</TableCell>
                            <TableCell className="text-xs text-right font-semibold text-foreground">{row.totalPresent}</TableCell>
                            <TableCell className="text-xs text-right font-semibold text-foreground">{row.totalAbsent}</TableCell>
                            <TableCell className="text-xs text-right font-bold text-emerald-600">{row.percentage}%</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                            No attendance history matching these filter coordinates.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {}
              {reportType === 'finance' && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Payment Date</TableHead>
                        <TableHead className="text-xs">Student Name</TableHead>
                        <TableHead className="text-xs">Assigned Fee Item</TableHead>
                        <TableHead className="text-xs">Payment Method</TableHead>
                        <TableHead className="text-xs">Reference Remark</TableHead>
                        <TableHead className="text-xs text-right">Amount Received</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFinance.length > 0 ? (
                        filteredFinance.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-xs font-bold text-foreground">{row.date}</TableCell>
                            <TableCell className="text-xs font-bold">{row.studentName}</TableCell>
                            <TableCell className="text-xs font-semibold text-muted-foreground">{row.feeTitle}</TableCell>
                            <TableCell className="text-xs capitalize font-semibold">{row.paymentMethod.replace('_', ' ')}</TableCell>
                            <TableCell className="text-xs font-semibold text-muted-foreground">{row.reference || 'N/A'}</TableCell>
                            <TableCell className="text-xs text-right font-bold text-emerald-600">
                              <AmountDisplay amount={row.amount} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                            No financial receipts found matching these parameters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
