export interface AdminDashboardSummary {
  totalStudents: number;
  totalTeachers: number;
  totalDepartments: number;
  totalAdmissions: number;
  totalDues: number;
  totalCollections: number;
  attendanceOverview: {
    presentRate: number;
    absentRate: number;
  };
  examOverview: {
    publishedExams: number;
    draftExams: number;
  };
  recentAdmissions: {
    _id: string;
    studentName: string;
    departmentName: string;
    admissionDate: string;
  }[];
  recentNotices: {
    _id: string;
    title: string;
    publishedDate: string;
    audience: string;
  }[];
}

export interface StudentReportRow {
  studentRoll: string;
  fullName: string;
  departmentName: string;
  semesterName: string;
  admissionDate: string;
  status: 'active' | 'inactive';
}

export interface AttendanceReportRow {
  date: string;
  departmentName: string;
  semesterName: string;
  totalPresent: number;
  totalAbsent: number;
  percentage: number;
}

export interface FinanceReportRow {
  date: string;
  studentName: string;
  feeTitle: string;
  amount: number;
  paymentMethod: string;
  reference: string;
}

export interface AnalyticsTrendPoint {
  label: string;
  value: number;
}

export interface AdminAnalyticsData {
  studentGrowth: AnalyticsTrendPoint[];
  feeCollection: AnalyticsTrendPoint[];
  attendanceTrend: AnalyticsTrendPoint[];
  resultPerformance: AnalyticsTrendPoint[];
  admissionTrend: AnalyticsTrendPoint[];
}
