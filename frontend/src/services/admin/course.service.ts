import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Course, CreateCourseInput, UpdateCourseInput } from '@/types/admin/course.types';
import { adminDepartmentService } from './department.service';

let mockCourses: Course[] = [
  { _id: 'c-1', name: 'Data Structures & Algorithms', code: 'CST-311', departmentId: 'dept-1', credits: 4, type: 'both', status: 'active', createdAt: '2026-06-01T00:00:00Z' },
  { _id: 'c-2', name: 'Database Management Systems', code: 'CST-312', departmentId: 'dept-1', credits: 4, type: 'both', status: 'active', createdAt: '2026-06-01T00:00:00Z' },
  { _id: 'c-3', name: 'Electronic Circuit Layouts', code: 'ENT-311', departmentId: 'dept-2', credits: 4, type: 'both', status: 'active', createdAt: '2026-06-01T00:00:00Z' },
];

export const adminCourseService = {
  getCourses: async (): Promise<Course[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<Course[]>>('/courses');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /courses failed. Resolving via mock database.');
      // Resolve department names dynamically from department service mock state
      const depts = await adminDepartmentService.getDepartments();
      return mockCourses.map(course => {
        const d = depts.find(dept => dept._id === course.departmentId || dept.code === course.departmentId);
        return {
          ...course,
          departmentName: d ? d.name : 'Unknown Technology',
        };
      });
    }
  },

  createCourse: async (data: CreateCourseInput): Promise<Course> => {
    try {
      const response = await adminAxios.post<ApiResponse<Course>>('/courses', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /courses failed. Saving to mock database.');
      const newCourse: Course = {
        _id: 'c-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockCourses.push(newCourse);
      return newCourse;
    }
  },

  updateCourse: async (id: string, data: UpdateCourseInput): Promise<Course> => {
    try {
      const response = await adminAxios.put<ApiResponse<Course>>(`/courses/${id}`, data);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PUT /courses/${id} failed. Saving to mock database.`);
      const index = mockCourses.findIndex(c => c._id === id);
      if (index === -1) throw new Error('Course not found');
      const updated = { ...mockCourses[index], ...data };
      mockCourses[index] = updated;
      return updated;
    }
  },

  deleteCourse: async (id: string): Promise<void> => {
    try {
      await adminAxios.delete<ApiResponse<null>>(`/courses/${id}`);
    } catch (e) {
      console.warn(`[Admin Service] DELETE /courses/${id} failed. Deleting from mock database.`);
      mockCourses = mockCourses.filter(c => c._id !== id);
    }
  },
};
export default adminCourseService;
