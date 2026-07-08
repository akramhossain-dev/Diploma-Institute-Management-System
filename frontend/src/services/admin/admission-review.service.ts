import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AdmissionApplication } from '@/types/admin/admission-review.types';

const mockApplications: AdmissionApplication[] = [
  {
    _id: 'mock-adm-1',
    trackingId: 'ADM-123456',
    fullName: 'Akram Hossain',
    dateOfBirth: '2005-05-15',
    gender: 'male',
    phone: '+8801711122233',
    email: 'akram@gmail.com',
    address: 'Adabor, Dhaka',
    sscRoll: '411223',
    sscBoard: 'Dhaka Board',
    sscYear: '2024',
    sscGpa: 4.80,
    previousInstitute: 'Adabor Secondary School',
    departmentCode: 'CST',
    photoUrl: 'https://cdn.dims.edu.bd/uploads/mock_student1.png',
    documentsUrls: ['https://cdn.dims.edu.bd/uploads/mock_transcript.pdf'],
    status: 'approved',
    remarks: 'Approved. Documents validated.',
    createdAt: '2026-07-01T10:00:00Z',
  },
  {
    _id: 'mock-adm-2',
    trackingId: 'ADM-789012',
    fullName: 'Sara Khan',
    dateOfBirth: '2005-11-22',
    gender: 'female',
    phone: '+8801933445566',
    email: 'sara@domain.com',
    address: 'Banani, Dhaka',
    sscRoll: '300455',
    sscBoard: 'Dhaka Board',
    sscYear: '2024',
    sscGpa: 5.00,
    previousInstitute: 'Banani Girls High School',
    departmentCode: 'ENT',
    photoUrl: '',
    documentsUrls: ['https://cdn.dims.edu.bd/uploads/mock_transcript.pdf'],
    status: 'pending',
    remarks: 'Application under review. Transcript validation pending.',
    createdAt: '2026-07-05T12:30:00Z',
  },
];

export const adminAdmissionReviewService = {
  getApplications: async (): Promise<AdmissionApplication[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<AdmissionApplication[]>>('/admissions');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /admissions failed. Falling back to mock data.');
      return [...mockApplications];
    }
  },

  getApplication: async (id: string): Promise<AdmissionApplication> => {
    try {
      const response = await adminAxios.get<ApiResponse<AdmissionApplication>>(`/admissions/${id}`);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] GET /admissions/${id} failed. Searching mock database.`);
      const match = mockApplications.find(a => a._id === id);
      if (!match) throw new Error('Admission application not found.');
      return match;
    }
  },

  updateStatus: async (id: string, status: 'approved' | 'rejected', remarks: string): Promise<AdmissionApplication> => {
    try {
      const response = await adminAxios.put<ApiResponse<AdmissionApplication>>(`/admissions/${id}/status`, {
        status,
        remarks,
      });
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PUT /admissions/${id}/status failed. Saving to mock database.`);
      const index = mockApplications.findIndex(a => a._id === id);
      if (index === -1) throw new Error('Application not found');
      const updated = { ...mockApplications[index], status, remarks };
      mockApplications[index] = updated;
      return updated;
    }
  },
};
export default adminAdmissionReviewService;
