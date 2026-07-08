import { useQuery } from '@tanstack/react-query';
import { adminPaymentService } from '@/services/admin/admin-payment.service';

export function useAdminPaymentsOverview() {
  return useQuery({
    queryKey: ['admin', 'paymentsOverview'],
    queryFn: () => adminPaymentService.getPaymentsOverview(),
  });
}
