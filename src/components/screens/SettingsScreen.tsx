"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { FieldInput, ColorPicker } from "@/components/ui/Field";
import { Logomark } from "@/components/ui/Logomark";
import { Topbar } from "@/components/layout/Topbar";

export function SettingsScreen() {
  const [tab, setTab] = useState("identite");
  const [primary, setPrimary] = useState("#B3001B");
  const [secondary, setSecondary] = useState("#255C99");
  const [bg, setBg] = useState("#F6F4F3");
  const [sidebar, setSidebar] = useState("#262626");

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Paramètres système"]}
        title="Paramètres système"
        badge={<span className="pill role" style={{ marginLeft: 12 }}>Super Admin</span>}
        actions={<button className="btn btn-primary btn-sm"><Ic.Save /> Sauvegarder</button>}
      />

      <div className="tabs-underline" style={{ background: "#fff", padding: "0 28px" }}>
        {[
          { k: "identite",   l: "Identité & White-label" },
          { k: "commission", l: "Commissions" },
          { k: "regles",     l: "Règles métier" },
          { k: "securite",   l: "Sécurité" },
          { k: "notif",      l: "SMS & notifications" },
        ].map((t) => (
          <button key={t.k} className={`tab ${tab === t.k ? "active" : ""}`} onClick={() => setTab(t.k)}>{t.l}</button>
        ))}
      </div>

      <div className="content">
        {tab === "identite" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="card-xl">
              <div className="h3" style={{ marginBottom: 18 }}>Identité de l&apos;institution</div>
              <div className="col gap-14">
                <FieldInput k="Nom de l'institution" v="COOPEC Akpakpa" />
                <FieldInput k="RCCM" v="RB/COT/26 B 0142" />
                <FieldInput k="Ville / Pays" v="Cotonou, Bénin" />
                <FieldInput k="Site web" v="coopec-akpakpa.bj" />
                <FieldInput k="Email contact" v="contact@coopec-akpakpa.bj" />
                <FieldInput k="Téléphone" v="+229 21 30 12 34" />

                <div className="field">
                  <label>Logo de l&apos;institution</label>
                  <div style={{
                    background: "var(--paper)", border: "2px dashed var(--primary-300)",
                    borderRadius: 14, padding: 28,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexDirection: "column",
                    color: "var(--ink-3)",
                  }}>
                    <Ic.Upload />
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-2)" }}>Glissez votre logo ici</div>
                    <div style={{ fontSize: 11 }}>PNG, SVG · max 2MB · 512×512 recommandé</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "var(--carbon-deep)", color: "#fff", borderRadius: 22, padding: 28, position: "relative", overflow: "hidden" }}>
              <div className="eyebrow" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>Aperçu de l&apos;application</div>
              <div className="h3" style={{ color: "#fff", marginBottom: 4 }}>White-label</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 20 }}>
                Vue temps réel des couleurs et du logo appliqués.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 18, marginTop: 16 }}>
                <div style={{ background: "#000", borderRadius: 22, padding: 5 }}>
                  <div style={{ background: sidebar, borderRadius: 18, padding: 14, height: 290, display: "flex", flexDirection: "column" }}>
                    <Logomark size={22} color={primary} coinColor="#fff" coinStroke={primary} />
                    <div style={{ marginTop: 16, fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Solde du jour</div>
                    <div style={{ color: "#fff", fontSize: 22, fontWeight: 600, marginTop: 4 }}>12 500 F</div>
                    <div style={{ marginTop: 14, padding: 10, borderRadius: 10, background: "rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
                      M. Adjovi · 09:12 · 2 000 F
                    </div>
                    <div style={{ marginTop: 8, padding: 10, borderRadius: 10, background: "rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
                      Mme Hounkpati · 09:14 · 5 000 F
                    </div>
                    <div style={{ marginTop: "auto", padding: 11, borderRadius: 999, background: primary, color: "#fff", textAlign: "center", fontSize: 12, fontWeight: 500 }}>
                      Nouveau dépôt
                    </div>
                  </div>
                </div>

                <div>
                  <div className="eyebrow" style={{ color: "rgba(255,255,255,0.55)" }}>Aperçu backoffice</div>
                  <div style={{ background: bg, borderRadius: 10, marginTop: 8, padding: 10, fontSize: 11, color: "var(--ink-2)" }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: primary }} />
                      <span style={{ fontWeight: 600, color: "var(--ink)" }}>Vue d&apos;ensemble</span>
                    </div>
                    <div style={{ padding: 8, background: "#fff", borderRadius: 6 }}>
                      <div style={{ fontSize: 9, color: "var(--ink-3)" }}>Encaissé</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>4 287 500 F</div>
                      <div style={{ fontSize: 9, color: secondary, marginTop: 2 }}>▲ +18%</div>
                    </div>
                  </div>
                  <button className="pill good" style={{ marginTop: 14, background: "rgba(37,92,153,0.2)", color: "#90B6E0", border: "none" }}><Ic.Check /> White-label actif</button>
                </div>
              </div>
            </div>

            <div className="card-xl" style={{ gridColumn: "1 / -1" }}>
              <div className="h3" style={{ marginBottom: 4 }}>Couleurs & Thème</div>
              <div className="muted" style={{ fontSize: 13, marginBottom: 20 }}>Tous les composants se synchronisent automatiquement. Le rouge reste l&apos;action ; le bleu reste le signal positif.</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <ColorPicker l="Couleur principale"  v={primary}   onChange={setPrimary} />
                <ColorPicker l="Couleur secondaire"  v={secondary} onChange={setSecondary} />
                <ColorPicker l="Couleur de fond"     v={bg}        onChange={setBg} />
                <ColorPicker l="Couleur sidebar"     v={sidebar}   onChange={setSidebar} />
              </div>

              <div className="divider" />

              <div className="eyebrow" style={{ marginBottom: 12 }}>Aperçu en temps réel</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn btn-pill" style={{ background: primary, color: "#fff" }}>Bouton primaire</button>
                <button className="btn btn-pill" style={{ background: "transparent", border: `1px solid ${primary}`, color: primary }}>Bouton ghost</button>
                <div style={{ background: "#fff", padding: 14, borderRadius: 12, border: `1px solid ${primary}30` }}>
                  <div className="eyebrow">Aperçu KPI</div>
                  <div className="tnum" style={{ fontSize: 22, fontWeight: 600 }}>4 287 500 F</div>
                  <div style={{ color: secondary, fontSize: 12, fontWeight: 500, marginTop: 2 }}>▲ +18,4%</div>
                </div>
              </div>
            </div>

            <div className="card-xl" style={{ gridColumn: "1 / -1" }}>
              <div className="h3" style={{ marginBottom: 18 }}>Domaine personnalisé</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div className="field">
                  <label>Sous-domaine Covaulty</label>
                  <div className="input">
                    <span className="mono" style={{ fontSize: 13 }}>coopec-akpakpa.covaulty.bj</span>
                    <span className="pill good" style={{ marginLeft: "auto" }}><span className="dot" />Actif</span>
                  </div>
                </div>
                <div className="field">
                  <label>Domaine personnalisé</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div className="input" style={{ flex: 1 }}><input placeholder="console.coopec-akpakpa.bj" /></div>
                    <button className="btn btn-ghost">Configurer DNS</button>
                  </div>
                  <div className="hint">CNAME : <span className="mono">console.coopec-akpakpa.bj → custom.covaulty.bj</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab !== "identite" && (
          <div className="card-xl" style={{ textAlign: "center", padding: 80 }}>
            <div className="muted">Section « {tab} » — démonstration</div>
          </div>
        )}
      </div>
    </>
  );
}
