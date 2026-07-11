import { teacherAxios } from '@/lib/teacherAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Course } from '@/types/admin/course.types';
import { Student } from '@/types/admin/student.types';

export const teacherCourseService = {
  getAssignedCourses: async (): Promise<Course[]> => {
    const response = await teacherAxios.get<ApiResponse<Course[]>>('/courses/assigned');
    return response.data.data;
  },

  getCourseStudents: async (courseId: string): Promise<Student[]> => {
    const response = await teacherAxios.get<ApiResponse<Student[]>>(`/courses/${courseId}/students`);
    return response.data.data;
  },
};
export default teacherCourseService;

