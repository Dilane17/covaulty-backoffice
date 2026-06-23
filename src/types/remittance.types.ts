export interface CashRemittance {
  id: string;
  agentId: string;
  agencyId: string;
  declaredAmount: number;
  countedAmount?: number;
  finalAmount?: number;
  status: "PENDING" | "VALIDATED" | "DISCREPANCY" | "RESOLVED";
  discrepancyReason?: string;
  createdAt: string;
  updatedAt: string;
  agent?: { firstName: string; lastName: string };
}
