import { teacherAxios } from '@/lib/teacherAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { TeacherExamDuty } from '@/types/teacher/marks.types';

const mockDuties: TeacherExamDuty[] = [
  {
    _id: 'duty-1',
    examId: 'exam-1',
    examName: 'Mid Term 2026',
    courseId: 'course-1',
    courseName: 'Computer Fundamentals',
    courseCode: 'CST-101',
    semesterName: '3rd Semester',
    fullMarks: 100,
    passMarks: 40,
    marksStatus: 'pending',
  },
];

export const teacherExamService = {
  getExamDuties: async (): Promise<TeacherExamDuty[]> => {
    try {
      const response = await teacherAxios.get<ApiResponse<TeacherExamDuty[]>>('/exams/duties');
      return response.data.data;
    } catch (e) {
      console.warn('[Teacher Service] GET /exams/duties failed. Resolving mock duty assignments.');
      return [...mockDuties];
    }
  },

  updateDutyStatus: (courseId: string, status: 'pending' | 'submitted') => {
    const match = mockDuties.find(d => d.courseId === courseId);
    if (match) match.marksStatus = status;
  },
};
export default teacherExamService;
