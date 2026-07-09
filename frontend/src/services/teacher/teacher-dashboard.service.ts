import { teacherAxios } from '@/lib/teacherAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { TeacherDashboardData } from '@/types/teacher/dashboard.types';

const mockTeacherDashboard: TeacherDashboardData = {
  assignedCoursesCount: 4,
  pendingAttendanceCount: 2,
  pendingMarksCount: 2,
  todayClasses: [
    { _id: 'cls-1', courseCode: 'CSE-301', courseName: 'Data Communication', timeSlot: '09:00 AM - 10:30 AM', roomNo: 'Lab 3 (CST)', semesterName: '3rd Semester', departmentName: 'Computer Technology' },
    { _id: 'cls-2', courseCode: 'CSE-305', courseName: 'Operating Systems', timeSlot: '01:30 PM - 03:00 PM', roomNo: 'Room 304', semesterName: '5th Semester', departmentName: 'Computer Technology' },
  ],
  recentNotices: [
    { _id: 'not-1', title: 'Faculty Coordination Meeting Circular', publishedDate: '2026-07-04' },
    { _id: 'not-2', title: 'Mid-term Results Declaration Notice', publishedDate: '2026-07-06' },
  ],
};

export const teacherDashboardService = {
  getDashboardData: async (): Promise<TeacherDashboardData> => {
    try {
      const response = await teacherAxios.get<ApiResponse<TeacherDashboardData>>('/dashboard');
      return response.data.data;
    } catch (e) {
      throw e;
    }
  },
};

export default teacherDashboardService;
