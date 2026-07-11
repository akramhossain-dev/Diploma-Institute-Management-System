import { teacherAxios } from '@/lib/teacherAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Notification } from '@/types/shared/notifications.types';

let mockNotifications: Notification[] = [
  {
    _id: 'not-tc-1',
    title: 'Midterm Marks Deadline',
    message: 'Please finalize and submit student marksheets for Course CST-501 (Microprocessors) Midterm exam by 2026-07-15.',
    type: 'warning',
    createdAt: '2026-07-09T09:30:00Z',
    read: false,
    targetLink: '/teacher/exams', 
  },
  {
    _id: 'not-tc-2',
    title: 'Course Routine Updated',
    message: 'The class schedule for your course CST-503 (Database Systems) on Tuesday has been adjusted. New slot: 11:30 AM - 01:00 PM.',
    type: 'info',
    createdAt: '2026-07-08T11:00:00Z',
    read: false,
    targetLink: '/teacher/dashboard',
  },
  {
    _id: 'not-tc-3',
    title: 'Attendance Submission Pending',
    message: 'You have not submitted the class attendance roster for CST-501 class on 2026-07-08.',
    type: 'error',
    createdAt: '2026-07-08T17:00:00Z',
    read: true,
    targetLink: '/teacher/attendance',
  },
  {
    _id: 'not-tc-4',
    title: 'Circular Notice: Exam Code of Conduct',
    message: 'Academic department has published guidelines regarding strict checkings during CST midterm exams.',
    type: 'success',
    createdAt: '2026-07-05T08:00:00Z',
    read: true,
    targetLink: '/teacher/dashboard',
  },
];

export const teacherNotificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await teacherAxios.get<ApiResponse<Notification[]>>('/notifications');
      return response.data.data;
    } catch {
      console.warn('[Teacher Service] GET /notifications failed. Falling back to mock notifications.');
      return [...mockNotifications];
    }
  },

  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const response = await teacherAxios.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
      return response.data.data;
    } catch {
      console.warn(`[Teacher Service] PATCH /notifications/${id}/read failed. Modifying mock state.`);
      const idx = mockNotifications.findIndex(n => n._id === id);
      if (idx !== -1) {
        mockNotifications[idx] = { ...mockNotifications[idx], read: true };
        return mockNotifications[idx];
      }
      throw new Error('Notification not found');
    }
  },

  markAllAsRead: async (): Promise<boolean> => {
    try {
      await teacherAxios.post('/notifications/read-all');
      return true;
    } catch {
      console.warn('[Teacher Service] POST /notifications/read-all failed. Modifying mock state.');
      mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
      return true;
    }
  },
};

export default teacherNotificationService;
