import api from "./api";
import { CashRemittance } from "@/types/remittance.types";

export const remittanceService = {
  getAll: async (params?: { status?: string; agencyId?: string }): Promise<CashRemittance[]> => {
    const response = await api.get<CashRemittance[]>("/remittances", { params });
    return response.data;
  },

  count: async (id: string, countedAmount: number, pin: string): Promise<{ remittance: CashRemittance }> => {
    const response = await api.patch<{ remittance: CashRemittance }>(`/remittances/${id}/count`, { countedAmount }, {
      headers: { "x-action-pin": pin }
    });
    return response.data;
  },

  resolve: async (id: string, finalAmount: number, discrepancyReason: string, pin: string): Promise<{ remittance: CashRemittance }> => {
    const response = await api.patch<{ remittance: CashRemittance }>(`/remittances/${id}/resolve`, { finalAmount, discrepancyReason }, {
      headers: { "x-action-pin": pin }
    });
    return response.data;
  }
};
