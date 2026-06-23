export interface AgencyWallet {
  agencyId: string;
  balance: number;
  transactions?: any[];
}

export interface AgentWallet {
  agentId: string;
  cashBalance: number;
  transactions?: any[];
}

export interface FundAgencyPayload {
  amount: number;
  notes?: string;
}
