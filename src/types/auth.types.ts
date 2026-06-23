export interface AuthUser {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "AGENT";
  firstName: string;
  lastName: string;
  agentCode?: string;
  isVerified?: boolean;
  twoFactorEnabled?: boolean;
  agencyId?: string;
  createdAt?: string;
  phone?: string;
  institutionId?: string | null;
  institution?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface LoginPayload {
  email?: string;
  password?: string;
  agentCode?: string;
}

export interface LoginResponse {
  accessToken?: string;
  user?: AuthUser;
  requireVerification?: boolean;
  require2Fa?: boolean;
  require2FaSetup?: boolean;
  message?: string;
  secret?: string;
  qrCodeUrl?: string;
  otpauthUrl?: string;
}

export interface OtpPayload {
  email: string;
  code: string;
}

export interface Enable2FAPayload {
  email: string;
  code: string;
}

export interface Verify2FAPayload {
  email: string;
  code: string;
}

export interface SetupPasswordPayload {
  token: string;
  email: string;
  password: string;
}
