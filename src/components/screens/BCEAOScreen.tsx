"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { PreviewRow, CheckRow } from "@/components/ui/Field";
import { Topbar } from "@/components/layout/Topbar";
import { bceaoTypes, bceaoHistoryData } from "@/data/bceao";

export function BCEAOScreen() {
  const [period, setPeriod] = useState("Mensuel");

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Finance", "Export BCEAO"]}
        title="Export BCEAO"
        badge={<span className="pill" style={{ marginLeft: 12, background: "var(--primary-50)", color: "var(--primary)" }}><Ic.Shield /> Conformité BCEAO</span>}
        actions={<button className="btn btn-ghost btn-sm"><Ic.Doc /> Documentation BCEAO</button>}
      />

      <div className="content">
        <div style={{ background: "var(--primary-100)", border: "1px solid var(--primary-200)", borderRadius: 14, padding: "20px 24px", marginBottom: 24, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary)", color: "#fff", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
            <Ic.Shield />
          </div>
          <div>
            <div style={{ fontSize: 14, color: "var(--ink), #1A1A1A", lineHeight: 1.55 }}>
              Les exports BCEAO sont générés automatiquement selon le modèle réglementaire en vigueur.
              Chaque fichier couvre une période comptable complète et est signé numériquement.
            </div>
            <a href="#" style={{ color: "var(--primary)", fontSize: 13, fontWeight: 500, marginTop: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>
              Consulter le guide de soumission BCEAO <Ic.Arrow />
            </a>
          </div>
        </div>

        <div className="card-xl">
          <div className="h3" style={{ marginBottom: 4 }}>Générer un nouvel export</div>
          <div className="muted" style={{ fontSize: 13, marginBottom: 24 }}>
            Sélectionnez la période, les agences et le contenu à inclure dans l&apos;export réglementaire.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="col gap-16">
              <div className="field">
                <label>Période</label>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  {["Mensuel", "Trimestriel", "Annuel"].map((p) => (
                    <button key={p} className={`tab ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Mois / Année</label>
                <div className="input">
                  <select defaultValue="Mai 2026"><option>Mai 2026</option><option>Avril 2026</option><option>Mars 2026</option></select>
                  <Ic.Chevron />
                </div>
              </div>

              <div className="field">
                <label>Agence</label>
                <div className="input"><select><option>Toutes les agences</option></select><Ic.Chevron /></div>
              </div>

              <div className="field">
                <label>Type de rapport</label>
                <div className="col gap-8" style={{ marginTop: 4 }}>
                  {bceaoTypes.map((t, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--paper)", borderRadius: 8, cursor: "pointer" }}>
                      <span style={{ width: 18, height: 18, borderRadius: 5, background: "var(--primary)", display: "grid", placeItems: "center", color: "#fff" }}>
                        <Ic.Check />
                      </span>
                      <span style={{ fontSize: 13 }}>{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div style={{ background: "var(--paper)", borderRadius: 14, padding: 24, border: "1px solid var(--line)" }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Aperçu · export {period.toLowerCase()} mai 2026</div>
                <div className="col gap-12">
                  <PreviewRow k="Transactions" v="1 847 tx" />
                  <PreviewRow k="Agents" v="22" />
                  <PreviewRow k="Agences" v="7" />
                  <PreviewRow k="Clients actifs" v="12 480" />
                  <PreviewRow k="Taille estimée" v="~2,8 MB" />
                  <PreviewRow k="Format" v="CSV + JSON" />
                  <PreviewRow k="Standard" v="BCEAO v2.1" />
                </div>
                <div className="divider" />
                <div className="eyebrow" style={{ marginBottom: 8 }}>Conformité</div>
                <div className="col gap-6">
                  <CheckRow t="Conforme BCEAO" />
                  <CheckRow t="LBC / FT vérifié" />
                  <CheckRow t="RGPD compatible" />
                  <CheckRow t="Signature numérique RSA-4096" />
                </div>
              </div>

              <button className="btn btn-primary btn-pill" style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>
                Générer l&apos;export <Ic.Arrow />
              </button>
            </div>
          </div>
        </div>

        <div className="card-xl" style={{ marginTop: 24, padding: 0 }}>
          <div className="card-head" style={{ padding: "24px 28px 16px", marginBottom: 0 }}>
            <div>
              <h4>Historique · 12 derniers exports</h4>
              <div className="sub">Chaque export est signé et archivé pour 10 ans</div>
            </div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Date</th><th>Période</th><th>Type</th><th>Agences</th>
                <th className="num">Transactions</th><th>Statut</th><th></th>
              </tr>
            </thead>
            <tbody>
              {bceaoHistoryData.map((r, i) => (
                <tr key={i}>
                  <td className="tnum">{r.d}</td>
                  <td className="fw-500">{r.p}</td>
                  <td className="muted">{r.t}</td>
                  <td className="muted">{r.ag}</td>
                  <td className="num tnum fw-600">{r.tx}</td>
                  <td><span className="pill good"><Ic.Check /> Signé</span></td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" style={{ minHeight: 28, padding: "4px 10px" }}><Ic.Download /> CSV</button>
                      <button className="btn btn-ghost btn-sm" style={{ minHeight: 28, padding: "4px 10px" }}><Ic.Download /> JSON</button>
                      <button className="btn-icon" style={{ color: "var(--ink-3)" }}><Ic.Eye /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
