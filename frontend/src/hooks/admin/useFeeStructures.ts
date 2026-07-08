import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminFeeStructureService } from '@/services/admin/fee-structure.service';
import { CreateFeeStructureInput, UpdateFeeStructureInput } from '@/types/admin/fee-structure.types';

export function useFeeStructures() {
  return useQuery({
    queryKey: ['admin', 'feeStructures'],
    queryFn: () => adminFeeStructureService.getFeeStructures(),
  });
}

export function useFeeStructure(id: string) {
  return useQuery({
    queryKey: ['admin', 'feeStructures', id],
    queryFn: () => adminFeeStructureService.getFeeStructure(id),
    enabled: !!id,
  });
}

export function useCreateFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFeeStructureInput) => adminFeeStructureService.createFeeStructure(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feeStructures'] });
    },
  });
}

export function useUpdateFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeeStructureInput }) =>
      adminFeeStructureService.updateFeeStructure(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feeStructures'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'feeStructures', variables.id] });
    },
  });
}

export function useDeleteFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminFeeStructureService.deleteFeeStructure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'feeStructures'] });
    },
  });
}
