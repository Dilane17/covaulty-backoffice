"use client";

import { useState } from "react";
import Image from "next/image";
import { Ic } from "@/components/ui/Icons";
import { Logomark, LogoLockup } from "@/components/ui/Logomark";

interface LoginScreenProps {
  onNav: (id: string) => void;
}

export function LoginScreen({ onNav }: LoginScreenProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="login">
      <div className="login-brand">
        <div className="top">
          <Image
            src="/assets/logo-covaulty.svg"
            alt="Covaulty"
            width={120}
            height={32}
            unoptimized
          />
        </div>

        <div className="mid" style={{ gap: 20 }}>
          <div className="eyebrow">Chaque franc · Tracé · Sécurisé</div>
          <h2>
            Votre réseau d&apos;agents.
            <br />
            Votre trésorerie.
            <br />
            <span style={{ color: "var(--primary)" }}>En temps réel.</span>
          </h2>
        </div>

        <div className="bottom">
          <div className="metrics">
            <div>
              <div className="v">
                12<small style={{ fontSize: 16, marginLeft: 2 }}>+</small>
              </div>
              <div className="l">Institutions</div>
            </div>
            <div>
              <div className="v">
                98,7<small style={{ fontSize: 14 }}>%</small>
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
          <div className="brandrow">
            <Logomark size={26} />
            <span className="nm">Covaulty</span>
          </div>
          <div className="h2" style={{ fontSize: 30, lineHeight: 1.1 }}>
            Bon retour.
          </div>
          <p className="lead" style={{ marginTop: 8, fontSize: 15 }}>
            Connectez-vous à votre espace de supervision.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onNav("dashboard");
            }}
            style={{
              marginTop: 28,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div className="field">
              <label>Adresse email</label>
              <div className="input">
                <span className="ic">
                  <Ic.Mail />
                </span>
                <input
                  type="email"
                  placeholder="a.dossou@coopec-akpakpa.bj"
                  defaultValue=""
                />
              </div>
            </div>

            <div className="field">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <label>Mot de passe</label>
                <a
                  href="#"
                  style={{
                    color: "var(--primary)",
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="input">
                <span className="ic">
                  <Ic.Lock />
                </span>
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  style={{ color: "var(--ink-3)", padding: 4 }}
                >
                  {show ? <Ic.EyeOff /> : <Ic.Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-pill"
              style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
            >
              Se connecter <Ic.Arrow />
            </button>

            <div className="divider-or">ou</div>

            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "center" }}
            >
              <Ic.Shield /> SSO entreprise
            </button>
          </form>

          <div className="login-foot">© 2026 Covaulty SAS · Cotonou, Bénin</div>
        </div>
      </div>
    </div>
  );
}
