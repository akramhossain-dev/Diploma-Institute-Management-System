export interface AccountantDashboardData {
  todayCollection: number;
  totalPendingDues: number;
  paymentCountThisMonth: number;
  recentTransactions: {
    _id: string;
    studentName: string;
    studentRoll: string;
    feeTitle: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
  }[];
  recentNotices: {
    _id: string;
    title: string;
    publishedDate: string;
  }[];
}
