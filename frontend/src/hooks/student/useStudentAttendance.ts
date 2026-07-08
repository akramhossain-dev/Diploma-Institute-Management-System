import { useQuery } from '@tanstack/react-query';
import { studentAttendanceService } from '@/services/student/student-attendance.service';

export function useStudentAttendanceSummary() {
  return useQuery({
    queryKey: ['student', 'attendance', 'summary'],
    queryFn: () => studentAttendanceService.getSummary(),
  });
}

export function useStudentAttendanceHistory() {
  return useQuery({
    queryKey: ['student', 'attendance', 'history'],
    queryFn: () => studentAttendanceService.getHistory(),
  });
}
