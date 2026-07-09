import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { ProcessedResultOverview } from '@/types/admin/result-admin.types';

const mockResults: ProcessedResultOverview[] = [
  {
    _id: 'res-1',
    examId: 'exam-1',
    examName: 'Mid Term 2026',
    departmentId: 'dept-1',
    departmentName: 'Computer Technology',
    semesterId: 'sem-3',
    semesterName: '3rd Semester',
    totalStudents: 25,
    status: 'draft',
    createdAt: '2026-07-08T10:00:00Z',
  },
];

export const adminResultService = {
  getResultsOverview: async (): Promise<ProcessedResultOverview[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<ProcessedResultOverview[]>>('/results/processed');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /results/processed failed. Returning mock sheet summaries.');
      return [...mockResults];
    }
  },

  publishResult: async (id: string, publish: boolean): Promise<ProcessedResultOverview> => {
    try {
      const response = await adminAxios.put<ApiResponse<ProcessedResultOverview>>(`/results/${id}/publish`, {
        publish,
      });
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PUT /results/${id}/publish failed. Saving changes to mock results DB.`);
      const index = mockResults.findIndex(x => x._id === id);
      if (index === -1) throw new Error('Result overview sheet not found.');
      const status: 'published' | 'draft' = publish ? 'published' : 'draft';
      const updated = { ...mockResults[index], status };
      mockResults[index] = updated;
      return updated;
    }
  },
};
export default adminResultService;
