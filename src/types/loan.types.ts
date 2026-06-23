export interface Loan {
  id: string;
  clientId: string;
  principal: number;
  interestRate: number;
  durationMonths: number;
  purpose?: string;
  status?: string;
  approvedAt?: string;
  disbursedAt?: string;
}

export interface LoanSchedule {
  id: string;
  loanId: string;
  dueDate: string;
  amountDue: number;
  status: string;
}

export interface LoanRepayment {
  id: string;
  loanId: string;
  amount: number;
  note?: string;
  date: string;
}

export interface CreateLoanPayload {
  clientId: string;
  principal: number;
  interestRate: number;
  durationMonths: number;
  purpose?: string;
}

export interface LoanRepaymentPayload {
  amount: number;
  note?: string;
}
