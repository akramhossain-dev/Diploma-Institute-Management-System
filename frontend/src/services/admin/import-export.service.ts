import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { ImportJob } from '@/types/admin/import-export.types';

export const adminImportExportService = {
  getImportJobs: async (): Promise<ImportJob[]> => {
    const response = await adminAxios.get<ApiResponse<ImportJob[]>>('/import-export/jobs');
    return response.data.data;
  },

  triggerImport: async (module: 'students' | 'teachers' | 'accountants' | 'fees', file: File): Promise<ImportJob> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('module', module);

    const response = await adminAxios.post<ApiResponse<ImportJob>>(`/import-export/import/${module}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  triggerExport: async (module: string): Promise<Blob> => {
    const response = await adminAxios.get(`/import-export/export/${module}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default adminImportExportService;
