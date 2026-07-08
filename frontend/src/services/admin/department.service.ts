import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Department, CreateDepartmentInput, UpdateDepartmentInput } from '@/types/admin/department.types';

// Mock DB
let mockDepartments: Department[] = [
  { _id: 'dept-1', name: 'Computer Science and Technology', code: 'CST', description: 'Computing technology and development course.', status: 'active', createdAt: '2026-06-01T00:00:00Z' },
  { _id: 'dept-2', name: 'Electronics Technology', code: 'ENT', description: 'Electronics, telecom, and hardware systems.', status: 'active', createdAt: '2026-06-01T00:00:00Z' },
  { _id: 'dept-3', name: 'Civil Engineering Technology', code: 'CE', description: 'Structural, transport, and surveying layouts.', status: 'active', createdAt: '2026-06-01T00:00:00Z' },
];

export const adminDepartmentService = {
  getDepartments: async (): Promise<Department[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<Department[]>>('/departments');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /departments failed. Falling back to mock data.');
      return [...mockDepartments];
    }
  },

  createDepartment: async (data: CreateDepartmentInput): Promise<Department> => {
    try {
      const response = await adminAxios.post<ApiResponse<Department>>('/departments', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /departments failed. Saving to mock database.');
      const newDept: Department = {
        _id: 'dept-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockDepartments.push(newDept);
      return newDept;
    }
  },

  updateDepartment: async (id: string, data: UpdateDepartmentInput): Promise<Department> => {
    try {
      const response = await adminAxios.put<ApiResponse<Department>>(`/departments/${id}`, data);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PUT /departments/${id} failed. Saving to mock database.`);
      const index = mockDepartments.findIndex(d => d._id === id);
      if (index === -1) throw new Error('Department not found');
      const updated = { ...mockDepartments[index], ...data };
      mockDepartments[index] = updated;
      return updated;
    }
  },

  deleteDepartment: async (id: string): Promise<void> => {
    try {
      await adminAxios.delete<ApiResponse<null>>(`/departments/${id}`);
    } catch (e) {
      console.warn(`[Admin Service] DELETE /departments/${id} failed. Deleting from mock database.`);
      mockDepartments = mockDepartments.filter(d => d._id !== id);
    }
  },
};
export default adminDepartmentService;
