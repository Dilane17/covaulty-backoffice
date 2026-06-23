import api from "./api";
import {
  LoginPayload,
  LoginResponse,
  OtpPayload,
  Enable2FAPayload,
  Verify2FAPayload,
  SetupPasswordPayload,
} from "@/types/auth.types";

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },

  verifyOtp: async (payload: OtpPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/verify-otp", payload);
    return response.data;
  },

  enable2FA: async (payload: Enable2FAPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/enable-2fa", payload);
    return response.data;
  },

  verify2FA: async (payload: Verify2FAPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login/verify-2fa", payload);
    return response.data;
  },

  setupPassword: async (payload: SetupPasswordPayload): Promise<{ success: boolean; message?: string }> => {
    const response = await api.post<{ success: boolean; message?: string }>("/auth/setup-password", payload);
    return response.data;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await api.post<{ accessToken: string }>("/auth/refresh");
    return response.data;
  },

  setupActionPin: async (pin: string): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>("/auth/action-pin/setup", { pin });
    return response.data;
  },

  generateClientSetupToken: async (clientId: string): Promise<{ setupToken: string }> => {
    const response = await api.get<{ setupToken: string }>(`/clients/${clientId}/auth-setup`);
    return response.data;
  },
};
