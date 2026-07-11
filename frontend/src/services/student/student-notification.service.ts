import { studentAxios } from '@/lib/studentAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Notification } from '@/types/shared/notifications.types';

let mockNotifications: Notification[] = [
  {
    _id: 'not-st-1',
    title: 'Midterm Exam Schedule Published',
    message: 'Your midterm examinations schedule for semester 3 is now live. Please review your exam mapping routines.',
    type: 'warning',
    createdAt: '2026-07-09T09:00:00Z',
    read: false,
    targetLink: '/student/results', 
  },
  {
    _id: 'not-st-2',
    title: 'Semester Fee Bill Generated',
    message: 'Invoice INV-9821 has been generated for your Semester 3 tuition fees. Amount: 12,500 BDT. Due Date: 2026-07-25.',
    type: 'info',
    createdAt: '2026-07-08T10:00:00Z',
    read: false,
    targetLink: '/student/fees',
  },
  {
    _id: 'not-st-3',
    title: 'Attendance Warning (CST-501)',
    message: 'Your attendance rate in Microprocessors course is 72%, which is below the mandatory 75% threshold.',
    type: 'error',
    createdAt: '2026-07-05T14:00:00Z',
    read: true,
    targetLink: '/student/attendance',
  },
  {
    _id: 'not-st-4',
    title: 'New Notice Published on Board',
    message: 'A notice regarding the upcoming Summer Vacation schedule has been posted on the bulletin board.',
    type: 'success',
    createdAt: '2026-07-01T08:30:00Z',
    read: true,
    targetLink: '/student/notices',
  },
];

export const studentNotificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await studentAxios.get<ApiResponse<Notification[]>>('/notifications');
      return response.data.data;
    } catch {
      console.warn('[Student Service] GET /notifications failed. Falling back to mock notifications.');
      return [...mockNotifications];
    }
  },

  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const response = await studentAxios.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
      return response.data.data;
    } catch {
      console.warn(`[Student Service] PATCH /notifications/${id}/read failed. Modifying mock state.`);
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
      await studentAxios.post('/notifications/read-all');
      return true;
    } catch {
      console.warn('[Student Service] POST /notifications/read-all failed. Modifying mock state.');
      mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
      return true;
    }
  },
};

export default studentNotificationService;
