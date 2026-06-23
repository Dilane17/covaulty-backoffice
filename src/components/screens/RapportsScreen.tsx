"use client";

import { Ic } from "@/components/ui/Icons";
import { DropChip } from "@/components/ui/DropChip";
import { KpiCard } from "@/components/ui/KpiCard";
import { Legend } from "@/components/ui/Field";
import { Topbar } from "@/components/layout/Topbar";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { fcfa } from "@/utils/fcfa";
import { useReportsData } from "@/hooks/useReportsData";

export function RapportsScreen() {
  const {
    data: {
      volumeParMois,
      donutData,
      agencesStats,
      kpis,
      transactions,
      recentFiles,
    },
    period,
    setPeriod,
    loading,
    handleExportCSV,
  } = useReportsData();

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Finance", "Rapports"]}
        title="Rapports financiers"
        sub="Données calculées en temps réel"
        actions={<button className="btn btn-primary btn-sm"><Ic.Plus /> Générer un rapport</button>}
      />

      <div className="filter-bar">
        <div className="tabs">
          {["Aujourd'hui", "Cette semaine", "Ce mois", "Trimestre", "Personnalisé"].map((t) => (
            <button
              key={t}
              className={`tab ${period === t ? "active" : ""}`}
              onClick={() => setPeriod(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <DropChip label="Toutes les agences" />
        <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
          <Ic.Download /> Exporter CSV
        </button>
      </div>

      <div className="bg-white border-b border-[var(--line)] py-5 px-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          lbl="Collecté ce mois"
          val={fcfa(kpis.collecte)}
          delta="Données réelles"
        />
        <KpiCard
          lbl="Retraits"
          val={<span className="text-primary">−{fcfa(kpis.retraits)}</span>}
          delta="Données réelles"
          deltaDir="down"
        />
        <KpiCard
          lbl="Net"
          val={<span className="text-accent">{fcfa(kpis.net)}</span>}
          delta="Données réelles"
        />
        <KpiCard
          lbl="Commissions agents"
          val={fcfa(kpis.commissions)}
          delta="(5% du collecté)"
        />
        <KpiCard
          lbl="Solde trésorerie"
          val={fcfa(kpis.soldeTresorerie)}
          delta="Cumul agences"
        />
      </div>

      <div className="content">
        {loading ? (
          <div className="card p-8 text-center muted">Chargement des rapports...</div>
        ) : (
          <>
            <div className="grid-2">
              <div className="card">
                <div className="card-head">
                  <div>
                    <h4>Évolution mensuelle</h4>
                    <div className="sub">Par mois · M F CFA</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Legend c="var(--accent)" l="Collecté" />
                    <Legend c="var(--primary)" l="Retraits" border="var(--primary)" />
                  </div>
                </div>
                {volumeParMois.length > 0 ? (
                  <BarChart data={volumeParMois} width={620} height={240} />
                ) : (
                  <div className="p-8 text-center muted">Pas assez de données pour le graphique.</div>
                )}
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <h4>Répartition par type</h4>
                    <div className="sub">% des opérations</div>
                  </div>
                </div>
                <div className="grid grid-cols-[200px_1fr] gap-6 items-center">
                  {donutData.length > 0 ? (
                    <>
                      <DonutChart data={donutData} size={200} />
                      <div className="col gap-10">
                        {donutData.map((d, i) => (
                          <div key={i} className="between">
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 3,
                                  background: d.c,
                                }}
                              />
                              <span style={{ fontSize: 13 }}>{d.l}</span>
                            </div>
                            <span className="tnum fw-600" style={{ fontSize: 13 }}>
                              {d.v}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="muted">Aucune donnée disponible.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ marginTop: 16 }}>
              <div className="card" style={{ padding: 0 }}>
                <div className="card-head" style={{ padding: "20px 24px", marginBottom: 0 }}>
                  <div>
                    <h4>Récapitulatif par agence</h4>
                    <div className="sub">Données globales</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={handleExportCSV}>
                    <Ic.Download />
                  </button>
                </div>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Agence</th>
                      <th className="num">Agents</th>
                      <th className="num">Dépôts</th>
                      <th className="num">Collecté</th>
                      <th className="num">Retraits</th>
                      <th className="num">Net</th>
                      <th className="num">Δ mois</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencesStats.map((r, i) => (
                      <tr key={i}>
                        <td className="fw-500">{r.n}</td>
                        <td className="num tnum">{r.a}</td>
                        <td className="num tnum">{r.d}</td>
                        <td className="num tnum fw-600">{fcfa(r.c)}</td>
                        <td className="num tnum text-primary">
                          {fcfa(r.r, { sign: true })}
                        </td>
                        <td className="num tnum fw-600">{fcfa(r.c + r.r)}</td>
                        <td className="num text-accent fw-500">{r.dm}</td>
                      </tr>
                    ))}
                    {agencesStats.length > 0 && (
                      <tr style={{ background: "var(--paper-4)" }}>
                        <td className="fw-600">Total</td>
                        <td className="num tnum fw-600">
                          {agencesStats.reduce((acc, curr) => acc + curr.a, 0)}
                        </td>
                        <td className="num tnum fw-600">
                          {agencesStats.reduce((acc, curr) => acc + curr.d, 0)}
                        </td>
                        <td className="num tnum fw-600">
                          {fcfa(agencesStats.reduce((acc, curr) => acc + curr.c, 0))}
                        </td>
                        <td className="num tnum fw-600 text-primary">
                          {fcfa(agencesStats.reduce((acc, curr) => acc + curr.r, 0), { sign: true })}
                        </td>
                        <td className="num tnum fw-600">
                          {fcfa(
                            agencesStats.reduce((acc, curr) => acc + curr.c + curr.r, 0)
                          )}
                        </td>
                        <td className="num text-accent fw-600">—</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="card">
                <div className="card-head">
                  <div>
                    <h4>Rapports générés</h4>
                    <div className="sub">Exports récents</div>
                  </div>
                </div>
                <div className="col gap-10">
                  {recentFiles.map((r, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto] py-3 px-[14px] border border-[var(--line)] rounded-[10px] items-center gap-3"
                    >
                      <div
                        className="w-8 h-10 rounded bg-[var(--primary-50)] text-primary grid place-items-center font-mono text-[9px] font-semibold"
                      >
                        CSV
                      </div>
                      <div>
                        <div className="fw-500" style={{ fontSize: 13 }}>
                          {r.ti}
                        </div>
                        <div className="muted" style={{ fontSize: 11 }}>
                          CSV · {r.sz} · Généré le {r.dt}
                        </div>
                      </div>
                      <button className="btn-icon" style={{ color: "var(--ink-3)" }} aria-label="Voir le rapport" data-tip="Voir">
                        <Ic.Eye />
                      </button>
                      <button className="btn-icon" style={{ color: "var(--primary)" }} aria-label="Télécharger le rapport" data-tip="Télécharger">
                        <Ic.Download />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-ghost"
                  style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
                  onClick={handleExportCSV}
                >
                  Générer un nouvel export CSV <Ic.Arrow />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
