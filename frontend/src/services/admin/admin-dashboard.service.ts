import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { AdminDashboardSummary, StudentReportRow, AttendanceReportRow, FinanceReportRow, AdminAnalyticsData } from '@/types/admin/dashboard.types';

const mockSummary: AdminDashboardSummary = {
  totalStudents: 1520,
  totalTeachers: 45,
  totalDepartments: 6,
  totalAdmissions: 240,
  totalDues: 450000,
  totalCollections: 1850000,
  attendanceOverview: {
    presentRate: 92.5,
    absentRate: 7.5,
  },
  examOverview: {
    publishedExams: 3,
    draftExams: 1,
  },
  recentAdmissions: [
    { _id: 'adm-1', studentName: 'Imran Khan', departmentName: 'Computer Technology', admissionDate: '2026-07-01' },
    { _id: 'adm-2', studentName: 'Faria Yasmin', departmentName: 'Civil Engineering Technology', admissionDate: '2026-07-02' },
    { _id: 'adm-3', studentName: 'Tariq Jamil', departmentName: 'Electronics Technology', admissionDate: '2026-07-04' },
  ],
  recentNotices: [
    { _id: 'not-1', title: 'Semester Exam Fees Circular Summer 2026', publishedDate: '2026-07-05', audience: 'all' },
    { _id: 'not-2', title: 'Mid-term Results Declaration Notice', publishedDate: '2026-07-06', audience: 'student' },
  ],
};

const mockStudentReports: StudentReportRow[] = [
  { studentRoll: '102938', fullName: 'Ahsan Habib', departmentName: 'Computer Technology', semesterName: '3rd Semester', admissionDate: '2025-01-10', status: 'active' },
  { studentRoll: '102939', fullName: 'Nusrat Jahan', departmentName: 'Electronics Technology', semesterName: '3rd Semester', admissionDate: '2025-01-12', status: 'active' },
  { studentRoll: '102940', fullName: 'Rifat Al-Mumin', departmentName: 'Computer Technology', semesterName: '1st Semester', admissionDate: '2026-01-05', status: 'active' },
];

const mockAttendanceReports: AttendanceReportRow[] = [
  { date: '2026-07-05', departmentName: 'Computer Technology', semesterName: '3rd Semester', totalPresent: 42, totalAbsent: 3, percentage: 93.3 },
  { date: '2026-07-05', departmentName: 'Electronics Technology', semesterName: '3rd Semester', totalPresent: 28, totalAbsent: 4, percentage: 87.5 },
  { date: '2026-07-06', departmentName: 'Computer Technology', semesterName: '3rd Semester', totalPresent: 44, totalAbsent: 1, percentage: 97.8 },
];

const mockFinanceReports: FinanceReportRow[] = [
  { date: '2026-07-05', studentName: 'Ahsan Habib', feeTitle: 'Admission Fee 2026', amount: 15000, paymentMethod: 'cash', reference: 'Direct Counter Cash' },
  { date: '2026-07-06', studentName: 'Nusrat Jahan', feeTitle: 'Admission Fee 2026', amount: 15000, paymentMethod: 'bank', reference: 'DBBL Transaction Ref: 829302' },
  { date: '2026-07-06', studentName: 'Nusrat Jahan', feeTitle: 'Semester Exam Fee 2026', amount: 3000, paymentMethod: 'mobile_banking', reference: 'bKash TrxID: 9X82KD8' },
];

const mockAnalytics: AdminAnalyticsData = {
  studentGrowth: [
    { label: 'Jan 2026', value: 1200 },
    { label: 'Feb 2026', value: 1280 },
    { label: 'Mar 2026', value: 1350 },
    { label: 'Apr 2026', value: 1410 },
    { label: 'May 2026', value: 1480 },
    { label: 'Jun 2026', value: 1520 },
  ],
  feeCollection: [
    { label: 'Jan', value: 450000 },
    { label: 'Feb', value: 380000 },
    { label: 'Mar', value: 290000 },
    { label: 'Apr', value: 310000 },
    { label: 'May', value: 520000 },
    { label: 'Jun', value: 680000 },
  ],
  attendanceTrend: [
    { label: 'Mon', value: 92.4 },
    { label: 'Tue', value: 94.1 },
    { label: 'Wed', value: 91.8 },
    { label: 'Thu', value: 93.5 },
    { label: 'Fri', value: 89.6 },
  ],
  resultPerformance: [
    { label: 'CST', value: 3.42 },
    { label: 'ENT', value: 3.12 },
    { label: 'CE', value: 3.25 },
    { label: 'MT', value: 2.98 },
  ],
  admissionTrend: [
    { label: '2021', value: 180 },
    { label: '2022', value: 210 },
    { label: '2023', value: 220 },
    { label: '2024', value: 250 },
    { label: '2025', value: 280 },
    { label: '2026', value: 310 },
  ],
};

export const adminDashboardService = {
  getDashboardSummary: async (): Promise<AdminDashboardSummary> => {
    try {
      const response = await adminAxios.get<ApiResponse<AdminDashboardSummary>>('/dashboard/summary');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /dashboard/summary failed. Falling back to mock data.');
      return { ...mockSummary };
    }
  },

  getStudentReport: async (): Promise<StudentReportRow[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<StudentReportRow[]>>('/reports/students');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /reports/students failed. Falling back to mock data.');
      return [...mockStudentReports];
    }
  },

  getAttendanceReport: async (): Promise<AttendanceReportRow[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<AttendanceReportRow[]>>('/reports/attendance');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /reports/attendance failed. Falling back to mock data.');
      return [...mockAttendanceReports];
    }
  },

  getFinanceReport: async (): Promise<FinanceReportRow[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<FinanceReportRow[]>>('/reports/finance');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /reports/finance failed. Falling back to mock data.');
      return [...mockFinanceReports];
    }
  },

  getAnalyticsData: async (): Promise<AdminAnalyticsData> => {
    try {
      const response = await adminAxios.get<ApiResponse<AdminAnalyticsData>>('/analytics/summary');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /analytics/summary failed. Falling back to mock data.');
      return { ...mockAnalytics };
    }
  },
};

export default adminDashboardService;
