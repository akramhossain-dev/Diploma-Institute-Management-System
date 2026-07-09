export interface ImportJob {
  _id: string;
  module: 'students' | 'teachers' | 'accountants' | 'fees';
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  errorLog?: string;
  startedAt: string;
  completedAt?: string;
}
