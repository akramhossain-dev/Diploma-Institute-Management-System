import { publicAxios } from '@/lib/publicAxios';
import { ApiResponse } from '@/types/shared/api.types';
import MRIST from '@/config/mrist.config';

export interface InstituteInfo {
  name: string;
  code: string;
  established: string;
  address: string | { street?: string; city?: string; district?: string; division?: string; postCode?: string };
  email: string;
  phone: string;
  admissionOpen: boolean;
  history: string;
  mission: string;
  vision: string;
}

/** Fallback using the official MRIST config */
const fallbackInfo: InstituteInfo = {
  name:          MRIST.fullName,
  code:          MRIST.shortName,
  established:   MRIST.established,
  address:       MRIST.contact.address,
  email:         MRIST.contact.email,
  phone:         MRIST.contact.phone,
  admissionOpen: true,
  history:       MRIST.about.history,
  mission:       MRIST.about.mission,
  vision:        MRIST.about.vision,
};

export const instituteService = {
  getInfo: async (): Promise<InstituteInfo> => {
    try {
      const response = await publicAxios.get<ApiResponse<InstituteInfo>>('/institute-settings/public');
      return response.data.data ?? fallbackInfo;
    } catch {
      return fallbackInfo;
    }
  },
};

export default instituteService;
