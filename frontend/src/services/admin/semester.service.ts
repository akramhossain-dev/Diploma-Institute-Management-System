import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Semester, CreateSemesterInput, UpdateSemesterInput } from '@/types/admin/semester.types';

export const adminSemesterService = {
  getSemesters: async (): Promise<Semester[]> => {
    const response = await adminAxios.get<ApiResponse<Semester[]>>('/semesters');
    return response.data.data;
  },

  createSemester: async (data: CreateSemesterInput): Promise<Semester> => {
    const response = await adminAxios.post<ApiResponse<Semester>>('/semesters', data);
    return response.data.data;
  },

  updateSemester: async (id: string, data: UpdateSemesterInput): Promise<Semester> => {
    const response = await adminAxios.put<ApiResponse<Semester>>(`/semesters/${id}`, data);
    return response.data.data;
  },

  deleteSemester: async (id: string): Promise<void> => {
    await adminAxios.delete<ApiResponse<null>>(`/semesters/${id}`);
  },
};
export default adminSemesterService;
