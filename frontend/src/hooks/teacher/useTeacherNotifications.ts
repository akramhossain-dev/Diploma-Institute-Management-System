import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherNotificationService } from '@/services/teacher/teacher-notification.service';

export function useTeacherNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['teacher', 'notifications'],
    queryFn: () => teacherNotificationService.getNotifications(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => teacherNotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => teacherNotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'notifications'] });
    },
  });

  const unreadCount = query.data?.filter(n => !n.read).length || 0;

  return {
    notifications: query.data || [],
    unreadCount,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    isMarking: markAsReadMutation.isPending || markAllAsReadMutation.isPending,
  };
}

export default useTeacherNotifications;
