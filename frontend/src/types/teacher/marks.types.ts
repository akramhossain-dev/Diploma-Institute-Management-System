import { z } from 'zod';

export interface StudentMarksRecord {
  studentId: string;
  studentName: string;
  studentCode: string; 
  obtainedMarks?: number;
  isAbsent?: boolean;
}

export interface TeacherExamDuty {
  _id: string;
  examId: string;
  examName: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  semesterName: string;
  fullMarks: number;
  passMarks: number;
  marksStatus: 'pending' | 'submitted';
}

export const marksRecordSchema = z.object({
  studentId: z.string(),
  obtainedMarks: z.coerce.number().min(0, 'Marks cannot be negative'),
  isAbsent: z.boolean().optional(),
});

export const marksSubmissionSchema = z.object({
  examId: z.string().min(1, 'Exam is required'),
  courseId: z.string().min(1, 'Course is required'),
  records: z.array(marksRecordSchema),
});

export type MarksSubmissionInput = z.infer<typeof marksSubmissionSchema>;
export default TeacherExamDuty;
