import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AdmissionApplication } from '@/types/admin/admission-review.types';

export const adminAdmissionReviewService = {
  getApplications: async (): Promise<AdmissionApplication[]> => {
    const response = await adminAxios.get<ApiResponse<AdmissionApplication[]>>('/admissions');
    return response.data.data;
  },

  getApplication: async (id: string): Promise<AdmissionApplication> => {
    const response = await adminAxios.get<ApiResponse<AdmissionApplication>>(`/admissions/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: string, status: 'approved' | 'rejected', remarks: string): Promise<AdmissionApplication> => {
    const response = await adminAxios.put<ApiResponse<AdmissionApplication>>(`/admissions/${id}/status`, {
      status,
      remarks,
    });
    return response.data.data;
  },
};
export default adminAdmissionReviewService;
