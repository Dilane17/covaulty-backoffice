"use client";

import { useState } from "react";
import Image from "next/image";
import { Ic } from "@/components/ui/Icons";
import { useTenantStore } from "@/store/tenant.store";
import { useAuthFlow } from "@/hooks/useAuthFlow";

interface LoginScreenProps {
  onNav: (id: string) => void;
}

export function LoginScreen({ onNav }: LoginScreenProps) {
  const [showPwd, setShowPwd] = useState(false);
  const institution = useTenantStore((s) => s.institution);

  const {
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
  } = useAuthFlow(onNav);

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
              className="h-auto"
              style={{ width: "auto", height: "auto" }}
              unoptimized
            />
          ) : (
            <Image
              src="/assets/logo-covaulty.svg"
              alt="Covaulty"
              width={120}
              height={32}
              className="h-auto"
              style={{ width: "auto", height: "auto" }}
              unoptimized
            />
          )}
        </div>

        <div className="mid flex flex-col gap-5">
          <div className="eyebrow">Chaque franc · Tracé · Sécurisé</div>
          <h1 className="h1">
            Votre réseau d&apos;agents.
            <br />
            Votre trésorerie.
            <br />
            <span className="text-[var(--primary)]">En temps réel.</span>
          </h1>
        </div>

        <div className="bottom">
          <div className="metrics">
            <div>
              <div className="v">
                12<small className="text-base ml-0.5">+</small>
              </div>
              <div className="l">Institutions</div>
            </div>
            <div>
              <div className="v">
                98,7<small className="text-sm">%</small>
              </div>
              <div className="l">Réconciliés</div>
            </div>
            <div>
              <div className="v">0</div>
              <div className="l">Centime perdu</div>
            </div>
          </div>
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
                  className="h-auto"
                  style={{ width: "auto", height: "auto" }}
                  unoptimized
                />
              ) : (
                <Image
                  src="/assets/logo-officiel-Covaulty.svg"
                  alt="Covaulty"
                  width={120}
                  height={32}
                  className="h-auto"
                  style={{ width: "auto", height: "auto" }}
                  unoptimized
                />
              )}
            </div>
          </div>
          <div className="h2 text-[30px] leading-[1.1]">
            {step === "login" ? "Bon retour." : step === "otp" ? "Vérification." : "Sécurisation."}
          </div>
          <p className="lead mt-2 text-[15px]">
            {step === "login"
              ? "Connectez-vous à votre espace de supervision."
              : "Suivez les instructions pour continuer."}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3.5">
            {error && (
              <div className="bg-red-50 text-[var(--primary)] text-sm p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            {step === "login" && (
              <>
                <div className="field">
                  <label htmlFor="login-email">Adresse email</label>
                  <div className="input">
                    <span className="ic">
                      <Ic.Mail />
                    </span>
                    <input
                      id="login-email"
                      type="text"
                      placeholder="a.dossou@coopec-akpakpa.bj"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <div className="flex justify-between items-baseline">
                    <label htmlFor="login-password">Mot de passe</label>
                    <a href="#" className="text-[var(--primary)] text-xs font-medium">
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div className="input">
                    <span className="ic">
                      <Ic.Lock />
                    </span>
                    <input
                      id="login-password"
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="text-[var(--ink-3)] p-1"
                    >
                      {showPwd ? <Ic.EyeOff /> : <Ic.Eye />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === "otp" && (
              <>
                <p className="text-sm text-[var(--ink-2)] bg-[var(--paper)] p-3 rounded-xl">
                  Un code a été envoyé à votre adresse email.
                </p>
                <div className="field">
                  <label htmlFor="login-code">Code de vérification (6 chiffres)</label>
                  <div className="input">
                    <span className="ic">
                      <Ic.Shield />
                    </span>
                    <input
                      id="login-code"
                      type="text"
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === "2fa-setup" && (
              <>
                <p className="text-sm text-[var(--ink-2)] bg-[var(--paper)] p-3 rounded-xl mb-2">
                  Scannez ce QR code avec Google Authenticator ou Authy.
                </p>
                {qrCodeUrl && (
                  <div className="flex justify-center bg-white p-2 rounded-xl border border-[var(--line)] mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrCodeUrl} alt="QR Code 2FA" className="w-40 h-40" />
                  </div>
                )}
                <div className="field">
                  <label htmlFor="login-totp">Code généré par l&apos;application</label>
                  <div className="input">
                    <span className="ic">
                      <Ic.Shield />
                    </span>
                    <input
                      id="login-totp"
                      type="text"
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === "2fa" && (
              <>
                <p className="text-sm text-[var(--ink-2)] bg-[var(--paper)] p-3 rounded-xl">
                  Entrez le code généré par votre application Authenticator.
                </p>
                <div className="field">
                  <label htmlFor="login-mfa">Code d&apos;authentification</label>
                  <div className="input">
                    <span className="ic">
                      <Ic.Shield />
                    </span>
                    <input
                      id="login-mfa"
                      type="text"
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-pill w-full justify-center mt-2.5 disabled:opacity-50"
            >
              {isLoading ? "Chargement..." : step === "login" ? "Se connecter" : "Valider"}
              {!isLoading && <Ic.Arrow />}
            </button>


          </form>

          <div className="login-foot">© {new Date().getFullYear()} {institution?.name || "Covaulty SAS"}</div>
        </div>
      </div>
    </div>
  );
}
