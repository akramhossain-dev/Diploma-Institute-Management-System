import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AdminNotice, CreateNoticeInput, UpdateNoticeInput } from '@/types/admin/notice-admin.types';

export const adminNoticeService = {
  getNotices: async (): Promise<AdminNotice[]> => {
    const response = await adminAxios.get<ApiResponse<AdminNotice[]>>('/notices');
    return response.data.data;
  },

  getNotice: async (id: string): Promise<AdminNotice> => {
    const response = await adminAxios.get<ApiResponse<AdminNotice>>(`/notices/${id}`);
    return response.data.data;
  },

  createNotice: async (data: CreateNoticeInput): Promise<AdminNotice> => {
    const response = await adminAxios.post<ApiResponse<AdminNotice>>('/notices', data);
    return response.data.data;
  },

  updateNotice: async (id: string, data: UpdateNoticeInput): Promise<AdminNotice> => {
    const response = await adminAxios.put<ApiResponse<AdminNotice>>(`/notices/${id}`, data);
    return response.data.data;
  },

  deleteNotice: async (id: string): Promise<void> => {
    await adminAxios.delete<ApiResponse<null>>(`/notices/${id}`);
  },
};
export default adminNoticeService;
