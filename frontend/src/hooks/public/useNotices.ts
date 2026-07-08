import { useQuery } from '@tanstack/react-query';
import { noticeService } from '@/services/public/notice.service';

export function useNotices(params?: { page?: number; limit?: number; search?: string; category?: string }) {
  return useQuery({
    queryKey: ['public', 'notices', params || {}],
    queryFn: () => noticeService.getNotices(params),
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  });
}
export default useNotices;
