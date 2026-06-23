export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  idCardNumber?: string;
  clientCode?: string;
  creditScore?: number;
  savingsAccounts?: any[];
  loans?: any[];
  pinHash?: string;
  deviceLinked?: boolean;
  photoUrl?: string;
  idCardPhotoUrl?: string;
  latitude?: number;
  longitude?: number;
  kycLevel?: number;
}

export interface CreateClientPayload {
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  idCardNumber?: string;
  photoUrl?: string;
  idCardPhotoUrl?: string;
  latitude?: number;
  longitude?: number;
  kycLevel?: number;
}

export interface AdjustBalancePayload {
  accountId: string;
  amount: number;
  reason: string;
}
