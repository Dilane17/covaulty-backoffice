import api from "./api";
import { 
  Loan, 
  LoanSchedule, 
  LoanRepayment, 
  CreateLoanPayload, 
  LoanRepaymentPayload 
} from "@/types/loan.types";

export const loanService = {
  create: async (payload: CreateLoanPayload): Promise<Loan> => {
    const response = await api.post<Loan>("/loans", payload);
    return response.data;
  },

  getAll: async (params?: { clientId?: string; status?: string }): Promise<Loan[]> => {
    const response = await api.get<Loan[]>("/loans", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Loan> => {
    const response = await api.get<Loan>(`/loans/${id}`);
    return response.data;
  },

  approve: async (id: string): Promise<Loan> => {
    const response = await api.patch<Loan>(`/loans/${id}/approve`);
    return response.data;
  },

  disburse: async (id: string): Promise<Loan> => {
    const response = await api.patch<Loan>(`/loans/${id}/disburse`);
    return response.data;
  },

  getSchedule: async (id: string): Promise<LoanSchedule[]> => {
    const response = await api.get<LoanSchedule[]>(`/loans/${id}/schedule`);
    return response.data;
  },

  createRepayment: async (id: string, payload: LoanRepaymentPayload): Promise<LoanRepayment> => {
    const response = await api.post<LoanRepayment>(`/loans/${id}/repayments`, payload);
    return response.data;
  },
};
