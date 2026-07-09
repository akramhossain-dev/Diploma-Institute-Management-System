import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { ImportJob } from '@/types/admin/import-export.types';

let mockImportJobs: ImportJob[] = [
  {
    _id: 'job-1',
    module: 'students',
    fileName: 'students_winter_2026.csv',
    status: 'completed',
    totalRecords: 120,
    processedRecords: 118,
    failedRecords: 2,
    errorLog: 'Row 14: Duplicate email "student14@dims.edu.bd"\nRow 37: Invalid date of birth format "May-1999"',
    startedAt: '2026-07-01T10:00:00Z',
    completedAt: '2026-07-01T10:00:45Z',
  },
  {
    _id: 'job-2',
    module: 'teachers',
    fileName: 'faculty_cst_dept.csv',
    status: 'completed',
    totalRecords: 15,
    processedRecords: 15,
    failedRecords: 0,
    startedAt: '2026-07-02T14:15:00Z',
    completedAt: '2026-07-02T14:15:10Z',
  },
  {
    _id: 'job-3',
    module: 'fees',
    fileName: 'semester_fees_sheet.csv',
    status: 'failed',
    totalRecords: 450,
    processedRecords: 0,
    failedRecords: 450,
    errorLog: 'Critical Error: Column header layout mismatch. Required columns: "invoice_id", "student_id", "amount", "due_date"',
    startedAt: '2026-07-05T09:30:00Z',
    completedAt: '2026-07-05T09:30:05Z',
  },
];

export const adminImportExportService = {
  getImportJobs: async (): Promise<ImportJob[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<ImportJob[]>>('/import-export/jobs');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /import-export/jobs failed. Falling back to mock database.');
      return [...mockImportJobs];
    }
  },

  triggerImport: async (module: 'students' | 'teachers' | 'accountants' | 'fees', file: File): Promise<ImportJob> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('module', module);

      const response = await adminAxios.post<ApiResponse<ImportJob>>(`/import-export/import/${module}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] POST /import-export/import/${module} failed. Creating a mock completed job.`);
      const newJob: ImportJob = {
        _id: 'job-gen-' + Math.random().toString(36).substring(2, 9),
        module,
        fileName: file.name,
        status: 'completed',
        totalRecords: 50,
        processedRecords: 48,
        failedRecords: 2,
        errorLog: 'Row 3: Address too long.\nRow 12: Missing phone number.',
        startedAt: new Date().toISOString(),
        completedAt: new Date(Date.now() + 5000).toISOString(),
      };
      mockImportJobs.unshift(newJob);
      return newJob;
    }
  },

  triggerExport: async (module: string): Promise<Blob> => {
    try {
      const response = await adminAxios.get(`/import-export/export/${module}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (e) {
      console.warn(`[Admin Service] GET /import-export/export/${module} failed. Simulating export payload download.`);
      // Return a simulated CSV blob
      const csvContent = `id,name,role,exported_at\n1,Demo Report Export,System,${new Date().toISOString()}`;
      return new Blob([csvContent], { type: 'text/csv' });
    }
  },
};

export default adminImportExportService;
