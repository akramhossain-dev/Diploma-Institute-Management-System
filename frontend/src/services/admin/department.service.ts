import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Department, CreateDepartmentInput, UpdateDepartmentInput } from '@/types/admin/department.types';

export const adminDepartmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await adminAxios.get<ApiResponse<Department[]>>('/departments');
    return response.data.data;
  },

  createDepartment: async (data: CreateDepartmentInput): Promise<Department> => {
    const response = await adminAxios.post<ApiResponse<Department>>('/departments', data);
    return response.data.data;
  },

  updateDepartment: async (id: string, data: UpdateDepartmentInput): Promise<Department> => {
    const response = await adminAxios.put<ApiResponse<Department>>(`/departments/${id}`, data);
    return response.data.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await adminAxios.delete<ApiResponse<null>>(`/departments/${id}`);
  },
};
export default adminDepartmentService;
