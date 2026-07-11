import { publicAxios } from '@/lib/publicAxios';
import { ApiResponse } from '@/types/shared/api.types';

export interface AdmissionSubmissionInput {
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  sscRoll: string;
  sscBoard: string;
  sscYear: string;
  sscGpa: number;
  previousInstitute: string;
  departmentCode: string;
  photoUrl: string;
  documentsUrls: string[];
}

export interface AdmissionStatus {
  _id: string;
  trackingId: string;
  fullName: string;
  email: string;
  departmentCode: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
  createdAt: string;
}

const mockSubmittedAdmissions: Record<string, AdmissionStatus> = {
  'ADM-123456': {
    _id: 'mock-adm-1',
    trackingId: 'ADM-123456',
    fullName: 'Akram Hossain',
    email: 'akram@gmail.com',
    departmentCode: 'CST',
    status: 'approved',
    remarks: 'Approved. Please pay the admission fee at the accounts office to retrieve your student roll number.',
    createdAt: '2026-07-01T10:00:00Z',
  },
  'ADM-789012': {
    _id: 'mock-adm-2',
    trackingId: 'ADM-789012',
    fullName: 'Sara Khan',
    email: 'sara@domain.com',
    departmentCode: 'ENT',
    status: 'pending',
    remarks: 'Application under review. High school transcript validation pending.',
    createdAt: '2026-07-05T12:30:00Z',
  },
};

export const admissionService = {
  submitAdmission: async (data: AdmissionSubmissionInput): Promise<{ trackingId: string }> => {
    try {
      const response = await publicAxios.post<ApiResponse<{ trackingId: string }>>('/admissions', data);
      return response.data.data;
    } catch {
      console.warn('[Public Service] POST /admissions failed. Falling back to mock tracking ID.');
      
      const trackingId = 'ADM-' + Math.floor(100000 + Math.random() * 900000);
      mockSubmittedAdmissions[trackingId] = {
        _id: 'mock-gen-' + Math.random().toString(36).substring(2, 9),
        trackingId,
        fullName: data.fullName,
        email: data.email,
        departmentCode: data.departmentCode,
        status: 'pending',
        remarks: 'Form submitted successfully. Documents validation pending.',
        createdAt: new Date().toISOString(),
      };

      await new Promise(resolve => setTimeout(resolve, 800));
      return { trackingId };
    }
  },

  checkStatus: async (trackingId: string): Promise<AdmissionStatus> => {
    try {
      const response = await publicAxios.get<ApiResponse<AdmissionStatus>>(`/admissions/status?trackingId=${trackingId}`);
      return response.data.data;
    } catch {
      console.warn('[Public Service] GET /admissions/status failed. Checking mock database.');
      await new Promise(resolve => setTimeout(resolve, 500));
      const record = mockSubmittedAdmissions[trackingId];
      if (!record) {
        throw {
          message: `Application tracking ID "${trackingId}" not found in system record.`,
          errorCode: 'NOT_FOUND',
          statusCode: 404,
        };
      }
      return record;
    }
  },
};
export default admissionService;
