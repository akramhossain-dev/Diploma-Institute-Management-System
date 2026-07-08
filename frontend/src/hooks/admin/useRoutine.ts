import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRoutineService } from '@/services/admin/routine.service';
import { CreateRoutineInput, UpdateRoutineInput } from '@/types/admin/routine.types';

export function useRoutine() {
  return useQuery({
    queryKey: ['admin', 'routines'],
    queryFn: () => adminRoutineService.getRoutineSlots(),
  });
}

export function useCreateRoutine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoutineInput) => adminRoutineService.createRoutineSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'routines'] });
      // Invalidate student and teacher routine calendars
      queryClient.invalidateQueries({ queryKey: ['teacher', 'routine'] });
      queryClient.invalidateQueries({ queryKey: ['student', 'routine'] });
    },
  });
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoutineInput }) =>
      adminRoutineService.updateRoutineSlot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'routines'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'routine'] });
      queryClient.invalidateQueries({ queryKey: ['student', 'routine'] });
    },
  });
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRoutineService.deleteRoutineSlot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'routines'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'routine'] });
      queryClient.invalidateQueries({ queryKey: ['student', 'routine'] });
    },
  });
}
