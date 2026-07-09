import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { UploadedFile } from '@/types/admin/file-manager.types';

export const adminFileManagerService = {
  getFiles: async (filters?: { search?: string; type?: string }): Promise<UploadedFile[]> => {
    const response = await adminAxios.get<ApiResponse<UploadedFile[]>>('/files', { params: filters });
    return response.data.data;
  },

  deleteFile: async (id: string): Promise<boolean> => {
    await adminAxios.delete(`/files/${id}`);
    return true;
  },

  uploadFile: async (file: File, moduleRef?: string): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append('file', file);
    if (moduleRef) formData.append('moduleRef', moduleRef);

    const response = await adminAxios.post<ApiResponse<UploadedFile>>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};

export default adminFileManagerService;
