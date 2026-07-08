import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAdmissionReviewService } from '@/services/admin/admission-review.service';

export function useAdminAdmissionsReview() {
  return useQuery({
    queryKey: ['admin', 'admission-reviews'],
    queryFn: () => adminAdmissionReviewService.getApplications(),
  });
}

export function useAdminAdmissionReview(id: string) {
  return useQuery({
    queryKey: ['admin', 'admission-reviews', id],
    queryFn: () => adminAdmissionReviewService.getApplication(id),
    enabled: !!id,
  });
}

export function useUpdateAdmissionReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, remarks }: { id: string; status: 'approved' | 'rejected'; remarks: string }) =>
      adminAdmissionReviewService.updateStatus(id, status, remarks),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'admission-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'admission-reviews', variables.id] });
      // Invalidate public admission status cache so applicant gets the feedback instantly!
      queryClient.invalidateQueries({ queryKey: ['public', 'admission-status'] });
    },
  });
}
export default useAdminAdmissionsReview;
