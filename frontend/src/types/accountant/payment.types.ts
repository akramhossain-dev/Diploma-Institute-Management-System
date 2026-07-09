import { z } from 'zod';

export interface StudentBillingOverview {
  studentId: string;
  studentName: string;
  studentRoll: string;
  departmentName: string;
  semesterName: string;
  sessionName: string;
  totalAssigned: number;
  totalPaid: number;
  totalDue: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid' | 'overdue';
  lastPaymentDate?: string;
}

export interface LedgerEntry {
  _id: string;
  date: string;
  description: string; // e.g. "Fee Assigned: Admission Fee", "Payment Received - Cash"
  debit: number; // fee assigned / charge
  credit: number; // payment received
  balance: number; // running balance
}

export interface PaymentHistoryItem {
  _id: string;
  studentId: string;
  studentName?: string;
  feeStructureName?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank' | 'mobile_banking';
  reference?: string;
}

export const paymentCollectionSchema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
  feeStructureId: z.string().min(1, 'Please select an assigned fee or billing item'),
  amount: z.number().positive('Payment amount must be positive'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMethod: z.enum(['cash', 'bank', 'mobile_banking'], {
    message: 'Please select a valid payment method',
  }),
  reference: z.string().optional(),
});

export type PaymentCollectionFormInput = z.infer<typeof paymentCollectionSchema>;
