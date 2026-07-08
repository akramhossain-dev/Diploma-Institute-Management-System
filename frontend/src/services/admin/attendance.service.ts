import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AttendanceSummary, AttendanceReport } from '@/types/admin/attendance.types';

const mockReports: AttendanceReport[] = [
  {
    _id: 'rep-1',
    courseId: 'course-1',
    courseName: 'Computer Fundamentals',
    date: '2026-07-08',
    totalPresent: 22,
    totalAbsent: 3,
    totalStudents: 25,
    records: [
      { studentId: 's-1', studentName: 'Akram Hossain', studentCode: 'Roll 101', status: 'present' },
      { studentId: 's-2', studentName: 'Sara Khan', studentCode: 'Roll 102', status: 'absent' },
    ],
  },
];

export const adminAttendanceService = {
  getSummary: async (): Promise<AttendanceSummary> => {
    try {
      const response = await adminAxios.get<ApiResponse<AttendanceSummary>>('/attendance/summary');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /attendance/summary failed. Resolving mock metrics.');
      return {
        totalClasses: 124,
        attendancePercentage: 88.5,
        absentCount: 412,
        departmentAverages: [
          { departmentName: 'Computer Technology', percentage: 92.4 },
          { departmentName: 'Electronics Engineering', percentage: 84.6 },
        ],
      };
    }
  },

  getReports: async (): Promise<AttendanceReport[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<AttendanceReport[]>>('/attendance/reports');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /attendance/reports failed. Falling back to mock logs.');
      return [...mockReports];
    }
  },
};
export default adminAttendanceService;
