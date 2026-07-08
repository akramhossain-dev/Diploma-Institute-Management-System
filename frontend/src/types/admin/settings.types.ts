import { z } from 'zod';

export interface InstituteSettings {
  name: string;
  code: string;
  established: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logo?: string;
  description?: string;
  admissionOpen: boolean;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export const settingsFormSchema = z.object({
  name: z.string().min(3, 'Institute name must be at least 3 characters long'),
  code: z.string().min(3, 'EMIS code must be at least 3 characters long'),
  established: z.string().min(4, 'Establishment year is required'),
  address: z.string().min(5, 'Address is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  website: z.string().url('Please enter a valid URL website address'),
  logo: z.string().optional(),
  description: z.string().optional(),
  admissionOpen: z.boolean(),
  socialLinks: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
});

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
export type UpdateSettingsInput = SettingsFormInput;
export default InstituteSettings;
