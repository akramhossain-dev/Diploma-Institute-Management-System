export interface StudentDashboardData {
  attendanceRate: number;
  totalDue: number;
  latestGpa: number;
  latestGpaStatus: 'pass' | 'fail' | string;
  nextClasses: {
    _id: string;
    courseCode: string;
    courseName: string;
    timeSlot: string;
    roomNo: string;
    teacherName: string;
  }[];
  recentNotices: {
    _id: string;
    title: string;
    publishedDate: string;
  }[];
}
