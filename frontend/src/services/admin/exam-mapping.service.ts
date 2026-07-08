import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { ExamMapping, CreateExamMappingInput, UpdateExamMappingInput } from '@/types/admin/exam-mapping.types';
import { adminExamService } from './exam.service';
import { adminDepartmentService } from './department.service';
import { adminSemesterService } from './semester.service';
import { adminCourseService } from './course.service';
import { adminTeacherService } from './teacher.service';

let mockMappings: ExamMapping[] = [
  {
    _id: 'mapping-1',
    examId: 'exam-1',
    examName: 'Mid Term 2026',
    departmentId: 'dept-1',
    semesterId: 'sem-3',
    courseId: 'course-1',
    courseName: 'Computer Fundamentals',
    courseCode: 'CST-101',
    teacherId: 't-1',
    teacherName: 'Dr. Rafiqul Islam',
    fullMarks: 100,
    passMarks: 40,
  },
];

export const adminExamMappingService = {
  getMappings: async (): Promise<ExamMapping[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<ExamMapping[]>>('/exam-mappings');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /exam-mappings failed. Resolving mock mappings.');
      const exams = await adminExamService.getExams();
      const depts = await adminDepartmentService.getDepartments();
      const sems = await adminSemesterService.getSemesters();
      const courses = await adminCourseService.getCourses();
      const teachers = await adminTeacherService.getTeachers();

      return mockMappings.map(item => {
        const ex = exams.find(x => x._id === item.examId);
        const d = depts.find(x => x._id === item.departmentId || x.code === item.departmentId);
        const sem = sems.find(x => x._id === item.semesterId || x.number === Number(item.semesterId));
        const c = courses.find(x => x._id === item.courseId || x.code === item.courseId);
        const t = teachers.find(x => x._id === item.teacherId || x.teacherId === item.teacherId);

        return {
          ...item,
          examName: ex ? ex.name : item.examName,
          departmentName: d ? d.name : 'Unknown Tech',
          semesterName: sem ? sem.name : 'Unknown Sem',
          courseName: c ? c.name : item.courseName,
          courseCode: c ? c.code : item.courseCode,
          teacherName: t ? t.fullName : item.teacherName,
        };
      });
    }
  },

  createMapping: async (data: CreateExamMappingInput): Promise<ExamMapping> => {
    try {
      const response = await adminAxios.post<ApiResponse<ExamMapping>>('/exam-mappings', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /exam-mappings failed. Adding to mock database.');
      const newMap: ExamMapping = {
        _id: 'mapping-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        courseName: 'Mapped Subject',
        teacherName: 'Assigned Lecturer',
      };
      mockMappings.push(newMap);
      return newMap;
    }
  },

  updateMapping: async (id: string, data: UpdateExamMappingInput): Promise<ExamMapping> => {
    try {
      const response = await adminAxios.put<ApiResponse<ExamMapping>>(`/exam-mappings/${id}`, data);
      return response.data.data;
    } catch (e) {
      const index = mockMappings.findIndex(x => x._id === id);
      if (index === -1) throw new Error('Mapping not found');
      const updated = { ...mockMappings[index], ...data };
      mockMappings[index] = updated as ExamMapping;
      return updated as ExamMapping;
    }
  },

  deleteMapping: async (id: string): Promise<void> => {
    try {
      await adminAxios.delete(`/exam-mappings/${id}`);
    } catch (e) {
      mockMappings = mockMappings.filter(x => x._id !== id);
    }
  },
};
export default adminExamMappingService;
