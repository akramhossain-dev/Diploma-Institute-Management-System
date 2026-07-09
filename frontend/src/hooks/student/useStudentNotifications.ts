import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentNotificationService } from '@/services/student/student-notification.service';

export function useStudentNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['student', 'notifications'],
    queryFn: () => studentNotificationService.getNotifications(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => studentNotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => studentNotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', 'notifications'] });
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

export default useStudentNotifications;
