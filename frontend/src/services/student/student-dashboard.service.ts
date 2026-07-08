import { studentAxios } from '@/lib/studentAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { StudentDashboardData } from '@/types/student/dashboard.types';

let mockStudentDashboard: StudentDashboardData = {
  attendanceRate: 92.4,
  totalDue: 3000,
  latestGpa: 3.84,
  latestGpaStatus: 'pass',
  nextClasses: [
    { _id: 'cls-1', courseCode: 'CSE-301', courseName: 'Data Communication', timeSlot: '09:00 AM - 10:30 AM', roomNo: 'Lab 3 (CST)', teacherName: 'Engr. Akram Hossain' },
    { _id: 'cls-2', courseCode: 'CSE-302', courseName: 'Microprocessor & Interfacing', timeSlot: '11:00 AM - 12:30 PM', roomNo: 'Room 402', teacherName: 'Dr. Sara Khan' },
  ],
  recentNotices: [
    { _id: 'not-1', title: 'Semester Exam Fees Circular Summer 2026', publishedDate: '2026-07-05' },
    { _id: 'not-2', title: 'Mid-term Results Declaration Notice', publishedDate: '2026-07-06' },
  ],
};

export const studentDashboardService = {
  getDashboardData: async (): Promise<StudentDashboardData> => {
    try {
      const response = await studentAxios.get<ApiResponse<StudentDashboardData>>('/dashboard');
      return response.data.data;
    } catch (e) {
      console.warn('[Student Service] GET /dashboard failed. Falling back to mock data.');
      return { ...mockStudentDashboard };
    }
  },
};

export default studentDashboardService;
