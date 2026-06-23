export interface Agency {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  walletBalance?: number;
}

export interface CreateAgencyPayload {
  name: string;
  address: string;
}

export interface UpdateAgencyPayload extends Partial<CreateAgencyPayload> {}
