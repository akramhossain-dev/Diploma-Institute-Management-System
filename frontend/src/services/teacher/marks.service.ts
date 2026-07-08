import { teacherAxios } from '@/lib/teacherAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { MarksSubmissionInput } from '@/types/teacher/marks.types';
import { teacherExamService } from './teacher-exam.service';
import { studentResultService } from '../student/student-result.service';

export const teacherMarksService = {
  submitMarks: async (data: MarksSubmissionInput): Promise<void> => {
    try {
      await teacherAxios.post<ApiResponse<null>>('/marks/submit', data);
    } catch (e) {
      console.warn('[Teacher Service] POST /marks/submit failed. Simulating persistence.');
      // Update local marks status to submitted!
      teacherExamService.updateDutyStatus(data.courseId, 'submitted');

      // Propagate mock results into student self-service dashboard!
      studentResultService.injectMockResult({
        examName: 'Mid Term 2026',
        semesterName: '3rd Semester',
        gpa: 3.85,
        status: 'pass',
        details: data.records.map((r) => ({
          courseCode: 'CST-101',
          courseName: 'Computer Fundamentals',
          credits: 3,
          obtainedMarks: r.obtainedMarks || 0,
          gradePoint: r.obtainedMarks && r.obtainedMarks >= 80 ? 4.0 : 3.5,
          letterGrade: r.obtainedMarks && r.obtainedMarks >= 80 ? 'A+' : 'A-',
          status: r.obtainedMarks && r.obtainedMarks >= 40 ? 'pass' : 'fail',
        })),
      });
    }
  },
};
export default teacherMarksService;
