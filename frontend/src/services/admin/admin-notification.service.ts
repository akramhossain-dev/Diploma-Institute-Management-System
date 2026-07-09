import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Notification } from '@/types/shared/notifications.types';

let mockNotifications: Notification[] = [
  {
    _id: 'not-ad-1',
    title: 'New Student Admission Pending Review',
    message: 'Student Akram Hossain has submitted an admission request for Computer Science Technology (CST). Please review the transcript and approve.',
    type: 'warning',
    createdAt: '2026-07-09T08:30:00Z',
    read: false,
    targetLink: '/admin/admissions',
  },
  {
    _id: 'not-ad-2',
    title: 'Bulk Export Job Finished',
    message: 'Your request to export student ledger records is complete. The report "finance_report_july.csv" is ready for download.',
    type: 'success',
    createdAt: '2026-07-09T09:12:00Z',
    read: false,
    targetLink: '/admin/import-export',
  },
  {
    _id: 'not-ad-3',
    title: 'System Security Audit Warning',
    message: 'Multiple invalid login attempts detected for accountant Rahim Uddin. IP: 192.168.1.154.',
    type: 'error',
    createdAt: '2026-07-08T15:20:00Z',
    read: true,
    targetLink: '/admin/audit-logs',
  },
  {
    _id: 'not-ad-4',
    title: 'Semester Enrollment Rescheduled',
    message: 'The academic session 2026 scheduling notices were published successfully to all active students.',
    type: 'info',
    createdAt: '2026-07-07T11:00:00Z',
    read: true,
    targetLink: '/admin/notices',
  },
];

export const adminNotificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<Notification[]>>('/notifications');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /notifications failed. Falling back to mock notifications.');
      return [...mockNotifications];
    }
  },

  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const response = await adminAxios.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PATCH /notifications/${id}/read failed. Modifying mock state.`);
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
      await adminAxios.post('/notifications/read-all');
      return true;
    } catch (e) {
      console.warn('[Admin Service] POST /notifications/read-all failed. Modifying mock state.');
      mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
      return true;
    }
  },
};

export default adminNotificationService;
