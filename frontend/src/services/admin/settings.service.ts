import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { InstituteSettings, UpdateSettingsInput } from '@/types/admin/settings.types';

let mockSettings: InstituteSettings = {
  name: 'National Diploma Institute',
  code: 'NDI-880',
  established: '1998',
  address: '12/A Academic Avenue, Dhaka, Bangladesh',
  email: 'info@ndi.edu.bd',
  phone: '+8802-99887766',
  website: 'https://www.ndi.edu.bd',
  logo: 'https://cdn.dims.edu.bd/uploads/mock_logo.png',
  description: 'National Diploma Institute is committed to training high-quality engineering and technical professionals to lead industrial innovations.',
  admissionOpen: true,
  socialLinks: {
    facebook: 'https://facebook.com/ndi',
    twitter: 'https://twitter.com/ndi',
    linkedin: 'https://linkedin.com/school/ndi',
  },
};

export const adminSettingsService = {
  getSettings: async (): Promise<InstituteSettings> => {
    try {
      const response = await adminAxios.get<ApiResponse<InstituteSettings>>('/settings');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /settings failed. Falling back to mock data.');
      return { ...mockSettings };
    }
  },

  updateSettings: async (data: UpdateSettingsInput): Promise<InstituteSettings> => {
    try {
      const response = await adminAxios.put<ApiResponse<InstituteSettings>>('/settings', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] PUT /settings failed. Saving to mock database.');
      mockSettings = { ...mockSettings, ...data };
      return mockSettings;
    }
  },
};
export default adminSettingsService;
