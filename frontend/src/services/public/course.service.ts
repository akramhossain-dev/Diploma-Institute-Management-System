import { publicAxios } from '@/lib/publicAxios';
import { ApiResponse } from '@/types/shared/api.types';

export interface CourseInfo {
  _id: string;
  code: string;
  name: string;
  departmentId: string;
  departmentCode: string;
  semester: number;
  credits: number;
  type: 'theory' | 'practical' | 'both';
}

const fallbackCourses: CourseInfo[] = [
  { _id: 'c-1', code: 'CST-311', name: 'Data Structures & Algorithms', departmentId: 'dept-1', departmentCode: 'CST', semester: 3, credits: 4, type: 'both' },
  { _id: 'c-2', code: 'CST-312', name: 'Database Management Systems', departmentId: 'dept-1', departmentCode: 'CST', semester: 3, credits: 4, type: 'both' },
  { _id: 'c-3', code: 'CST-313', name: 'Web Engineering', departmentId: 'dept-1', departmentCode: 'CST', semester: 3, credits: 3, type: 'both' },
  { _id: 'c-4', code: 'ENT-311', name: 'Electronic Circuit Layouts', departmentId: 'dept-2', departmentCode: 'ENT', semester: 3, credits: 4, type: 'both' },
  { _id: 'c-5', code: 'CE-311', name: 'Concrete Structure Analysis', departmentId: 'dept-3', departmentCode: 'CE', semester: 3, credits: 3, type: 'theory' },
];

export const courseService = {
  getCourses: async (departmentId?: string): Promise<CourseInfo[]> => {
    try {
      const url = departmentId ? `/courses/public?departmentId=${departmentId}` : '/courses/public';
      const response = await publicAxios.get<ApiResponse<CourseInfo[]>>(url);
      return response.data.data;
    } catch {
      console.warn('[Public Service] /courses failed. Falling back to mock data.');
      if (departmentId) {
        return fallbackCourses.filter(c => c.departmentId === departmentId);
      }
      return fallbackCourses;
    }
  },
};
export default courseService;
