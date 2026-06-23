import api from "./api";
import { AgencyWallet, AgentWallet, FundAgencyPayload } from "@/types/wallet.types";

export const walletService = {
  getAgencyWallet: async (id: string): Promise<AgencyWallet> => {
    const response = await api.get<AgencyWallet>(`/wallets/agency/${id}`);
    return response.data;
  },

  fundAgency: async (id: string, payload: FundAgencyPayload, pin: string): Promise<{ agencyId: string; newBalance: number }> => {
    const response = await api.post<{ agencyId: string; newBalance: number }>(`/wallets/agency/${id}/fund`, payload, {
      headers: { "x-action-pin": pin }
    });
    return response.data;
  },

  getAgentWallet: async (id: string): Promise<AgentWallet> => {
    const response = await api.get<AgentWallet>(`/wallets/agent/${id}`);
    return response.data;
  },
};
