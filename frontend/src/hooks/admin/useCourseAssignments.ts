import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCourseAssignmentService } from '@/services/admin/course-assignment.service';
import { CreateAssignmentInput, UpdateAssignmentInput } from '@/types/admin/course-assignment.types';

export function useCourseAssignments() {
  return useQuery({
    queryKey: ['admin', 'course-assignments'],
    queryFn: () => adminCourseAssignmentService.getAssignments(),
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAssignmentInput) => adminCourseAssignmentService.createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-assignments'] });
      // Invalidate teacher assigned courses too so they refresh instantly!
      queryClient.invalidateQueries({ queryKey: ['teacher', 'assigned-courses'] });
    },
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentInput }) =>
      adminCourseAssignmentService.updateAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'assigned-courses'] });
    },
  });
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCourseAssignmentService.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'course-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'assigned-courses'] });
    },
  });
}
