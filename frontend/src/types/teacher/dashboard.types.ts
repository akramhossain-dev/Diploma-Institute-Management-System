export interface TeacherDashboardData {
  assignedCoursesCount: number;
  pendingAttendanceCount: number;
  pendingMarksCount: number;
  todayClasses: {
    _id: string;
    courseCode: string;
    courseName: string;
    timeSlot: string;
    roomNo: string;
    semesterName: string;
    departmentName: string;
  }[];
  recentNotices: {
    _id: string;
    title: string;
    publishedDate: string;
  }[];
}
