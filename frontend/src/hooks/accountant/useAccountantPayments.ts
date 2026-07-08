import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountantPaymentService } from '@/services/accountant/accountant-payment.service';
import { PaymentCollectionFormInput } from '@/types/accountant/payment.types';

export function useAccountantPayments() {
  return useQuery({
    queryKey: ['accountant', 'paymentsHistory'],
    queryFn: () => accountantPaymentService.getPaymentHistory(),
  });
}

export function useCollectPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PaymentCollectionFormInput) => accountantPaymentService.collectPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountant', 'paymentsHistory'] });
      queryClient.invalidateQueries({ queryKey: ['accountant', 'feesOverview'] });
      queryClient.invalidateQueries({ queryKey: ['accountant', 'ledger'] });
    },
  });
}
