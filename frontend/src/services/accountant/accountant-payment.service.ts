import { accountantAxios } from '@/lib/accountantAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { PaymentHistoryItem, PaymentCollectionFormInput } from '@/types/accountant/payment.types';

const mockPaymentHistory: PaymentHistoryItem[] = [
  {
    _id: 'pay-rec-1',
    studentId: 'stud-1',
    studentName: 'Ahsan Habib',
    feeStructureName: 'Admission Fee 2026',
    amount: 15000,
    paymentDate: '2026-07-05',
    paymentMethod: 'cash',
    reference: 'Direct Counter Cash',
  },
  {
    _id: 'pay-rec-2',
    studentId: 'stud-2',
    studentName: 'Nusrat Jahan',
    feeStructureName: 'Admission Fee 2026',
    amount: 15000,
    paymentDate: '2026-07-06',
    paymentMethod: 'bank',
    reference: 'DBBL Transaction Ref: 829302',
  },
  {
    _id: 'pay-rec-3',
    studentId: 'stud-2',
    studentName: 'Nusrat Jahan',
    feeStructureName: 'Semester Exam Fee 2026',
    amount: 3000,
    paymentDate: '2026-07-06',
    paymentMethod: 'mobile_banking',
    reference: 'bKash TrxID: 9X82KD8',
  },
];

export const accountantPaymentService = {
  getPaymentHistory: async (): Promise<PaymentHistoryItem[]> => {
    try {
      const response = await accountantAxios.get<ApiResponse<PaymentHistoryItem[]>>('/payments/history');
      return response.data.data;
    } catch (e) {
      throw e;
    }
  },

  collectPayment: async (data: PaymentCollectionFormInput): Promise<PaymentHistoryItem> => {
    try {
      const response = await accountantAxios.post<ApiResponse<PaymentHistoryItem>>('/payments/collect', data);
      return response.data.data;
    } catch (e) {
      throw e;
    }
  },
};

export default accountantPaymentService;
