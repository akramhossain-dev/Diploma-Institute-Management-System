import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Course, CreateCourseInput, UpdateCourseInput } from '@/types/admin/course.types';

export const adminCourseService = {
  getCourses: async (): Promise<Course[]> => {
    const response = await adminAxios.get<ApiResponse<Course[]>>('/courses');
    return response.data.data;
  },

  createCourse: async (data: CreateCourseInput): Promise<Course> => {
    const response = await adminAxios.post<ApiResponse<Course>>('/courses', data);
    return response.data.data;
  },

  updateCourse: async (id: string, data: UpdateCourseInput): Promise<Course> => {
    const response = await adminAxios.put<ApiResponse<Course>>(`/courses/${id}`, data);
    return response.data.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await adminAxios.delete<ApiResponse<null>>(`/courses/${id}`);
  },
};
export default adminCourseService;
