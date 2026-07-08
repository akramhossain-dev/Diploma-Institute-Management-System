import { useQuery } from '@tanstack/react-query';
import { adminRoutineService } from '@/services/admin/routine.service';

export function useTeacherRoutine(teacherId?: string) {
  return useQuery({
    queryKey: ['teacher', 'routine', teacherId],
    queryFn: async () => {
      const allSlots = await adminRoutineService.getRoutineSlots();
      if (!teacherId) return allSlots;
      // Filter slots assigned to this specific teacher ID
      return allSlots.filter((slot) => slot.teacherId === teacherId);
    },
    enabled: !!teacherId,
  });
}
export default useTeacherRoutine;
