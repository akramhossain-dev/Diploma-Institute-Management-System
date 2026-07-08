import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AdminNotice, CreateNoticeInput, UpdateNoticeInput } from '@/types/admin/notice-admin.types';

let mockNotices: AdminNotice[] = [
  {
    _id: 'n-1',
    title: 'Online Admission Application Deadline Extended',
    content: 'The deadline for submitting online admission applications for the upcoming 2026-2027 academic session has been extended to August 15th, 2026.',
    category: 'admission',
    publishDate: '2026-07-08',
    status: 'published',
    targetAudience: 'all',
    createdAt: '2026-07-08T00:00:00Z',
  },
  {
    _id: 'n-2',
    title: 'Semester Final Examinations Schedule Released',
    content: 'The final examinations schedule for semesters 2, 4, 6, and 8 has been published.',
    category: 'exam',
    publishDate: '2026-07-01',
    status: 'published',
    targetAudience: 'students',
    attachmentUrl: '/dummy_exam_schedule.pdf',
    createdAt: '2026-07-01T00:00:00Z',
  },
];

export const adminNoticeService = {
  getNotices: async (): Promise<AdminNotice[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<AdminNotice[]>>('/notices');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /notices failed. Falling back to mock data.');
      return [...mockNotices];
    }
  },

  getNotice: async (id: string): Promise<AdminNotice> => {
    try {
      const response = await adminAxios.get<ApiResponse<AdminNotice>>(`/notices/${id}`);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] GET /notices/${id} failed. Searching mock database.`);
      const match = mockNotices.find(n => n._id === id);
      if (!match) throw new Error('Notice circular not found.');
      return match;
    }
  },

  createNotice: async (data: CreateNoticeInput): Promise<AdminNotice> => {
    try {
      const response = await adminAxios.post<ApiResponse<AdminNotice>>('/notices', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /notices failed. Saving to mock database.');
      const newNotice: AdminNotice = {
        _id: 'n-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        publishDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
      mockNotices.unshift(newNotice);
      return newNotice;
    }
  },

  updateNotice: async (id: string, data: UpdateNoticeInput): Promise<AdminNotice> => {
    try {
      const response = await adminAxios.put<ApiResponse<AdminNotice>>(`/notices/${id}`, data);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PUT /notices/${id} failed. Saving to mock database.`);
      const index = mockNotices.findIndex(n => n._id === id);
      if (index === -1) throw new Error('Notice not found');
      const updated = { ...mockNotices[index], ...data };
      mockNotices[index] = updated as AdminNotice;
      return updated as AdminNotice;
    }
  },

  deleteNotice: async (id: string): Promise<void> => {
    try {
      await adminAxios.delete<ApiResponse<null>>(`/notices/${id}`);
    } catch (e) {
      console.warn(`[Admin Service] DELETE /notices/${id} failed. Deleting from mock database.`);
      mockNotices = mockNotices.filter(n => n._id !== id);
    }
  },
};
export default adminNoticeService;
