import { useMutation, useQuery } from '@tanstack/react-query';
import { admissionService, AdmissionSubmissionInput } from '@/services/public/admission.service';

export function useAdmissionSubmit() {
  return useMutation({
    mutationFn: (data: AdmissionSubmissionInput) => admissionService.submitAdmission(data),
  });
}

export function useAdmissionStatus(trackingId: string) {
  return useQuery({
    queryKey: ['public', 'admission-status', trackingId],
    queryFn: () => admissionService.checkStatus(trackingId),
    enabled: !!trackingId, // Only execute if a tracking ID is provided
    retry: false, // Do not automatically retry if tracking ID not found
  });
}
