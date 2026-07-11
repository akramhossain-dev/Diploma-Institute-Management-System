import { publicAxios } from '@/lib/publicAxios';
import { ApiResponse } from '@/types/shared/api.types';
import MRIST from '@/config/mrist.config';

export interface DepartmentInfo {
  _id: string;
  code: string;
  name: string;
  shortName?: string;
  description: string;
  headTeacherName?: string;
  status: 'active' | 'inactive';
}

const fallbackDepartments: DepartmentInfo[] = MRIST.departments.map((d) => ({
  _id:         `mrist-dept-${d.code.toLowerCase()}`,
  code:        d.code,
  name:        d.name,
  shortName:   d.code,
  description: d.shortDesc,
  status:      'active',
}));

export const departmentService = {
  getDepartments: async (): Promise<DepartmentInfo[]> => {
    try {
      const response = await publicAxios.get<ApiResponse<DepartmentInfo[]>>('/departments/public');
      const data = response.data.data;
      
      if (!data || data.length === 0) return fallbackDepartments;
      return data;
    } catch {
      return fallbackDepartments;
    }
  },
};

export default departmentService;
