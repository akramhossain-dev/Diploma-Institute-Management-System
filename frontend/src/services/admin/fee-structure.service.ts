import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { FeeStructure, CreateFeeStructureInput, UpdateFeeStructureInput } from '@/types/admin/fee-structure.types';

export const adminFeeStructureService = {
  getFeeStructures: async (): Promise<FeeStructure[]> => {
    const response = await adminAxios.get<ApiResponse<FeeStructure[]>>('/fee-structures');
    return response.data.data;
  },

  getFeeStructure: async (id: string): Promise<FeeStructure> => {
    const response = await adminAxios.get<ApiResponse<FeeStructure>>(`/fee-structures/${id}`);
    return response.data.data;
  },

  createFeeStructure: async (data: CreateFeeStructureInput): Promise<FeeStructure> => {
    const response = await adminAxios.post<ApiResponse<FeeStructure>>('/fee-structures', data);
    return response.data.data;
  },

  updateFeeStructure: async (id: string, data: UpdateFeeStructureInput): Promise<FeeStructure> => {
    const response = await adminAxios.put<ApiResponse<FeeStructure>>(`/fee-structures/${id}`, data);
    return response.data.data;
  },

  deleteFeeStructure: async (id: string): Promise<void> => {
    await adminAxios.delete(`/fee-structures/${id}`);
  },
};

export default adminFeeStructureService;
