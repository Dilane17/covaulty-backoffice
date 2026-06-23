import { useState } from "react";
import axios from "axios";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useTenantStore } from "@/store/tenant.store";
import { institutionService } from "@/services/institution.service";
import { User } from "@/types/user.types";

export type LoginStep = "login" | "otp" | "2fa-setup" | "2fa";

export function useAuthFlow(onNav: (id: string) => void) {
  const [step, setStep] = useState<LoginStep>("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSuccess = async (token: string, user: User & { institution?: Record<string, unknown>, institutionId?: string }) => {
    setAuth(token, user);

    if (user.role !== "SUPER_ADMIN" && !user.institution && user.institutionId) {
      try {
        const res = await institutionService.getAll();
        const inst = Array.isArray(res) ? res[0] : res;
        if (inst) {
          user.institution = inst;
          setAuth(token, user);
        }
      } catch (err) {
        console.warn("Failed to fetch user institution details via getAll", err);
        user.institution = { id: user.institutionId, name: "Mon Institution", slug: "institution" };
        setAuth(token, user);
      }
    }

    if (user.role === "SUPER_ADMIN") {
      useTenantStore.getState().setInstitution(null, null);
      window.location.hash = "#platform-dashboard";
    } else {
      if (user.institution) {
        useTenantStore.getState().setInstitutionFromUser(user.institution);
      }
      window.location.hash = user.role === "AGENT" ? "#collectes" : "#dashboard";
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login({ email, password });
      
      if (res.accessToken && res.user) {
        await handleSuccess(res.accessToken, res.user);
      } else if (res.requireVerification) {
        setStep("otp");
      } else if (res.require2Fa) {
        setStep("2fa");
      } else if (res.require2FaSetup) {
        if (res.otpauthUrl) {
          setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(res.otpauthUrl)}`);
        } else if (res.qrCodeUrl) {
          setQrCodeUrl(res.qrCodeUrl);
        }
        setStep("2fa-setup");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError("Erreur réseau : Impossible de contacter le serveur API.");
        } else {
          setError(err.response?.data?.message || "Identifiants incorrects.");
        }
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.verifyOtp({ email, code });
      if (res.require2FaSetup) {
        if (res.otpauthUrl) {
          setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(res.otpauthUrl)}`);
        } else if (res.qrCodeUrl) {
          setQrCodeUrl(res.qrCodeUrl);
        }
        setStep("2fa-setup");
        setCode("");
      } else if (res.accessToken && res.user) {
        await handleSuccess(res.accessToken, res.user);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Code OTP invalide.");
      } else {
        setError("Code OTP invalide.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.enable2FA({ email, code });
      if (res.accessToken && res.user) {
        await handleSuccess(res.accessToken, res.user);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Code invalide.");
      } else {
        setError("Code invalide.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.verify2FA({ email, code });
      if (res.accessToken && res.user) {
        await handleSuccess(res.accessToken, res.user);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Code invalide.");
      } else {
        setError("Code invalide.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (step === "login") handleLoginSubmit(e);
    else if (step === "otp") handleOtpSubmit(e);
    else if (step === "2fa-setup") handle2FASetupSubmit(e);
    else if (step === "2fa") handle2FASubmit(e);
  };

  return {
    step,
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    isLoading,
    error,
    qrCodeUrl,
    handleSubmit,
  };
}
