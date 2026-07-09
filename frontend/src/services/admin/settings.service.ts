import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { InstituteSettings, UpdateSettingsInput } from '@/types/admin/settings.types';

export const adminSettingsService = {
  getSettings: async (): Promise<InstituteSettings> => {
    const response = await adminAxios.get<ApiResponse<InstituteSettings>>('/institute-settings');
    return response.data.data;
  },

  updateSettings: async (data: UpdateSettingsInput): Promise<InstituteSettings> => {
    const response = await adminAxios.patch<ApiResponse<InstituteSettings>>('/institute-settings', data);
    return response.data.data;
  },
};
export default adminSettingsService;
