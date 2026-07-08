import { useQuery } from '@tanstack/react-query';
import { instituteService } from '@/services/public/institute.service';

export function useInstituteInfo() {
  return useQuery({
    queryKey: ['public', 'institute'],
    queryFn: () => instituteService.getInfo(),
    staleTime: 1000 * 60 * 15, // 15 minutes cache
  });
}
