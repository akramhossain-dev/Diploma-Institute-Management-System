import { studentAxios } from '@/lib/studentAxios';
import { ApiResponse } from '@/types/shared/api.types';

export interface StudentAttendanceSummary {
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  percentage: number;
}

export interface StudentAttendanceHistoryItem {
  _id: string;
  date: string;
  courseName: string;
  courseCode: string;
  status: 'present' | 'absent';
}

const mockSummary: StudentAttendanceSummary = {
  totalClasses: 32,
  attendedClasses: 28,
  absentClasses: 4,
  percentage: 87.5,
};

const mockHistory: StudentAttendanceHistoryItem[] = [
  { _id: 'h-1', date: '2026-07-08', courseName: 'Computer Fundamentals', courseCode: 'CST-101', status: 'present' },
  { _id: 'h-2', date: '2026-07-06', courseName: 'Computer Fundamentals', courseCode: 'CST-101', status: 'present' },
  { _id: 'h-3', date: '2026-07-05', courseName: 'Electronic Circuits', courseCode: 'ENT-201', status: 'absent' },
  { _id: 'h-4', date: '2026-07-01', courseName: 'Computer Fundamentals', courseCode: 'CST-101', status: 'present' },
];

export const studentAttendanceService = {
  getSummary: async (): Promise<StudentAttendanceSummary> => {
    try {
      const response = await studentAxios.get<ApiResponse<StudentAttendanceSummary>>('/attendance/my-summary');
      return response.data.data;
    } catch (e) {
      console.warn('[Student Service] GET /attendance/my-summary failed. Resolving metrics mock.');
      return mockSummary;
    }
  },

  getHistory: async (): Promise<StudentAttendanceHistoryItem[]> => {
    try {
      const response = await studentAxios.get<ApiResponse<StudentAttendanceHistoryItem[]>>('/attendance/my-history');
      return response.data.data;
    } catch (e) {
      console.warn('[Student Service] GET /attendance/my-history failed. Resolving log history.');
      return [...mockHistory];
    }
  },
};
export default studentAttendanceService;
