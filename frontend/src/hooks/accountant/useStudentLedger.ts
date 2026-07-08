import { useQuery } from '@tanstack/react-query';
import { accountantLedgerService } from '@/services/accountant/ledger.service';

export function useStudentLedger(studentId: string) {
  return useQuery({
    queryKey: ['accountant', 'ledger', studentId],
    queryFn: () => accountantLedgerService.getStudentLedger(studentId),
    enabled: !!studentId,
  });
}
