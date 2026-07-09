import { accountantAxios } from '@/lib/accountantAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { LedgerEntry } from '@/types/accountant/payment.types';

const mockLedgers: Record<string, LedgerEntry[]> = {
  'stud-1': [
    {
      _id: 'l-1',
      date: '2026-07-01',
      description: 'Assigned: Admission Fee 2026',
      debit: 15000,
      credit: 0,
      balance: 15000,
    },
    {
      _id: 'l-2',
      date: '2026-07-02',
      description: 'Assigned: Semester Exam Fee 2026',
      debit: 3000,
      credit: 0,
      balance: 18000,
    },
    {
      _id: 'l-3',
      date: '2026-07-05',
      description: 'Payment Received: cash (Direct Counter Cash)',
      debit: 0,
      credit: 15000,
      balance: 3000,
    },
  ],
  'stud-2': [
    {
      _id: 'l-4',
      date: '2026-07-01',
      description: 'Assigned: Admission Fee 2026',
      debit: 15000,
      credit: 0,
      balance: 15000,
    },
    {
      _id: 'l-5',
      date: '2026-07-02',
      description: 'Assigned: Semester Exam Fee 2026',
      debit: 3000,
      credit: 0,
      balance: 18000,
    },
    {
      _id: 'l-6',
      date: '2026-07-06',
      description: 'Payment Received: bank (DBBL Transaction Ref: 829302)',
      debit: 0,
      credit: 15000,
      balance: 3000,
    },
    {
      _id: 'l-7',
      date: '2026-07-06',
      description: 'Payment Received: mobile_banking (bKash TrxID: 9X82KD8)',
      debit: 0,
      credit: 3000,
      balance: 0,
    },
  ],
  'stud-3': [
    {
      _id: 'l-8',
      date: '2026-07-01',
      description: 'Assigned: Admission Fee 2026',
      debit: 15000,
      credit: 0,
      balance: 15000,
    },
  ],
};

export const accountantLedgerService = {
  getStudentLedger: async (studentId: string): Promise<LedgerEntry[]> => {
    try {
      const response = await accountantAxios.get<ApiResponse<LedgerEntry[]>>(`/ledger/${studentId}`);
      return response.data.data;
    } catch (e) {
      console.warn(`[Accountant Service] GET /ledger/${studentId} failed. Falling back to mock ledger data.`);
      return mockLedgers[studentId] || [];
    }
  },
};

export default accountantLedgerService;
