import { useQuery } from '@tanstack/react-query';
import { adminAttendanceService } from '@/services/admin/attendance.service';

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ['admin', 'attendance-summary'],
    queryFn: () => adminAttendanceService.getSummary(),
  });
}

export function useAttendanceReports() {
  return useQuery({
    queryKey: ['admin', 'attendance-reports'],
    queryFn: () => adminAttendanceService.getReports(),
  });
}
