import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Student, CreateStudentInput, UpdateStudentInput } from '@/types/admin/student.types';

export const adminStudentService = {
  getStudents: async (): Promise<Student[]> => {
    const response = await adminAxios.get<ApiResponse<Student[]>>('/students');
    return response.data.data;
  },

  getStudent: async (id: string): Promise<Student> => {
    const response = await adminAxios.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data.data;
  },

  createStudent: async (data: CreateStudentInput): Promise<Student> => {
    const response = await adminAxios.post<ApiResponse<Student>>('/students', data);
    return response.data.data;
  },

  updateStudent: async (id: string, data: UpdateStudentInput): Promise<Student> => {
    const response = await adminAxios.put<ApiResponse<Student>>(`/students/${id}`, data);
    return response.data.data;
  },
};
export default adminStudentService;
