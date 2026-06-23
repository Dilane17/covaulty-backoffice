export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "AGENT";
  agencyId?: string;
  isActive: boolean;
  agentCode?: string;
  createdAt?: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  adminPassword?: string;
  role: string;
  agencyId?: string;
}

export interface UpdateUserPayload {
  isActive?: boolean;
  agencyId?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}
