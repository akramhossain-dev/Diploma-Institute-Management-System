import { publicAxios } from '@/lib/publicAxios';
import { ApiResponse } from '@/types/shared/api.types';

export interface DepartmentInfo {
  _id: string;
  code: string;
  name: string;
  description: string;
  headTeacherName?: string;
  status: 'active' | 'inactive';
}

const fallbackDepartments: DepartmentInfo[] = [
  {
    _id: 'dept-1',
    code: 'CST',
    name: 'Computer Science and Technology',
    description: 'Covers software engineering, programming, network architecture, data structures, and database management systems.',
    headTeacherName: 'Dr. Rahman',
    status: 'active',
  },
  {
    _id: 'dept-2',
    code: 'ENT',
    name: 'Electronics Technology',
    description: 'Focuses on microcontrollers, circuit layouts, telecom principles, signal handling, and hardware repairs.',
    headTeacherName: 'Engr. Sultana',
    status: 'active',
  },
  {
    _id: 'dept-3',
    code: 'CE',
    name: 'Civil Engineering Technology',
    description: 'Covers surveying, construction materials, design software, structural building principles, and concrete technology.',
    headTeacherName: 'Dr. Chowdhury',
    status: 'active',
  },
];

export const departmentService = {
  getDepartments: async (): Promise<DepartmentInfo[]> => {
    try {
      const response = await publicAxios.get<ApiResponse<DepartmentInfo[]>>('/departments');
      return response.data.data;
    } catch (e) {
      console.warn('[Public Service] /departments failed. Falling back to mock data.');
      return fallbackDepartments;
    }
  },
};
export default departmentService;
