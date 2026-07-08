import { z } from 'zod';

// Step 1: Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters long'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Please select a valid gender option',
  }),
  phone: z.string().min(10, 'Phone number must be at least 10 characters long'),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
});

// Step 2: Academic & Department Selection Schema
export const academicInfoSchema = z.object({
  sscRoll: z.string().min(5, 'SSC Roll must be at least 5 characters long'),
  sscBoard: z.string().min(1, 'SSC Board is required'),
  sscYear: z.string().min(4, 'SSC Year must be a 4-digit number'),
  sscGpa: z.coerce.number().min(2.0, 'Minimum SSC GPA requirement is 2.0').max(5.0, 'SSC GPA cannot exceed 5.0'),
  previousInstitute: z.string().min(3, 'Previous school/institute name must be at least 3 characters'),
  departmentCode: z.string().min(1, 'Please select a desired department program'),
});

// Step 3: Document Upload Schema
export const documentUploadSchema = z.object({
  photoUrl: z.string().url('Please upload a profile photo'),
  documentsUrls: z.array(z.string().url()).min(1, 'Please upload at least one academic certificate/transcript copy'),
});

// Combined schema for final submit
export const admissionFormSchema = personalInfoSchema
  .merge(academicInfoSchema)
  .merge(documentUploadSchema);

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type AcademicInfoInput = z.infer<typeof academicInfoSchema>;
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type AdmissionFormInput = z.infer<typeof admissionFormSchema>;
