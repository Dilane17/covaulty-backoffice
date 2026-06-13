"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { DropChip } from "@/components/ui/DropChip";
import { CounterTile } from "@/components/ui/Field";
import { Topbar } from "@/components/layout/Topbar";

export function AlertesScreen() {
  const [tab, setTab] = useState("Toutes");

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Alertes"]}
        title="Alertes"
        badge={<span className="pill bad" style={{ marginLeft: 12 }}>3 ouvertes</span>}
        actions={
          <>
            <button className="btn btn-ghost btn-sm"><Ic.Check /> Tout marquer résolu</button>
            <button className="btn btn-ghost btn-sm"><Ic.Cog /> Règles d&apos;alerte</button>
          </>
        }
      />

      <div style={{ background: "#fff", borderBottom: "1px solid var(--line)", padding: "20px 28px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <CounterTile color="var(--primary)" big="3"  small="Ouvertes"       icon={<Ic.Alert />} />
        <CounterTile color="var(--warn)"    big="8"  small="En cours"       icon={<Ic.Refresh />} />
        <CounterTile color="var(--accent)"  big="47" small="Résolues (30j)" icon={<Ic.Check />} />
        <CounterTile color="var(--ink-3)"   big="5"  small="Règles actives" icon={<Ic.Cog />} />
      </div>

      <div className="filter-bar" style={{ background: "var(--paper)", borderBottom: 0, padding: "12px 28px" }}>
        <div className="tabs">
          {["Toutes", "Ouvertes", "En cours", "Résolues"].map((t) => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t}
              {t === "Ouvertes" && (
                <span style={{ marginLeft: 6, background: "var(--primary)", color: "#fff", padding: "1px 6px", borderRadius: 999, fontSize: 10 }}>3</span>
              )}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <DropChip label="Tous types" />
        <DropChip label="Tous agents" />
      </div>

      <div className="content" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="alert-card crit">
          <div className="alert-tagrow">
            <span className="alert-tag crit"><span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--primary)" }} /> CRITIQUE</span>
            <span className="alert-tag kind">Écart de caisse</span>
            <span className="muted" style={{ fontSize: 12, marginLeft: "auto" }}>Il y a 3 min</span>
          </div>
          <h3>Écart de 3 500 F détecté — Agent Boris K.</h3>
          <div className="det">Total déclaré 14 500 F · Total reversé 11 000 F · Écart <strong style={{ color: "var(--primary)" }}>−3 500 F</strong></div>
          <div className="alert-actions">
            <button className="btn btn-primary btn-sm"><Ic.Phone /> Contacter l&apos;agent</button>
            <button className="btn btn-ghost btn-sm"><Ic.Exchange /> Voir les transactions</button>
            <button className="btn btn-ghost btn-sm" style={{ color: "var(--ink-3)" }}>Marquer résolu</button>
          </div>
        </div>

        <div className="alert-card warn">
          <div className="alert-tagrow">
            <span className="alert-tag warn"><span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--warn)" }} /> ATTENTION</span>
            <span className="alert-tag kind-warn">Hors-zone</span>
            <span className="muted" style={{ fontSize: 12, marginLeft: "auto" }}>Il y a 18 min</span>
          </div>
          <h3>Jean M. détecté hors de sa zone assignée</h3>
          <div className="det">Zone assignée : <strong>Cadjehoun</strong> · Position actuelle : <strong>Akpakpa</strong> (4,2 km d&apos;écart)</div>
          <div style={{ height: 50, borderRadius: 8, background: "var(--paper-3)", position: "relative", overflow: "hidden" }}>
            <svg viewBox="0 0 200 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <path d="M 0 25 Q 50 5, 100 25 T 200 25" stroke="rgba(38,38,38,0.10)" strokeWidth="1" fill="none" />
              <line x1="50" y1="25" x2="150" y2="25" stroke="var(--warn)" strokeDasharray="3 3" strokeWidth="1" />
              <circle cx="50" cy="25" r="4" fill="var(--accent)" />
              <circle cx="150" cy="25" r="4" fill="var(--primary)" />
              <text x="48" y="42" fontSize="9" fill="var(--ink-3)">Zone</text>
              <text x="148" y="42" fontSize="9" fill="var(--ink-3)">Pos.</text>
            </svg>
          </div>
          <div className="alert-actions">
            <button className="btn btn-primary btn-sm"><Ic.Map /> Voir sur la carte</button>
            <button className="btn btn-ghost btn-sm" style={{ color: "var(--ink-3)" }}>Ignorer</button>
          </div>
        </div>

        <div className="alert-card warn">
          <div className="alert-tagrow">
            <span className="alert-tag warn"><span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--warn)" }} /> ATTENTION</span>
            <span className="alert-tag kind-warn">Double collecte</span>
            <span className="muted" style={{ fontSize: 12, marginLeft: "auto" }}>Il y a 1 h</span>
          </div>
          <h3>Possible doublon — M. Adjovi K. collecté 2 fois à 09:12</h3>
          <div className="det">
            Réf <strong>#CV-0912</strong> · 2 000 F · 09:12:38 &nbsp;et&nbsp;
            Réf <strong>#CV-0918</strong> · 2 000 F · 09:12:51 — même client, même montant
          </div>
          <div className="alert-actions">
            <button className="btn btn-primary btn-sm">Comparer les transactions</button>
            <button className="btn btn-ghost btn-sm">Valider doublon</button>
            <button className="btn btn-ghost btn-sm" style={{ color: "var(--ink-3)" }}>Ignorer</button>
          </div>
        </div>

        <div className="section-rule">Alertes résolues (48h)</div>

        <div className="alert-card ok">
          <div className="alert-tagrow">
            <span className="alert-tag ok"><span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} /> RÉSOLUE</span>
            <span className="alert-tag kind-ok">Sync offline</span>
            <span className="muted" style={{ fontSize: 12, marginLeft: "auto" }}>Résolue il y a 2 h</span>
          </div>
          <h3>4 dépôts hors-ligne synchronisés avec succès — Rachelle T.</h3>
          <div className="det">4 dépôts · 9 500 F · Sync. automatique 2G à 11:34</div>
        </div>
      </div>
    </>
  );
}
