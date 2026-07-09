import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AttendanceSummary, AttendanceReport } from '@/types/admin/attendance.types';

export const adminAttendanceService = {
  getSummary: async (): Promise<AttendanceSummary> => {
    const response = await adminAxios.get<ApiResponse<AttendanceSummary>>('/attendance/summary');
    return response.data.data;
  },

  getReports: async (): Promise<AttendanceReport[]> => {
    const response = await adminAxios.get<ApiResponse<AttendanceReport[]>>('/attendance/reports');
    return response.data.data;
  },
};
export default adminAttendanceService;
