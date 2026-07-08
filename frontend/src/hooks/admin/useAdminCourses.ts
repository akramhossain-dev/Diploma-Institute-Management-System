import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCourseService } from '@/services/admin/course.service';
import { CreateCourseInput, UpdateCourseInput } from '@/types/admin/course.types';

export function useAdminCourses() {
  return useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: () => adminCourseService.getCourses(),
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseInput) => adminCourseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseInput }) =>
      adminCourseService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCourseService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
}
