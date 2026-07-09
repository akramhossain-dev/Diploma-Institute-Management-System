import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Accountant, CreateAccountantInput, UpdateAccountantInput } from '@/types/admin/accountant.types';

export const adminAccountantService = {
  getAccountants: async (): Promise<Accountant[]> => {
    const response = await adminAxios.get<ApiResponse<Accountant[]>>('/accountants');
    return response.data.data;
  },

  getAccountant: async (id: string): Promise<Accountant> => {
    const response = await adminAxios.get<ApiResponse<Accountant>>(`/accountants/${id}`);
    return response.data.data;
  },

  createAccountant: async (data: CreateAccountantInput): Promise<Accountant> => {
    const response = await adminAxios.post<ApiResponse<Accountant>>('/accountants', data);
    return response.data.data;
  },

  updateAccountant: async (id: string, data: UpdateAccountantInput): Promise<Accountant> => {
    const response = await adminAxios.put<ApiResponse<Accountant>>(`/accountants/${id}`, data);
    return response.data.data;
  },
};
export default adminAccountantService;
