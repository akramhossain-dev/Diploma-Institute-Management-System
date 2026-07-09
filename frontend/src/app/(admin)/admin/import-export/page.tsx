'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useImportExport } from '@/hooks/admin/useImportExport';
import { TableSkeleton } from '@/components/shared/feedback/Skeletons';
import { ErrorState } from '@/components/shared/feedback/ErrorState';
import { EmptyState } from '@/components/shared/feedback/EmptyState';
import { StatusBadge } from '@/components/shared/feedback/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { ImportJob } from '@/types/admin/import-export.types';

export default function AdminImportExportPage() {
  const {
    jobs = [],
    isLoading,
    isError,
    refetchJobs,
    triggerImport,
    isImporting,
    triggerExport,
    isExporting,
  } = useImportExport();

  const [activeUploadModule, setActiveUploadModule] = React.useState<'students' | 'teachers' | 'accountants' | 'fees' | null>(null);
  const [selectedJobError, setSelectedJobError] = React.useState<ImportJob | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (isLoading && jobs.length === 0) {
    return (
      <PageContainer>
        <SectionHeader title="Bulk Data Import & Export" description="Loading data manager..." />
        <TableSkeleton rows={4} />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <SectionHeader title="Bulk Data Import & Export" description="Process administrative registers in bulk." />
        <ErrorState message="Failed to connect to data management services. Retrying..." onRetry={refetchJobs} />
      </PageContainer>
    );
  }

  const handleUploadClick = (module: 'students' | 'teachers' | 'accountants' | 'fees') => {
    setActiveUploadModule(module);
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && activeUploadModule) {
      const file = e.target.files[0];
      try {
        await triggerImport({ module: activeUploadModule, file });
        alert(`Successfully queued CSV sheet "${file.name}" for import.`);
      } catch (err) {
        console.error('Import failed:', err);
      } finally {
        setActiveUploadModule(null);
      }
    }
  };

  const handleExportClick = async (module: string) => {
    try {
      const blob = await triggerExport(module);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dims_export_${module}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const importModules = [
    {
      id: 'students' as const,
      title: 'Import Student Directory',
      desc: 'Bulk enroll students by uploading CSV files with columns for name, semester, DOB, and department.',
      icon: 'Users',
    },
    {
      id: 'teachers' as const,
      title: 'Import Teachers List',
      desc: 'Bulk register course teachers, configuring technical designations and department allocations.',
      icon: 'GraduationCap',
    },
    {
      id: 'accountants' as const,
      title: 'Import Accountants List',
      desc: 'Bulk configure operational ledger access for accountant staff profiles.',
      icon: 'Building',
    },
    {
      id: 'fees' as const,
      title: 'Import Billing Ledger',
      desc: 'Import student due structures and fees mappings directly from CSV bank statement templates.',
      icon: 'Receipt',
    },
  ];

  const exportModules = [
    {
      id: 'students_report',
      title: 'Student General Report',
      desc: 'Download compiled active student profiles, semester roll listings, and registration dates.',
      icon: 'FileSpreadsheet',
    },
    {
      id: 'attendance_log',
      title: 'Attendance Records',
      desc: 'Download attendance spreadsheets filtered by active technologies and departments.',
      icon: 'CalendarCheck',
    },
    {
      id: 'finance_summary',
      title: 'Financial Statements',
      desc: 'Download collection statistics, outstanding student ledger totals, and receipt details.',
      icon: 'DollarSign',
    },
    {
      id: 'result_ledger',
      title: 'Academic Grade Register',
      desc: 'Download class mid/final marks sheets and GPA reports in bulk.',
      icon: 'Award',
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Bulk Data Import & Export"
        description="Trigger bulk spreadsheet uploads or download raw administrative reports."
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* CSV Import Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
              <LucideIcon name="Upload" size={16} className="text-primary" />
              Bulk Data Import Pipelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {importModules.map((mod) => (
                <Card key={mod.id} className="border shadow-xs hover:shadow-md transition-all bg-card/70 backdrop-blur-xs flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold flex items-center gap-2 text-foreground">
                      <div className="p-1 rounded bg-primary/10 text-primary">
                        <LucideIcon name={mod.icon} size={15} />
                      </div>
                      {mod.title}
                    </CardTitle>
                    <CardDescription className="text-[10px] leading-relaxed mt-1">
                      {mod.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-bold"
                      onClick={() => handleUploadClick(mod.id)}
                      disabled={isImporting}
                    >
                      <LucideIcon name="UploadCloud" size={14} className="mr-1.5" />
                      Upload CSV Sheet
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Data Export Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
              <LucideIcon name="Download" size={16} className="text-primary" />
              Bulk Report Export Exports
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exportModules.map((mod) => (
                <Card key={mod.id} className="border shadow-xs hover:shadow-md transition-all bg-card/70 backdrop-blur-xs flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold flex items-center gap-2 text-foreground">
                      <div className="p-1 rounded bg-secondary/15 text-foreground">
                        <LucideIcon name={mod.icon} size={15} />
                      </div>
                      {mod.title}
                    </CardTitle>
                    <CardDescription className="text-[10px] leading-relaxed mt-1">
                      {mod.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full text-xs font-bold"
                      onClick={() => handleExportClick(mod.id)}
                      disabled={isExporting}
                    >
                      <LucideIcon name="FileDown" size={14} className="mr-1.5" />
                      Export Spreadsheet
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Import Activity Log Tracker */}
      <div>
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-4">
          <LucideIcon name="History" size={16} className="text-primary" />
          Bulk Import Job Activity Log
        </h2>
        {jobs.length === 0 ? (
          <EmptyState
            title="No Import Logs Found"
            description="You have not triggered any CSV sheet uploads during this session."
            icon={<LucideIcon name="Inbox" size={32} />}
          />
        ) : (
          <Card className="border shadow-md rounded-xl overflow-hidden bg-card/85 backdrop-blur-md">
            <Table>
              <TableHeader className="bg-muted/15 border-b">
                <TableRow>
                  <TableHead className="text-xs font-bold">Uploaded File</TableHead>
                  <TableHead className="text-xs font-bold">Target Module</TableHead>
                  <TableHead className="text-xs font-bold">Job Status</TableHead>
                  <TableHead className="text-xs font-bold text-center">Progress Indicators</TableHead>
                  <TableHead className="text-xs font-bold">Started At</TableHead>
                  <TableHead className="text-xs font-bold">Completed At</TableHead>
                  <TableHead className="text-xs font-bold text-center w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-bold text-xs text-foreground py-4">
                      {job.fileName}
                    </TableCell>
                    <TableCell className="text-xs capitalize font-semibold">
                      {job.module}
                    </TableCell>
                    <TableCell className="text-xs">
                      <StatusBadge status={job.status} />
                    </TableCell>
                    <TableCell className="text-xs text-center font-bold text-muted-foreground">
                      {job.status === 'failed' ? (
                        <span className="text-destructive">Failed ({job.failedRecords} records)</span>
                      ) : (
                        <span>
                          {job.processedRecords} / {job.totalRecords} imported
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-muted-foreground">
                      {new Date(job.startedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-muted-foreground">
                      {job.completedAt ? new Date(job.completedAt).toLocaleString() : 'Processing...'}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center justify-center">
                        {job.errorLog ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs font-bold text-destructive hover:bg-destructive/10"
                            onClick={() => setSelectedJobError(job)}
                          >
                            <LucideIcon name="FileWarning" size={13} className="mr-1" />
                            View Logs
                          </Button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground font-semibold">No errors</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Error Log Dialog */}
      {selectedJobError && (
        <Dialog open={!!selectedJobError} onOpenChange={() => setSelectedJobError(null)}>
          <DialogContent onClose={() => setSelectedJobError(null)} className="max-w-2xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-md text-destructive">
                <LucideIcon name="AlertTriangle" size={20} />
                Bulk Import Error Trail Logs
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs truncate max-w-[420px] font-bold">
                Errors found while importing: {selectedJobError.fileName}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3.5 border-y my-2 text-xs leading-relaxed max-h-[300px] overflow-y-auto">
              <div className="flex justify-between font-bold border-b pb-2">
                <span className="text-muted-foreground">Module:</span>
                <span className="text-foreground capitalize">{selectedJobError.module}</span>
              </div>
              <div className="flex justify-between font-bold border-b pb-2">
                <span className="text-muted-foreground">Total records in CSV:</span>
                <span className="text-foreground">{selectedJobError.totalRecords}</span>
              </div>
              <div className="flex justify-between font-bold border-b pb-2">
                <span className="text-muted-foreground">Successfully processed:</span>
                <span className="text-emerald-500">{selectedJobError.processedRecords}</span>
              </div>
              <div className="flex justify-between font-bold border-b pb-2">
                <span className="text-muted-foreground">Rejected / Failed count:</span>
                <span className="text-rose-500">{selectedJobError.failedRecords}</span>
              </div>

              <div className="space-y-2 pt-2">
                <span className="block font-bold text-muted-foreground">Rejection description stack:</span>
                <div className="rounded-lg bg-red-950 p-4 border border-red-900 text-red-100 font-mono text-[10px] whitespace-pre-wrap leading-loose">
                  {selectedJobError.errorLog}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => setSelectedJobError(null)} className="shadow-xs font-semibold">
                Dismiss Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}
