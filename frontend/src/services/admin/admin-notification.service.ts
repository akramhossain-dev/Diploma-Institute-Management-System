import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Notification } from '@/types/shared/notifications.types';

export const adminNotificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await adminAxios.get<ApiResponse<Notification[]>>('/notifications');
    return response.data.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await adminAxios.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async (): Promise<boolean> => {
    await adminAxios.post('/notifications/read-all');
    return true;
  },
};

export default adminNotificationService;
