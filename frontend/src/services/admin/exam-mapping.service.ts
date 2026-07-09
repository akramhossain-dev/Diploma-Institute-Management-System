import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { ExamMapping, CreateExamMappingInput, UpdateExamMappingInput } from '@/types/admin/exam-mapping.types';

export const adminExamMappingService = {
  getMappings: async (): Promise<ExamMapping[]> => {
    const response = await adminAxios.get<ApiResponse<ExamMapping[]>>('/exam-course-mappings');
    return response.data.data;
  },

  createMapping: async (data: CreateExamMappingInput): Promise<ExamMapping> => {
    const response = await adminAxios.post<ApiResponse<ExamMapping>>('/exam-course-mappings', data);
    return response.data.data;
  },

  updateMapping: async (id: string, data: UpdateExamMappingInput): Promise<ExamMapping> => {
    const response = await adminAxios.put<ApiResponse<ExamMapping>>(`/exam-course-mappings/${id}`, data);
    return response.data.data;
  },

  deleteMapping: async (id: string): Promise<void> => {
    await adminAxios.delete(`/exam-course-mappings/${id}`);
  },
};
export default adminExamMappingService;
