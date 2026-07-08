import { z } from 'zod';
import { AdmissionStatus } from '@/services/public/admission.service';

export interface AdmissionApplication extends AdmissionStatus {
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  sscRoll: string;
  sscBoard: string;
  sscYear: string;
  sscGpa: number;
  previousInstitute: string;
  photoUrl: string;
  documentsUrls: string[];
}

export const reviewActionSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  remarks: z.string().min(5, 'Remarks/reason must be at least 5 characters long'),
});

export type ReviewActionInput = z.infer<typeof reviewActionSchema>;
export default AdmissionApplication;
