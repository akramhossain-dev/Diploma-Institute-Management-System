import { publicAxios } from '@/lib/publicAxios';
import { PaginatedResponse } from '@/types/shared/api.types';

export interface NoticeInfo {
  _id: string;
  title: string;
  content: string;
  category: 'general' | 'admission' | 'exam' | 'holiday';
  publishDate: string;
  attachmentUrl?: string;
}

const fallbackNotices: NoticeInfo[] = [
  {
    _id: 'n-1',
    title: 'Online Admission Application Deadline Extended',
    content: 'The deadline for submitting online admission applications for the upcoming 2026-2027 academic session has been extended to August 15th, 2026. Applicants must submit certificates and transcripts online before the portal closes.',
    category: 'admission',
    publishDate: '2026-07-08',
  },
  {
    _id: 'n-2',
    title: 'Semester Final Examinations Schedule Released',
    content: 'The final examinations schedule for semesters 2, 4, 6, and 8 has been published. Students can download schedules from the notice page or verify them on their portals.',
    category: 'exam',
    publishDate: '2026-07-01',
    attachmentUrl: '/dummy_exam_schedule.pdf',
  },
  {
    _id: 'n-3',
    title: 'Summer Vacation Break Announcement',
    content: 'The institute will remain closed from July 15th to July 25th on account of the annual summer vacation. Classes will resume according to regular schedules on July 26th.',
    category: 'holiday',
    publishDate: '2026-06-25',
  },
];

export const noticeService = {
  getNotices: async (params?: { page?: number; limit?: number; search?: string; category?: string }): Promise<PaginatedResponse<NoticeInfo>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category) queryParams.append('category', params.category);

      const response = await publicAxios.get<PaginatedResponse<NoticeInfo>>(`/notices/public?${queryParams.toString()}`);
      return response.data;
    } catch {
      console.warn('[Public Service] /notices failed. Falling back to mock data.');
      let data = [...fallbackNotices];
      
      if (params?.search) {
        data = data.filter(n => n.title.toLowerCase().includes(params.search!.toLowerCase()) || n.content.toLowerCase().includes(params.search!.toLowerCase()));
      }
      if (params?.category) {
        data = data.filter(n => n.category === params.category);
      }

      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const total = data.length;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: 'Notices retrieved successfully',
        data: data.slice((page - 1) * limit, page * limit),
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    }
  },
};
export default noticeService;
