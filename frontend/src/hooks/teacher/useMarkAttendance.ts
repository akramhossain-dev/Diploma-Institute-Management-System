import { useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherAttendanceService } from '@/services/teacher/teacher-attendance.service';
import { AttendanceMarkInput } from '@/types/admin/attendance.types';

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AttendanceMarkInput) => teacherAttendanceService.markAttendance(data),
    onSuccess: () => {
      // Invalidate both admin summaries and student attendance lists to reflect immediately!
      queryClient.invalidateQueries({ queryKey: ['admin', 'attendance-summary'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'attendance-reports'] });
      queryClient.invalidateQueries({ queryKey: ['student', 'attendance'] });
    },
  });
}
export default useMarkAttendance;
