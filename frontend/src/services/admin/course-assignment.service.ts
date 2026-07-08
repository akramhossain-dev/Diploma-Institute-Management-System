import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { CourseAssignment, CreateAssignmentInput, UpdateAssignmentInput } from '@/types/admin/course-assignment.types';
import { adminTeacherService } from './teacher.service';
import { adminCourseService } from './course.service';
import { adminDepartmentService } from './department.service';
import { adminSemesterService } from './semester.service';
import { adminSessionService } from './session.service';

let mockAssignments: CourseAssignment[] = [
  {
    _id: 'assign-1',
    teacherId: 't-1',
    teacherName: 'Dr. Rafiqul Islam',
    courseId: 'course-1',
    courseName: 'Computer Fundamentals',
    departmentId: 'dept-1',
    semesterId: 'sem-3',
    sessionId: 'sess-2',
    assignedDate: '2026-07-01',
    status: 'active',
  },
];

export const adminCourseAssignmentService = {
  getAssignments: async (): Promise<CourseAssignment[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<CourseAssignment[]>>('/course-assignments');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /course-assignments failed. Resolving mock bindings.');
      const teachers = await adminTeacherService.getTeachers();
      const courses = await adminCourseService.getCourses();
      const depts = await adminDepartmentService.getDepartments();
      const sems = await adminSemesterService.getSemesters();
      const sessions = await adminSessionService.getSessions();

      return mockAssignments.map(item => {
        const t = teachers.find(x => x._id === item.teacherId || x.teacherId === item.teacherId);
        const c = courses.find(x => x._id === item.courseId || x.code === item.courseId);
        const d = depts.find(x => x._id === item.departmentId || x.code === item.departmentId);
        const sem = sems.find(x => x._id === item.semesterId || x.number === Number(item.semesterId));
        const ses = sessions.find(x => x._id === item.sessionId || x.name === item.sessionId);

        return {
          ...item,
          teacherName: t ? t.fullName : item.teacherName,
          courseName: c ? c.name : item.courseName,
          departmentName: d ? d.name : 'Unknown Tech',
          semesterName: sem ? sem.name : 'Unknown Sem',
          sessionName: ses ? ses.name : 'Unknown Session',
        };
      });
    }
  },

  createAssignment: async (data: CreateAssignmentInput): Promise<CourseAssignment> => {
    try {
      const response = await adminAxios.post<ApiResponse<CourseAssignment>>('/course-assignments', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /course-assignments failed. Appending to mock registry.');
      const newAssign: CourseAssignment = {
        _id: 'assign-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        teacherName: 'Assigned Faculty',
        courseName: 'Assigned Subject',
        assignedDate: new Date().toISOString().split('T')[0],
      };
      mockAssignments.push(newAssign);
      return newAssign;
    }
  },

  updateAssignment: async (id: string, data: UpdateAssignmentInput): Promise<CourseAssignment> => {
    try {
      const response = await adminAxios.put<ApiResponse<CourseAssignment>>(`/course-assignments/${id}`, data);
      return response.data.data;
    } catch (e) {
      const index = mockAssignments.findIndex(x => x._id === id);
      if (index === -1) throw new Error('Assignment records not found.');
      const updated = { ...mockAssignments[index], ...data };
      mockAssignments[index] = updated as CourseAssignment;
      return updated as CourseAssignment;
    }
  },

  deleteAssignment: async (id: string): Promise<void> => {
    try {
      await adminAxios.delete(`/course-assignments/${id}`);
    } catch (e) {
      mockAssignments = mockAssignments.filter(x => x._id !== id);
    }
  },
};
export default adminCourseAssignmentService;
