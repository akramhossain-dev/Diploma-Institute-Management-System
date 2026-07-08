import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAccountantService } from '@/services/admin/accountant.service';
import { CreateAccountantInput, UpdateAccountantInput } from '@/types/admin/accountant.types';

export function useAdminAccountants() {
  return useQuery({
    queryKey: ['admin', 'accountants'],
    queryFn: () => adminAccountantService.getAccountants(),
  });
}

export function useAdminAccountant(id: string) {
  return useQuery({
    queryKey: ['admin', 'accountants', id],
    queryFn: () => adminAccountantService.getAccountant(id),
    enabled: !!id,
  });
}

export function useCreateAccountant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccountantInput) => adminAccountantService.createAccountant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accountants'] });
    },
  });
}

export function useUpdateAccountant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountantInput }) =>
      adminAccountantService.updateAccountant(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'accountants'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'accountants', variables.id] });
    },
  });
}
