import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Accountant, CreateAccountantInput, UpdateAccountantInput } from '@/types/admin/accountant.types';

const mockAccountants: Accountant[] = [
  {
    _id: 'a-1',
    accountantId: 'ACC-2024-01',
    fullName: 'Mohammad Farhan',
    email: 'farhan@ndi.edu.bd',
    phone: '+8801522233344',
    address: 'Dhanmondi, Dhaka',
    designation: 'Senior Accountant',
    joiningDate: '2024-01-15',
    photoUrl: 'https://cdn.dims.edu.bd/uploads/mock_accountant1.png',
    status: 'active',
    createdAt: '2024-01-15T09:00:00Z',
  },
];

export const adminAccountantService = {
  getAccountants: async (): Promise<Accountant[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<Accountant[]>>('/accountants');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /accountants failed. Falling back to mock data.');
      return [...mockAccountants];
    }
  },

  getAccountant: async (id: string): Promise<Accountant> => {
    try {
      const response = await adminAxios.get<ApiResponse<Accountant>>(`/accountants/${id}`);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] GET /accountants/${id} failed. Searching mock database.`);
      const match = mockAccountants.find(a => a._id === id);
      if (!match) throw new Error('Accountant member not found in registers.');
      return match;
    }
  },

  createAccountant: async (data: CreateAccountantInput): Promise<Accountant> => {
    try {
      const response = await adminAxios.post<ApiResponse<Accountant>>('/accountants', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /accountants failed. Saving to mock database.');
      const newAcc: Accountant = {
        _id: 'a-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockAccountants.push(newAcc);
      return newAcc;
    }
  },

  updateAccountant: async (id: string, data: UpdateAccountantInput): Promise<Accountant> => {
    try {
      const response = await adminAxios.put<ApiResponse<Accountant>>(`/accountants/${id}`, data);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] PUT /accountants/${id} failed. Saving to mock database.`);
      const index = mockAccountants.findIndex(a => a._id === id);
      if (index === -1) throw new Error('Accountant not found');
      const updated = { ...mockAccountants[index], ...data };
      mockAccountants[index] = updated as Accountant;
      return updated as Accountant;
    }
  },
};
export default adminAccountantService;
