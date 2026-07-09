import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { UploadedFile } from '@/types/admin/file-manager.types';

let mockFiles: UploadedFile[] = [
  {
    _id: 'file-1',
    name: 'academic_calender_2026_v2.pdf',
    type: 'application/pdf',
    size: 2450000,
    uploadedBy: 'Super Admin',
    uploadDate: '2026-06-15T09:30:00Z',
    moduleRef: 'Notices',
    url: 'https://cdn.dims.edu.bd/uploads/academic_calender_2026_v2.pdf',
  },
  {
    _id: 'file-2',
    name: 'student_import_template.csv',
    type: 'text/csv',
    size: 15400,
    uploadedBy: 'Super Admin',
    uploadDate: '2026-07-01T14:22:15Z',
    moduleRef: 'Import/Export',
    url: 'https://cdn.dims.edu.bd/uploads/student_import_template.csv',
  },
  {
    _id: 'file-3',
    name: 'midterm_schedule_cst.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 452000,
    uploadedBy: 'Super Admin',
    uploadDate: '2026-07-05T11:00:00Z',
    moduleRef: 'Exams',
    url: 'https://cdn.dims.edu.bd/uploads/midterm_schedule_cst.docx',
  },
  {
    _id: 'file-4',
    name: 'institute_logo_dark.png',
    type: 'image/png',
    size: 180000,
    uploadedBy: 'Super Admin',
    uploadDate: '2026-01-01T08:00:00Z',
    moduleRef: 'Settings',
    url: 'https://cdn.dims.edu.bd/uploads/institute_logo_dark.png',
  },
];

export const adminFileManagerService = {
  getFiles: async (filters?: { search?: string; type?: string }): Promise<UploadedFile[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<UploadedFile[]>>('/files', { params: filters });
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /files failed. Falling back to mock database.');
      let filtered = [...mockFiles];
      if (filters) {
        if (filters.search) {
          const s = filters.search.toLowerCase();
          filtered = filtered.filter(f => f.name.toLowerCase().includes(s));
        }
        if (filters.type && filters.type !== 'all') {
          filtered = filtered.filter(f => {
            if (filters.type === 'pdf') return f.type.includes('pdf');
            if (filters.type === 'image') return f.type.includes('image');
            if (filters.type === 'csv') return f.type.includes('csv');
            if (filters.type === 'document') return f.type.includes('word') || f.type.includes('document');
            return true;
          });
        }
      }
      return filtered;
    }
  },

  deleteFile: async (id: string): Promise<boolean> => {
    try {
      await adminAxios.delete(`/files/${id}`);
      return true;
    } catch (e) {
      console.warn(`[Admin Service] DELETE /files/${id} failed. Modifying mock state.`);
      mockFiles = mockFiles.filter(f => f._id !== id);
      return true;
    }
  },

  uploadFile: async (file: File, moduleRef?: string): Promise<UploadedFile> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (moduleRef) formData.append('moduleRef', moduleRef);

      const response = await adminAxios.post<ApiResponse<UploadedFile>>('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /files/upload failed. Generating mock file entry.');
      const newFile: UploadedFile = {
        _id: 'file-gen-' + Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        uploadedBy: 'Super Admin',
        uploadDate: new Date().toISOString(),
        moduleRef: moduleRef || 'General',
        url: URL.createObjectURL(file), // create temporary preview link
      };
      mockFiles.unshift(newFile);
      return newFile;
    }
  },
};

export default adminFileManagerService;
