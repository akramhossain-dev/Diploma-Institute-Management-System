import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Teacher, CreateTeacherInput, UpdateTeacherInput } from '@/types/admin/teacher.types';

export const adminTeacherService = {
  getTeachers: async (): Promise<Teacher[]> => {
    const response = await adminAxios.get<ApiResponse<Teacher[]>>('/teachers');
    return response.data.data;
  },

  getTeacher: async (id: string): Promise<Teacher> => {
    const response = await adminAxios.get<ApiResponse<Teacher>>(`/teachers/${id}`);
    return response.data.data;
  },

  createTeacher: async (data: CreateTeacherInput): Promise<Teacher> => {
    const response = await adminAxios.post<ApiResponse<Teacher>>('/teachers', data);
    return response.data.data;
  },

  updateTeacher: async (id: string, data: UpdateTeacherInput): Promise<Teacher> => {
    const response = await adminAxios.put<ApiResponse<Teacher>>(`/teachers/${id}`, data);
    return response.data.data;
  },
};
export default adminTeacherService;
