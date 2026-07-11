import { accountantAxios } from '@/lib/accountantAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Notification } from '@/types/shared/notifications.types';

let mockNotifications: Notification[] = [
  {
    _id: 'not-ac-1',
    title: 'New Student Admission Fees Paid',
    message: 'Admission payment of 10,000 BDT received for student Akram Hossain. Invoice status pending reconciliation.',
    type: 'success',
    createdAt: '2026-07-09T09:45:00Z',
    read: false,
    targetLink: '/accountant/payments', 
  },
  {
    _id: 'not-ac-2',
    title: 'Outstanding Semester Dues Alert',
    message: 'Semester 3 students show a total of 150,000 BDT in unpaid due invoices. Payment deadline is next week.',
    type: 'warning',
    createdAt: '2026-07-08T14:00:00Z',
    read: false,
    targetLink: '/accountant/fees',
  },
  {
    _id: 'not-ac-3',
    title: 'Daily Collection Summary Generated',
    message: 'The daily collection report for 2026-07-08 is finalized. Total received: 45,000 BDT.',
    type: 'info',
    createdAt: '2026-07-08T18:00:00Z',
    read: true,
    targetLink: '/accountant/dashboard',
  },
  {
    _id: 'not-ac-4',
    title: 'Salary Disbursement Configuration Pending',
    message: 'Monthly payroll profiles for faculty staff need validation before bank transfer authorization.',
    type: 'error',
    createdAt: '2026-07-05T09:00:00Z',
    read: true,
    targetLink: '/accountant/dashboard',
  },
];

export const accountantNotificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await accountantAxios.get<ApiResponse<Notification[]>>('/notifications');
      return response.data.data;
    } catch {
      console.warn('[Accountant Service] GET /notifications failed. Falling back to mock notifications.');
      return [...mockNotifications];
    }
  },

  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const response = await accountantAxios.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
      return response.data.data;
    } catch {
      console.warn(`[Accountant Service] PATCH /notifications/${id}/read failed. Modifying mock state.`);
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
      await accountantAxios.post('/notifications/read-all');
      return true;
    } catch {
      console.warn('[Accountant Service] POST /notifications/read-all failed. Modifying mock state.');
      mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
      return true;
    }
  },
};

export default accountantNotificationService;
