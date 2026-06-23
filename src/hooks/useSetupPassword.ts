import { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function useSetupPassword(onNav: (id: string) => void) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      const hashParts = window.location.hash.split("?");
      if (hashParts.length > 1) return new URLSearchParams(hashParts[1]).get("token") || "";
    }
    return "";
  });
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      const hashParts = window.location.hash.split("?");
      if (hashParts.length > 1) return new URLSearchParams(hashParts[1]).get("email") || "";
    }
    return "";
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (!token || !email) {
      setError("Le lien de configuration est invalide ou incomplet.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.setupPassword({ token, email, password });
      if (res.success) {
        setSuccess(true);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr.response?.data?.message || "Erreur de configuration du mot de passe.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleNavLogin = () => {
    clearAuth();
    onNav("login");
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    token,
    email,
    error,
    success,
    loading,
    handleSubmit,
    handleNavLogin
  };
}
