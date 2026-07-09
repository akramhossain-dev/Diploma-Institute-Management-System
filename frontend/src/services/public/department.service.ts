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

/** Fallback using the official MRIST department list */
const fallbackDepartments: DepartmentInfo[] = MRIST.departments.map((d, i) => ({
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
      // If backend has no departments yet, fall back to config
      if (!data || data.length === 0) return fallbackDepartments;
      return data;
    } catch {
      return fallbackDepartments;
    }
  },
};

export default departmentService;
