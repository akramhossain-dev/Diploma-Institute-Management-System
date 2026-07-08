import { z } from 'zod';

export interface Accountant {
  _id: string;
  accountantId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  designation: string;
  joiningDate: string;
  photoUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const accountantFormSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters long'),
  address: z.string().min(5, 'Address is required'),
  designation: z.string().min(2, 'Designation is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  accountantId: z.string().min(3, 'Accountant ID is required'),
  photoUrl: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

export type AccountantFormInput = z.infer<typeof accountantFormSchema>;
export type CreateAccountantInput = AccountantFormInput;
export type UpdateAccountantInput = Partial<AccountantFormInput>;
export default Accountant;
