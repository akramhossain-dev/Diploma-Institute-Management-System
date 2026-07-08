import { studentAxios } from '@/lib/studentAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { StudentExamResultSummary } from '@/types/student/result.types';

let mockResults: StudentExamResultSummary[] = [
  {
    _id: 'res-summary-1',
    examName: 'Mid Term 2026',
    semesterName: '3rd Semester',
    gpa: 3.80,
    status: 'pass',
    details: [
      {
        courseCode: 'CST-101',
        courseName: 'Computer Fundamentals',
        credits: 3,
        obtainedMarks: 82,
        gradePoint: 4.00,
        letterGrade: 'A+',
        status: 'pass',
      },
      {
        courseCode: 'ENT-201',
        courseName: 'Electronic Circuits',
        credits: 3,
        obtainedMarks: 72,
        gradePoint: 3.50,
        letterGrade: 'A-',
        status: 'pass',
      },
    ],
  },
];

export const studentResultService = {
  getResults: async (): Promise<StudentExamResultSummary[]> => {
    try {
      const response = await studentAxios.get<ApiResponse<StudentExamResultSummary[]>>('/results/my');
      return response.data.data;
    } catch (e) {
      console.warn('[Student Service] GET /results/my failed. Loading current resolved results.');
      return [...mockResults];
    }
  },

  injectMockResult: (result: Omit<StudentExamResultSummary, '_id'>) => {
    const idx = mockResults.findIndex(r => r.examName === result.examName);
    const newRes = {
      _id: 'res-sum-gen-' + Math.random().toString(36).substring(2, 9),
      ...result,
    };
    if (idx !== -1) {
      mockResults[idx] = newRes;
    } else {
      mockResults.unshift(newRes);
    }
  },
};
export default studentResultService;
