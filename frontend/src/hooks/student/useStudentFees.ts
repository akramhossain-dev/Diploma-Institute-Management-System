import { useQuery } from '@tanstack/react-query';
import { studentFeeService } from '@/services/student/student-fee.service';

export function useStudentFees() {
  return useQuery({
    queryKey: ['student', 'fees'],
    queryFn: () => studentFeeService.getStudentFees(),
  });
}

export function useStudentPaymentHistory() {
  return useQuery({
    queryKey: ['student', 'paymentHistory'],
    queryFn: () => studentFeeService.getStudentPaymentHistory(),
  });
}

export function useStudentFeeSummary() {
  return useQuery({
    queryKey: ['student', 'feeSummary'],
    queryFn: () => studentFeeService.getStudentFeeSummary(),
  });
}
