import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminNotificationService } from '@/services/admin/admin-notification.service';

export function useAdminNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: () => adminNotificationService.getNotifications(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => adminNotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => adminNotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
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

export default useAdminNotifications;
