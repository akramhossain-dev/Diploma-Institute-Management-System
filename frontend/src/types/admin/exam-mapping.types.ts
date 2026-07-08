import { z } from 'zod';

export interface ExamMapping {
  _id: string;
  examId: string;
  examName?: string;
  departmentId: string;
  departmentName?: string;
  semesterId: string;
  semesterName?: string;
  courseId: string;
  courseName: string;
  courseCode?: string;
  teacherId: string;
  teacherName: string;
  fullMarks: number;
  passMarks: number;
}

export const examMappingSchema = z.object({
  examId: z.string().min(1, 'Please select an examination'),
  departmentId: z.string().min(1, 'Please select a department'),
  semesterId: z.string().min(1, 'Please select a semester'),
  courseId: z.string().min(1, 'Please select a course'),
  teacherId: z.string().min(1, 'Please select a teacher'),
  fullMarks: z.coerce.number().min(10, 'Full marks must be at least 10').max(100, 'Full marks cannot exceed 100'),
  passMarks: z.coerce.number().min(4, 'Pass marks must be at least 4'),
}).refine((data) => data.passMarks <= data.fullMarks, {
  message: 'Pass marks cannot exceed full marks limit',
  path: ['passMarks'],
});

export type ExamMappingFormInput = z.infer<typeof examMappingSchema>;
export type CreateExamMappingInput = ExamMappingFormInput;
export type UpdateExamMappingInput = Partial<ExamMappingFormInput>;
export default ExamMapping;
