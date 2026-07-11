import React from 'react';
import { Button } from '@/components/ui/button';
import { Department } from '@/types/admin/department.types';
import { Semester } from '@/types/admin/semester.types';
import Session from '@/types/admin/session.types';

interface ReportFilterBarProps {
  
  reportTypes?: { value: string; label: string }[];
  selectedReportType?: string;
  onReportTypeChange?: (val: string) => void;

  departments: Department[];
  selectedDept: string;
  onDeptChange: (val: string) => void;

  semesters: Semester[];
  selectedSem: string;
  onSemChange: (val: string) => void;

  // Sessions
  sessions: Session[];
  selectedSession: string;
  onSessionChange: (val: string) => void;

  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;

  onClear: () => void;
}

export function ReportFilterBar({
  reportTypes,
  selectedReportType,
  onReportTypeChange,
  departments,
  selectedDept,
  onDeptChange,
  semesters,
  selectedSem,
  onSemChange,
  sessions,
  selectedSession,
  onSessionChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClear,
}: ReportFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between border rounded-lg p-4 mb-6 bg-card">
      <div className="flex flex-wrap gap-4 items-center">
        {}
        {reportTypes && onReportTypeChange && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground">Report Type</span>
            <select
              value={selectedReportType}
              onChange={(e) => onReportTypeChange(e.target.value)}
              className="flex h-9 w-44 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-hidden"
            >
              {reportTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {}
        <div className="space-y-1">
          <span className="text-xs font-bold text-muted-foreground">Department</span>
          <select
            value={selectedDept}
            onChange={(e) => onDeptChange(e.target.value)}
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

        {}
        <div className="space-y-1">
          <span className="text-xs font-bold text-muted-foreground">Semester</span>
          <select
            value={selectedSem}
            onChange={(e) => onSemChange(e.target.value)}
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

        {/* Session */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-muted-foreground">Session</span>
          <select
            value={selectedSession}
            onChange={(e) => onSessionChange(e.target.value)}
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

        {}
        <div className="space-y-1">
          <span className="text-xs font-bold text-muted-foreground">Date Range</span>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="flex h-9 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-xs focus-visible:outline-hidden"
            />
            <span className="text-xs font-bold text-muted-foreground">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="flex h-9 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-xs focus-visible:outline-hidden"
            />
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={onClear} className="self-end">
        Reset
      </Button>
    </div>
  );
}
export default ReportFilterBar;
