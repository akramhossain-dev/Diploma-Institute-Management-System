import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { CourseAssignment, CreateAssignmentInput, UpdateAssignmentInput } from '@/types/admin/course-assignment.types';

export const adminCourseAssignmentService = {
  getAssignments: async (): Promise<CourseAssignment[]> => {
    const response = await adminAxios.get<ApiResponse<CourseAssignment[]>>('/teacher-assignments');
    return response.data.data;
  },

  createAssignment: async (data: CreateAssignmentInput): Promise<CourseAssignment> => {
    const response = await adminAxios.post<ApiResponse<CourseAssignment>>('/teacher-assignments', data);
    return response.data.data;
  },

  updateAssignment: async (id: string, data: UpdateAssignmentInput): Promise<CourseAssignment> => {
    const response = await adminAxios.put<ApiResponse<CourseAssignment>>(`/teacher-assignments/${id}`, data);
    return response.data.data;
  },

  deleteAssignment: async (id: string): Promise<void> => {
    await adminAxios.delete(`/teacher-assignments/${id}`);
  },
};
export default adminCourseAssignmentService;
