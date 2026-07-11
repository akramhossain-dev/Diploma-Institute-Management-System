import { accountantAxios } from '@/lib/accountantAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { PaymentHistoryItem, PaymentCollectionFormInput } from '@/types/accountant/payment.types';

export const accountantPaymentService = {
  getPaymentHistory: async (): Promise<PaymentHistoryItem[]> => {
    const response = await accountantAxios.get<ApiResponse<PaymentHistoryItem[]>>('/payments/history');
    return response.data.data;
  },

  collectPayment: async (data: PaymentCollectionFormInput): Promise<PaymentHistoryItem> => {
    const response = await accountantAxios.post<ApiResponse<PaymentHistoryItem>>('/payments/collect', data);
    return response.data.data;
  },
};

export default accountantPaymentService;

