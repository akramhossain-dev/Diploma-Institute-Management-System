import { z } from 'zod';

export interface StudentAttendanceStatus {
  studentId: string;
  studentName: string;
  studentCode: string; 
  status: 'present' | 'absent';
}

export interface AttendanceReport {
  _id: string;
  courseId: string;
  courseName: string;
  date: string;
  totalPresent: number;
  totalAbsent: number;
  totalStudents: number;
  records: StudentAttendanceStatus[];
}

export interface AttendanceSummary {
  totalClasses: number;
  attendancePercentage: number;
  absentCount: number;
  departmentAverages: { departmentName: string; percentage: number }[];
}

export const attendanceMarkSchema = z.object({
  courseId: z.string().min(1, 'Course selector is required'),
  date: z.string().min(1, 'Date is required'),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(['present', 'absent']),
    })
  ),
});

export type AttendanceMarkInput = z.infer<typeof attendanceMarkSchema>;
export default AttendanceReport;
