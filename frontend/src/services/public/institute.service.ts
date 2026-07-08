import { publicAxios } from '@/lib/publicAxios';
import { ApiResponse } from '@/types/shared/api.types';

export interface InstituteInfo {
  name: string;
  code: string;
  established: string;
  address: string;
  email: string;
  phone: string;
  admissionOpen: boolean;
  history: string;
  mission: string;
  vision: string;
}

const fallbackInfo: InstituteInfo = {
  name: 'National Diploma Institute',
  code: 'NDI-880',
  established: '1998',
  address: '12/A Academic Avenue, Dhaka, Bangladesh',
  email: 'info@ndi.edu.bd',
  phone: '+8802-99887766',
  admissionOpen: true,
  history: 'National Diploma Institute was established in 1998 with a vision to provide top-tier technical and engineering vocational education. Over the past two decades, we have trained over 10,000 successful engineers and technicians working globally.',
  mission: 'To deliver quality technical education and hands-on laboratory experience that equips students with real-world engineering competencies and vocational qualifications.',
  vision: 'To be a globally recognized center of excellence in engineering and technology diploma education, cultivating innovation, leadership, and technical prowess.',
};

export const instituteService = {
  getInfo: async (): Promise<InstituteInfo> => {
    try {
      const response = await publicAxios.get<ApiResponse<InstituteInfo>>('/institute');
      return response.data.data;
    } catch (e) {
      console.warn('[Public Service] /institute failed. Falling back to mock data.');
      return fallbackInfo;
    }
  },
};
export default instituteService;
