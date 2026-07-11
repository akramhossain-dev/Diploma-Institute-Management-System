export interface StudentFeeSummary {
  totalAssigned: number;
  totalPaid: number;
  totalDue: number;
}

export interface StudentFeeItem {
  _id: string;
  name: string; 
  amount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate?: string;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
}

export interface StudentPaymentItem {
  _id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank' | 'mobile_banking';
  reference?: string;
}
