"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { DropChip } from "@/components/ui/DropChip";
import { KpiCard } from "@/components/ui/KpiCard";
import { Legend } from "@/components/ui/Field";
import { Topbar } from "@/components/layout/Topbar";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { fcfa } from "@/utils/fcfa";
import { rapportsMonthsData, rapportsDonutData, rapportAgencesData, rapportFilesData } from "@/data/rapports";

export function RapportsScreen() {
  const [period, setPeriod] = useState("Ce mois");

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Finance", "Rapports"]}
        title="Rapports financiers"
        sub="Données certifiées · Dernière mise à jour : il y a 4 sec."
        actions={<button className="btn btn-primary btn-sm"><Ic.Plus /> Générer un rapport</button>}
      />

      <div className="filter-bar">
        <div className="tabs">
          {["Aujourd'hui", "Cette semaine", "Ce mois", "Trimestre", "Personnalisé"].map((t) => (
            <button key={t} className={`tab ${period === t ? "active" : ""}`} onClick={() => setPeriod(t)}>{t}</button>
          ))}
        </div>
        <div className="spacer" />
        <DropChip label="Toutes les agences" />
        <button className="btn btn-primary btn-sm"><Ic.Download /> Exporter PDF</button>
      </div>

      <div style={{ background: "#fff", borderBottom: "1px solid var(--line)", padding: "20px 28px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        <KpiCard lbl="Collecté ce mois" val="2 847 500 F" delta="▲ +12,3% vs mois préc." />
        <KpiCard lbl="Retraits" val={<span className="text-primary">−412 000 F</span>} delta="▼ −8,4% vs mois préc." deltaDir="down" />
        <KpiCard lbl="Net" val={<span className="text-accent">2 435 500 F</span>} delta="▲ +14% YTD" />
        <KpiCard lbl="Commissions agents" val="142 375 F" delta="(5% du collecté)" />
        <KpiCard lbl="Solde trésorerie" val="18 240 000 F" delta="✓ 100% réconcilié" />
      </div>

      <div className="content">
        <div className="grid-2">
          <div className="card">
            <div className="card-head">
              <div>
                <h4>Évolution mensuelle</h4>
                <div className="sub">12 derniers mois · M F CFA</div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Legend c="var(--primary)" l="Collecté" />
                <Legend c="var(--accent-soft)" l="Retraits" border="var(--accent)" />
                <span className="pill good" style={{ fontSize: 11 }}>▲ +18% YTD</span>
              </div>
            </div>
            <BarChart data={rapportsMonthsData} width={620} height={240} />
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h4>Répartition par agence</h4>
                <div className="sub">% du collecté ce mois</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, alignItems: "center" }}>
              <DonutChart data={rapportsDonutData} size={200} />
              <div className="col gap-10">
                {rapportsDonutData.map((d, i) => (
                  <div key={i} className="between">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: d.c }} />
                      <span style={{ fontSize: 13 }}>{d.l}</span>
                    </div>
                    <span className="tnum fw-600" style={{ fontSize: 13 }}>{d.v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: 16 }}>
          <div className="card" style={{ padding: 0 }}>
            <div className="card-head" style={{ padding: "20px 24px", marginBottom: 0 }}>
              <div>
                <h4>Récapitulatif par agence</h4>
                <div className="sub">Mai 2026</div>
              </div>
              <button className="btn btn-ghost btn-sm"><Ic.Download /></button>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Agence</th><th className="num">Agents</th><th className="num">Dépôts</th>
                  <th className="num">Collecté</th><th className="num">Retraits</th>
                  <th className="num">Net</th><th className="num">Δ mois</th>
                </tr>
              </thead>
              <tbody>
                {rapportAgencesData.map((r, i) => (
                  <tr key={i}>
                    <td className="fw-500">{r.n}</td>
                    <td className="num tnum">{r.a}</td>
                    <td className="num tnum">{r.d}</td>
                    <td className="num tnum fw-600">{fcfa(r.c)}</td>
                    <td className="num tnum text-primary">{fcfa(r.r, { sign: true })}</td>
                    <td className="num tnum fw-600">{fcfa(r.c + r.r)}</td>
                    <td className="num text-accent fw-500">{r.dm}</td>
                  </tr>
                ))}
                <tr style={{ background: "var(--paper-4)" }}>
                  <td className="fw-600">Total</td>
                  <td className="num tnum fw-600">22</td>
                  <td className="num tnum fw-600">1 942</td>
                  <td className="num tnum fw-600">3 447 500 F</td>
                  <td className="num tnum fw-600 text-primary">−412 000 F</td>
                  <td className="num tnum fw-600">3 035 500 F</td>
                  <td className="num text-accent fw-600">+12%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h4>Rapports générés</h4>
                <div className="sub">5 derniers</div>
              </div>
            </div>
            <div className="col gap-10">
              {rapportFilesData.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 10, alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 40, borderRadius: 4, background: "var(--primary-50)", color: "var(--primary)", display: "grid", placeItems: "center", fontFamily: "var(--mono)", fontSize: 9, fontWeight: 600 }}>PDF</div>
                  <div>
                    <div className="fw-500" style={{ fontSize: 13 }}>{r.ti}</div>
                    <div className="muted" style={{ fontSize: 11 }}>PDF · {r.sz} · Généré le {r.dt}</div>
                  </div>
                  <button className="btn-icon" style={{ color: "var(--ink-3)" }} data-tip="Voir"><Ic.Eye /></button>
                  <button className="btn-icon" style={{ color: "var(--primary)" }} data-tip="Télécharger"><Ic.Download /></button>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
              Générer un nouveau rapport <Ic.Arrow />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
