import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { ProcessedResultOverview } from '@/types/admin/result-admin.types';

export const adminResultService = {
  getResultsOverview: async (): Promise<ProcessedResultOverview[]> => {
    const response = await adminAxios.get<ApiResponse<ProcessedResultOverview[]>>('/results/processed');
    return response.data.data;
  },

  publishResult: async (id: string, publish: boolean): Promise<ProcessedResultOverview> => {
    const response = await adminAxios.put<ApiResponse<ProcessedResultOverview>>(`/results/${id}/publish`, {
      publish,
    });
    return response.data.data;
  },
};
export default adminResultService;
