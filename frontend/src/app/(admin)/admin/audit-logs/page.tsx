'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useAuditLogs } from '@/hooks/admin/useAuditLogs';
import { TableSkeleton } from '@/components/shared/feedback/Skeletons';
import { ErrorState } from '@/components/shared/feedback/ErrorState';
import { EmptyState } from '@/components/shared/feedback/EmptyState';
import { StatusBadge } from '@/components/shared/feedback/StatusBadge';
import { ActionToolbar } from '@/components/shared/layout/ActionToolbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { AuditLog } from '@/types/admin/audit-log.types';

export default function AdminAuditLogsPage() {
  const [search, setSearch] = React.useState('');
  const [actorType, setActorType] = React.useState('all');
  const [moduleFilter, setModuleFilter] = React.useState('all');
  const [actionFilter, setActionFilter] = React.useState('all');

  const {
    data: logs = [],
    isLoading,
    isError,
    refetch,
  } = useAuditLogs({
    search,
    actorType,
    module: moduleFilter,
    action: actionFilter,
  });

  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);

  if (isLoading && logs.length === 0) {
    return (
      <PageContainer>
        <SectionHeader title="Operational Audit Logs" description="Loading system audit entries..." />
        <TableSkeleton rows={6} />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <SectionHeader title="Operational Audit Logs" description="Review system operations log registry." />
        <ErrorState message="Failed to fetch audit log records. Check server connection." onRetry={refetch} />
      </PageContainer>
    );
  }

  const actorTypesList = ['all', 'admin', 'teacher', 'student', 'accountant', 'system'];
  const modulesList = ['all', 'User Management', 'Finance Management', 'Notice Board', 'Exam & Result System'];
  const actionsList = ['all', 'CREATE_STUDENT', 'UPDATE_FEES', 'PUBLISH_NOTICE', 'SUBMIT_MARKS'];

  return (
    <PageContainer>
      <SectionHeader
        title="Operational Audit Logs"
        description="Inspect details of actions, target modules, actor profiles, IP sources, and database update payloads."
      />

      <ActionToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search logs by actor name, identifier, target..."
        filterContent={
          <div className="flex flex-wrap items-center gap-3">
            {}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground font-bold uppercase select-none">Actor Role</span>
              <select
                value={actorType}
                onChange={(e) => setActorType(e.target.value)}
                className="h-8 border rounded-md text-xs px-2 bg-background font-semibold"
              >
                {actorTypesList.map((type) => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground font-bold uppercase select-none">Target Module</span>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="h-8 border rounded-md text-xs px-2 bg-background font-semibold"
              >
                {modulesList.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod === 'all' ? 'ALL MODULES' : mod}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground font-bold uppercase select-none">Action Logged</span>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="h-8 border rounded-md text-xs px-2 bg-background font-semibold"
              >
                {actionsList.map((act) => (
                  <option key={act} value={act}>
                    {act === 'all' ? 'ALL ACTIONS' : act}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
      />

      {logs.length === 0 ? (
        <EmptyState
          title="No Logs Recorded"
          description="We couldn't find any audit trails matching your active parameters."
          icon={<LucideIcon name="History" size={32} />}
        />
      ) : (
        <Card className="border shadow-md rounded-xl overflow-hidden bg-card/85 backdrop-blur-md">
          <Table>
            <TableHeader className="bg-muted/15 border-b">
              <TableRow>
                <TableHead className="text-xs font-bold w-[160px]">Action</TableHead>
                <TableHead className="text-xs font-bold w-[120px]">Actor Role</TableHead>
                <TableHead className="text-xs font-bold">Actor Name</TableHead>
                <TableHead className="text-xs font-bold">Target Module</TableHead>
                <TableHead className="text-xs font-bold">Affected Entity</TableHead>
                <TableHead className="text-xs font-bold">Timestamp</TableHead>
                <TableHead className="text-xs font-bold text-center w-[90px]">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-bold text-xs text-foreground py-4">
                    <span className="font-mono bg-muted/60 text-foreground px-2 py-1 rounded text-[10px] border border-muted">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">
                    <StatusBadge status={log.actorType} />
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{log.actorName}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold font-mono">{log.actorIdentifier}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-muted-foreground">
                    {log.targetModule}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground max-w-[150px] truncate">
                    {log.targetEntity}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedLog(log)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="View payload log details"
                      >
                        <LucideIcon name="Layers" size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent onClose={() => setSelectedLog(null)} className="max-w-2xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-md">
                <LucideIcon name="History" className="text-primary" size={20} />
                Audit Trail Detail
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs">
                Review metadata payload associated with ID: <span className="font-mono font-bold text-foreground">{selectedLog._id}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 border-y my-2 text-xs leading-relaxed max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="block font-bold text-muted-foreground">Action Logged</span>
                  <span className="inline-block font-mono bg-muted/60 text-foreground px-2 py-0.5 rounded text-[10px] border border-muted font-bold">
                    {selectedLog.action}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block font-bold text-muted-foreground">Timestamp</span>
                  <span className="font-semibold text-foreground">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <span className="block font-bold text-muted-foreground">Actor Profile</span>
                  <span className="font-bold text-foreground">{selectedLog.actorName} ({selectedLog.actorType.toUpperCase()})</span>
                </div>
                <div className="space-y-1">
                  <span className="block font-bold text-muted-foreground">Actor Identifier</span>
                  <span className="font-semibold font-mono text-muted-foreground">{selectedLog.actorIdentifier}</span>
                </div>
                <div className="space-y-1">
                  <span className="block font-bold text-muted-foreground">Scope Module</span>
                  <span className="font-semibold text-foreground">{selectedLog.targetModule}</span>
                </div>
                <div className="space-y-1">
                  <span className="block font-bold text-muted-foreground">Affected Record</span>
                  <span className="font-bold text-primary">{selectedLog.targetEntity}</span>
                </div>
              </div>

              {selectedLog.metadata && (
                <div className="space-y-2 pt-2">
                  <span className="block font-bold text-muted-foreground border-b pb-1">Trace metadata JSON</span>
                  <div className="rounded-lg bg-slate-900 dark:bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-[10px] overflow-x-auto whitespace-pre">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-4 flex justify-end">
              <Button size="sm" onClick={() => setSelectedLog(null)} className="shadow-xs font-semibold">
                Close Detail
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PageContainer>
  );
}
