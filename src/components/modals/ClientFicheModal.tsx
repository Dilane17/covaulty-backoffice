"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { Field } from "@/components/ui/Field";
import { KpiSm } from "@/components/ui/KpiCard";
import { Stars } from "@/components/ui/Stars";
import { LineChart } from "@/components/charts/LineChart";
import { fcfa } from "@/utils/fcfa";
import { Client } from "@/types/client";

interface ClientFicheModalProps {
  r: Client;
  onClose: () => void;
}

export function ClientFicheModal({ r, onClose }: ClientFicheModalProps) {
  const [tab, setTab] = useState("vue");
  const chart = [
    { x: "J-30", y: 4 }, { x: "J-25", y: 5 }, { x: "J-20", y: 6 }, { x: "J-15", y: 7 },
    { x: "J-10", y: 9 }, { x: "J-5", y: 11 }, { x: "Auj", y: 12.5 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 760 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head brand-red">
          <div className="av lg" style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}>{r.i}</div>
          <div style={{ flex: 1 }}>
            <div className="title">{r.n}</div>
            <div className="sub">{r.ac} · Akpakpa</div>
          </div>
          <button className="close" onClick={onClose}><Ic.X /></button>
        </div>
        <div className="tabs-underline" style={{ padding: "0 28px" }}>
          {[{ k: "vue", l: "Vue générale" }, { k: "tx", l: "Transactions" }, { k: "kyc", l: "KYC" }, { k: "sig", l: "Signalements" }].map((t) => (
            <button key={t.k} className={`tab ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}>{t.l}</button>
          ))}
        </div>
        <div className="modal-body">
          {tab === "vue" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>Informations</div>
                  <div className="col gap-10">
                    <Field k="Téléphone">+229 97 12 34 56</Field>
                    <Field k="CNI">CIPB-2019-0091284</Field>
                    <Field k="Adresse">Akpakpa, Rue 12.143</Field>
                    <Field k="Agent attribué">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="av sm">{r.agt.split(" ").map((s) => s[0]).join("")}</div>
                        <span style={{ color: "var(--primary)", fontWeight: 500 }}>{r.agt}</span>
                      </div>
                    </Field>
                    <Field k="Inscription">04 sept. 2024</Field>
                    <Field k="Statut">
                      <span className="pill good"><Ic.Check /> Actif</span>
                    </Field>
                  </div>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>Vue financière</div>
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 6 }}>Solde actuel</div>
                    <div className="tnum" style={{ fontSize: 40, fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.02em", lineHeight: 1.05 }}>{fcfa(r.s)}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 }}>
                    <KpiSm v="1 850 F" l="Dépôt moyen" />
                    <KpiSm v="4.2×/sem" l="Fréquence" />
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>Score crédit comportemental</div>
                <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 20, alignItems: "center" }}>
                  <div style={{ background: "var(--primary-50)", borderRadius: 14, padding: 14, textAlign: "center" }}>
                    <div className="tnum" style={{ fontSize: 32, fontWeight: 600, color: "var(--primary)" }}>{r.sc}/5</div>
                    <div className="eyebrow" style={{ marginTop: 2, color: "var(--primary)", fontSize: 10 }}>Excellent</div>
                  </div>
                  <div>
                    <Stars value={r.sc} />
                    <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>Excellent épargnant — ponctuel, régulier, aucun incident.</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 14 }}>
                      <div><div className="tnum fw-600" style={{ fontSize: 16 }}>98%</div><div className="eyebrow" style={{ fontSize: 10 }}>Ponctualité</div></div>
                      <div><div className="tnum fw-600" style={{ fontSize: 16 }}>0</div><div className="eyebrow" style={{ fontSize: 10 }}>Incident</div></div>
                      <div><div className="tnum fw-600" style={{ fontSize: 16 }}>127</div><div className="eyebrow" style={{ fontSize: 10 }}>Jours actifs</div></div>
                      <div><div className="tnum fw-600 text-accent" style={{ fontSize: 16 }}>+15%</div><div className="eyebrow" style={{ fontSize: 10 }}>Vol./mois</div></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>Évolution du solde · 30 jours</div>
                <LineChart data={chart} width={680} height={150} color="var(--primary)" />
              </div>

              <div className="divider" />

              <div>
                <div className="eyebrow" style={{ marginBottom: 10 }}>5 dernières transactions</div>
                <div className="col gap-8">
                  {[
                    { d: "Auj. 09:12", a: "Koffi A.", m: 2000 },
                    { d: "19/05",      a: "Koffi A.", m: 1500 },
                    { d: "18/05",      a: "Koffi A.", m: 2000 },
                    { d: "17/05",      a: "Koffi A.", m: 1500 },
                    { d: "16/05",      a: "Adèle B.", m: 3000 },
                  ].map((t, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 10, alignItems: "center", gap: 12 }}>
                      <Ic.ArrowUp />
                      <div>
                        <div className="fw-500">Dépôt · {t.a}</div>
                        <div className="muted" style={{ fontSize: 11 }}>{t.d}</div>
                      </div>
                      <div className="tnum fw-600 text-accent">{fcfa(t.m, { sign: true })}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {tab !== "vue" && (
            <div className="muted" style={{ padding: 40, textAlign: "center" }}>Section « {tab} » — démonstration</div>
          )}
        </div>
      </div>
    </div>
  );
}
