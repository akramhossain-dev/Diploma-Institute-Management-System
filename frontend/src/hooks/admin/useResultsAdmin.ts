import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminResultService } from '@/services/admin/result.service';

export function useResultsOverview() {
  return useQuery({
    queryKey: ['admin', 'results-processed'],
    queryFn: () => adminResultService.getResultsOverview(),
  });
}

export function usePublishResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      adminResultService.publishResult(id, publish),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'results-processed'] });
      // Invalidate student results queries so the update reflects immediately!
      queryClient.invalidateQueries({ queryKey: ['student', 'results'] });
    },
  });
}
export default useResultsOverview;
