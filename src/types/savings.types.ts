export interface SavingsPlan {
  id: string;
  name: string;
  annualRate: number;
  durationMonths: number;
  minDeposit: number;
  isActive?: boolean;
}

export interface SavingsAccount {
  id: string;
  clientId: string;
  planId: string;
  balance?: number;
  status?: "ACTIVE" | "CLOSED";
  openedAt?: string;
  closedAt?: string;
}

export interface CreateSavingsPlanPayload {
  name: string;
  annualRate: number;
  durationMonths: number;
  minDeposit: number;
}

export interface CreateSavingsAccountPayload {
  clientId: string;
  planId: string;
}

export interface WithdrawSavingsPayload {
  amount: number;
  note?: string;
}
