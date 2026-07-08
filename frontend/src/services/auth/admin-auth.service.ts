import { adminAxios } from '@/lib/adminAxios';
import { publicAxios } from '@/lib/publicAxios';
import { AdminLoginInput } from '@/types/auth/admin-login.schema';
import { AdminLoginResponse, AdminProfile } from '@/types/auth/admin-auth.types';
import { ApiResponse } from '@/types/shared/api.types';

export const adminAuthService = {
  login: async (credentials: AdminLoginInput): Promise<AdminLoginResponse['data']> => {
    // Login requests use public client to avoid token injection warnings
    const response = await publicAxios.post<AdminLoginResponse>('/auth/admin/login', credentials);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    // Logout request uses admin-scoped axios instance
    await adminAxios.post<ApiResponse<null>>('/auth/admin/logout');
  },

  fetchProfile: async (): Promise<AdminProfile> => {
    // Fetch profile uses admin-scoped axios instance
    const response = await adminAxios.get<ApiResponse<AdminProfile>>('/admins/me');
    return response.data.data;
  },
};
