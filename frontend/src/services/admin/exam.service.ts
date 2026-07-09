import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Exam, CreateExamInput, UpdateExamInput } from '@/types/admin/exam.types';

export const adminExamService = {
  getExams: async (): Promise<Exam[]> => {
    const response = await adminAxios.get<ApiResponse<Exam[]>>('/exams');
    return response.data.data;
  },

  getExam: async (id: string): Promise<Exam> => {
    const response = await adminAxios.get<ApiResponse<Exam>>(`/exams/${id}`);
    return response.data.data;
  },

  createExam: async (data: CreateExamInput): Promise<Exam> => {
    const response = await adminAxios.post<ApiResponse<Exam>>('/exams', data);
    return response.data.data;
  },

  updateExam: async (id: string, data: UpdateExamInput): Promise<Exam> => {
    const response = await adminAxios.put<ApiResponse<Exam>>(`/exams/${id}`, data);
    return response.data.data;
  },

  deleteExam: async (id: string): Promise<void> => {
    await adminAxios.delete(`/exams/${id}`);
  },
};
export default adminExamService;
