import { z } from 'zod';

export interface Exam {
  _id: string;
  name: string; 
  type: 'midterm' | 'final' | 'practical';
  sessionId: string;
  sessionName?: string;
  semesterId: string;
  semesterName?: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published';
  createdAt: string;
}

export const examSchema = z.object({
  name: z.string().min(3, 'Exam name must be at least 3 characters long'),
  type: z.enum(['midterm', 'final', 'practical']),
  sessionId: z.string().min(1, 'Please select an academic session'),
  semesterId: z.string().min(1, 'Please select a semester'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['draft', 'published']),
});

export type ExamFormInput = z.infer<typeof examSchema>;
export type CreateExamInput = ExamFormInput;
export type UpdateExamInput = Partial<ExamFormInput>;
export default Exam;
