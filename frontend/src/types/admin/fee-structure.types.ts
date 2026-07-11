import { z } from 'zod';

export interface FeeStructure {
  _id: string;
  name: string;
  departmentId?: string; 
  departmentName?: string;
  semesterId?: string; 
  semesterName?: string;
  sessionId: string;
  sessionName?: string;
  amount: number;
  dueDate?: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const feeStructureSchema = z.object({
  name: z.string().min(3, 'Fee title must be at least 3 characters long'),
  departmentId: z.string().optional(),
  semesterId: z.string().optional(),
  sessionId: z.string().min(1, 'Please select an academic session'),
  amount: z.number().positive('Amount must be a positive number'),
  dueDate: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

export type FeeStructureFormInput = z.infer<typeof feeStructureSchema>;
export type CreateFeeStructureInput = FeeStructureFormInput;
export type UpdateFeeStructureInput = Partial<FeeStructureFormInput>;
