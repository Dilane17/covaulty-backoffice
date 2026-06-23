import api from "./api";
import { 
  SavingsPlan, 
  SavingsAccount, 
  CreateSavingsPlanPayload, 
  CreateSavingsAccountPayload, 
  WithdrawSavingsPayload 
} from "@/types/savings.types";

export const savingsService = {
  createPlan: async (payload: CreateSavingsPlanPayload): Promise<SavingsPlan> => {
    const response = await api.post<SavingsPlan>("/savings/plans", payload);
    return response.data;
  },

  getPlans: async (): Promise<SavingsPlan[]> => {
    const response = await api.get<SavingsPlan[]>("/savings/plans");
    return response.data;
  },

  createAccount: async (payload: CreateSavingsAccountPayload): Promise<SavingsAccount> => {
    const response = await api.post<SavingsAccount>("/savings/accounts", payload);
    return response.data;
  },

  getAccounts: async (params?: { clientId?: string }): Promise<SavingsAccount[]> => {
    const response = await api.get<SavingsAccount[]>("/savings/accounts", { params });
    return response.data;
  },

  withdraw: async (id: string, payload: WithdrawSavingsPayload): Promise<void> => {
    await api.post(`/savings/accounts/${id}/withdraw`, payload);
  },
};
