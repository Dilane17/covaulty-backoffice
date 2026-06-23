"use client";

import Image from "next/image";
import { Ic } from "@/components/ui/Icons";
import { useTenantStore } from "@/store/tenant.store";
import { useSetupPassword } from "@/hooks/useSetupPassword";

export function SetupPasswordScreen({ onNav }: { onNav: (id: string) => void }) {
  const institution = useTenantStore((s) => s.institution);

  const {
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
  } = useSetupPassword(onNav);

  return (
    <div className="login" style={institution?.primaryColor ? { "--primary": institution.primaryColor } as React.CSSProperties : undefined}>
      <div className="login-brand">
        <div className="top">
          {institution?.logoUrl ? (
            <Image
              src={institution.logoUrl}
              alt={institution.name}
              width={120}
              height={32}
              className="h-auto w-auto"
              unoptimized
            />
          ) : (
            <Image
              src="/assets/logo-covaulty.svg"
              alt="Covaulty"
              width={120}
              height={32}
              className="h-auto w-auto"
              unoptimized
            />
          )}
        </div>

        <div className="mid flex flex-col gap-5">
          <h1 className="h1">Bienvenue sur votre espace d'administration.</h1>
          <p className="p text-[18px] text-ink-2">
            Définissez votre mot de passe pour activer votre compte.
          </p>
        </div>
      </div>

      <div className="login-form-wrap">
        <div className="login-form">
          <div className="brandrow justify-center">
            <div className="top-center">
              {institution?.logoUrl ? (
                <Image
                  src={institution.logoUrl}
                  alt={institution.name}
                  width={120}
                  height={32}
                  className="h-auto w-auto"
                  unoptimized
                />
              ) : (
                <Image
                  src="/assets/logo-officiel-Covaulty.svg"
                  alt="Covaulty"
                  width={120}
                  height={32}
                  className="h-auto w-auto"
                  unoptimized
                />
              )}
            </div>
          </div>
          <div className="h2 text-[30px] leading-[1.1]">
            Configuration initiale.
          </div>
          <p className="text-(--ink-2) mb-4">
            Compte : <strong className="text-(--ink-1)">{email || "En attente..."}</strong>
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 flex items-start gap-2">
              <span className="mt-0.5"><Ic.Alert /></span>
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ic.Check />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compte activé !</h3>
              <p className="text-(--ink-2) mb-6">Votre mot de passe a été configuré avec succès.</p>
              <button 
                onClick={handleNavLogin} 
                className="btn btn-primary w-full justify-center"
              >
                Se connecter
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="field">
                <label htmlFor="setup-password">Nouveau mot de passe</label>
                <div className="input">
                  <input
                    id="setup-password"
                    type="password"
                    placeholder="Minimum 8 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="setup-confirm">Confirmer le mot de passe</label>
                <div className="input">
                  <input
                    id="setup-confirm"
                    type="password"
                    placeholder="Répétez le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full justify-center"
                disabled={loading || !token || !email}
              >
                {loading ? "Configuration..." : "Activer mon compte"} <Ic.Chevron />
              </button>
            </form>
          )}

          <div className="login-foot">© {new Date().getFullYear()} {institution?.name || "Covaulty SAS"}</div>
        </div>
      </div>
    </div>
  );
}
