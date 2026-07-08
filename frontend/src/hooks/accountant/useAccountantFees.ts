import { useQuery } from '@tanstack/react-query';
import { accountantFeeService } from '@/services/accountant/accountant-fee.service';

export function useAccountantFees() {
  return useQuery({
    queryKey: ['accountant', 'feesOverview'],
    queryFn: () => accountantFeeService.getFeesOverview(),
  });
}
