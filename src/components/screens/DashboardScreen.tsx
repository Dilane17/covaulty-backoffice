"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Ic } from "@/components/ui/Icons";
import { KpiCard } from "@/components/ui/KpiCard";
import { Topbar } from "@/components/layout/Topbar";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { fcfa } from "@/utils/fcfa";
import { useDashboardData } from "@/hooks/useDashboardData";

/* ── Helpers ─────────────────────────────────────── */
function formatDate() {
  const d = new Date();
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return d.toLocaleDateString("fr-FR", opts);
}

/* ── Component ───────────────────────────────────── */
export function DashboardScreen() {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") {
      window.location.hash = "#platform-dashboard";
    }
  }, [user]);

  const {
    data: {
      now,
      metrics,
      visibleStream,
      chartData,
      barData,
      zonesData,
      topAgents,
      zoneActivity,
      alerts,
    },
    loading,
    refetch,
    handleResolveAlert
  } = useDashboardData();

  return (
    <>
      <Topbar
        crumb={["Dashboard"]}
        title="Vue d'ensemble"
        sub={`${formatDate()} · ${now || "--:--:--"}`}
        actions={
          <>
            <span className="pill live">
              <span className="dot" />
              Live
            </span>
            <button className="topbar-action" onClick={refetch}>
              <Ic.Refresh /> Actualiser
            </button>
            <button className="topbar-action topbar-action-primary">
              <Ic.Download /> Export
            </button>
          </>
        }
      />
      <div className="content">
        {/* ── Finance Summary Band ──────────────────── */}
        <div className="finance-band">
          <div className="finance-item">
            <div className="finance-val tnum">{fcfa(metrics.collecte)}</div>
            <div className="finance-lbl">Total Encaissé</div>
            <div className="finance-sub">Aujourd'hui via agents</div>
          </div>
          <div className="finance-item">
            <div className="finance-val tnum" style={{ color: "var(--primary)" }}>{fcfa(metrics.remises)}</div>
            <div className="finance-lbl">Caisse (Versements)</div>
            <div className="finance-sub">Validés par le caissier</div>
          </div>
          <div className="finance-item">
            <div className="finance-val tnum">{fcfa(metrics.prets)}</div>
            <div className="finance-lbl">Capital Déployé</div>
            <div className="finance-sub">Prêts accordés</div>
          </div>
          <div className="finance-item">
            <div className="finance-val tnum">{metrics.clients}</div>
            <div className="finance-lbl">Clients KYC</div>
            <div className="finance-sub">Comptes enregistrés</div>
          </div>
        </div>

        {/* ── 6 KPI Cards ──────────────────────────── */}
        <div className="grid-kpi-6">
          <div className="kpi-enter" style={{ animationDelay: "0ms" }}>
            <KpiCard lbl="Collectes du jour" val={metrics.nbCollectes} delta="+2" />
          </div>
          <div className="kpi-enter" style={{ animationDelay: "60ms" }}>
            <KpiCard lbl="Agents actifs" val={metrics.agents} delta="Stable" />
          </div>
          <div className="kpi-enter" style={{ animationDelay: "120ms" }}>
            <KpiCard lbl="Nouveaux Clients" val={metrics.clients} delta="+1" />
          </div>
          <div className="kpi-enter" style={{ animationDelay: "180ms" }}>
            <KpiCard lbl="Dossiers de prêt" val={metrics.nbPrets} delta="En cours" />
          </div>
          <div className="kpi-enter" style={{ animationDelay: "240ms" }}>
            <KpiCard lbl="Tx de validation caisse" val={metrics.remises > 0 ? "100%" : "0%"} delta="Réel" />
          </div>
          <div className="kpi-enter" style={{ animationDelay: "300ms" }}>
            <KpiCard lbl="Alertes système" val={0} delta="-1" deltaDir="down" highlight={true} />
          </div>
        </div>

        {/* ── Charts Row : Line + Bar ──────────────── */}
        <div className="dash-grid mt-9 gap-6 grid-cols-2">
          <div className="card">
            <div className="card-head">
              <div>
                <h4>Encaissement par jour</h4>
                <div className="sub">
                  7 derniers jours · en millions de F CFA
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="chip">
                  <span
                    className="dot"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: "var(--primary)",
                    }}
                  />{" "}
                  Encaissé
                </span>
              </div>
            </div>
            {chartData.length > 0 ? (
              <LineChart
                data={chartData}
                width={500}
                height={240}
                color="var(--primary)"
              />
            ) : (
              <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-3)" }}>
                Aucune donnée
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h4>Dépôts vs Retraits</h4>
                <div className="sub">Flux comparés · 7 jours · en M F CFA</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="chip">
                  <span
                    className="dot"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: "var(--primary)",
                    }}
                  />{" "}
                  Dépôts
                </span>
                <span className="chip">
                  <span
                    className="dot"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: "var(--accent-soft)",
                    }}
                  />{" "}
                  Retraits
                </span>
              </div>
            </div>
            {barData.length > 0 ? (
              <BarChart
                data={barData}
                width={500}
                height={240}
                colors={["var(--primary)", "var(--accent-soft)"]}
              />
            ) : (
              <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-3)" }}>
                Aucune donnée
              </div>
            )}
          </div>
        </div>

        {/* ── Activité en direct + Répartition par zone ── */}
        <div className="dash-grid mt-9 gap-6">
          <div className="card">
            <div className="card-head">
              <div>
                <h4>Activité en direct</h4>
                <div className="sub">
                  Flux temps réel · mis à jour à {now || "—"}
                </div>
              </div>
              <span className="chip live">
                <span className="dot" />
                Live
              </span>
            </div>
            <div className="stream">
              {loading ? (
                <div className="p-4 text-center muted text-sm">Chargement du flux...</div>
              ) : visibleStream.length === 0 ? (
                <div className="p-4 text-center muted text-sm">Aucune activité récente sur le terrain.</div>
              ) : (
                visibleStream.map((s, i) => (
                  <div
                    key={`${s.id}-${tick}-${i}`}
                    className={`stream-row ${i === 0 ? "new" : ""}`}
                  >
                    <div className="av sm">{s.i}</div>
                    <div>
                      <div className="nm">
                        {s.n}{" "}
                        <span
                          style={{
                            color: "var(--ink-3)",
                            fontWeight: 400,
                            fontSize: 12,
                          }}
                        >
                          · {s.z}
                        </span>
                      </div>
                      <div className="mt">
                        par {s.who} · {s.t}
                      </div>
                    </div>
                    <div
                      className={`amt ${s.isAccent ? "in" : ""}`}
                      style={{ color: !s.isAccent ? "var(--ink-3)" : undefined }}
                    >
                      {s.a}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h4>Répartition par agent</h4>
                <div className="sub">% du collecté (réel)</div>
              </div>
            </div>
            <div className="grid place-items-center mb-2">
              {zonesData.length > 0 ? (
                <DonutChart data={zonesData} size={180} />
              ) : (
                <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-3)" }}>
                  Pas de données
                </div>
              )}
            </div>
            <div className="col gap-10">
              {zonesData.map((z, i) => (
                <div key={i} className="between">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: z.c,
                      }}
                    />
                    <span style={{ fontSize: 13 }}>{z.l}</span>
                  </div>
                  <span className="tnum fw-600" style={{ fontSize: 13 }}>
                    {z.v}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Zone Activity Heatmap + Top Agents ───── */}
        <div className="dash-grid mt-9 gap-6">
          <div className="card" style={{ padding: 0 }}>
            <div
              className="card-head"
              style={{ padding: "20px 24px", marginBottom: 0 }}
            >
              <div>
                <h4>Performance des agents</h4>
                <div className="sub">Classement par montant collecté aujourd'hui</div>
              </div>
              <button className="chip">
                Top {topAgents.length} <Ic.Chevron />
              </button>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Agent</th>
                  <th>Zone</th>
                  <th className="num">Dépôts</th>
                  <th className="num">Collecté</th>
                  <th>Objectif 150k</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {topAgents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 muted text-sm">
                      Aucun agent n'a encore enregistré de collecte.
                    </td>
                  </tr>
                ) : (
                  topAgents.map((a, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          {i === 0 && <Ic.Trophy style={{ color: "#F6A21E" }} />}
                          {i === 1 && <Ic.Medal style={{ color: "#94A3B8" }} />}
                          {i === 2 && <Ic.Medal style={{ color: "#B45309" }} />}
                          {i > 2 && <span className="muted tnum">{i + 1}</span>}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div className="av sm">{a.i}</div>
                          <span style={{ fontWeight: 500 }}>{a.n}</span>
                        </div>
                      </td>
                      <td className="muted">{a.z}</td>
                      <td className="num tnum">{a.d}</td>
                      <td className="num tnum fw-600 text-accent">{fcfa(a.c)}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div className="bar">
                            <span style={{ width: `${a.o}%` }} />
                          </div>
                          <span className="muted tnum" style={{ fontSize: 12 }}>
                            {a.o}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`pill ${a.st === "off" ? "off" : "live"}`}
                        >
                          <span className="dot" />
                          {a.st === "off" ? "Inactif" : "Sur le terrain"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Zone Activity Widget */}
          <div className="card">
            <div className="card-head">
              <div>
                <h4>Activité par influence</h4>
                <div className="sub">Agents & collecte en temps réel</div>
              </div>
              <span className="chip live">
                <span className="dot" />
                Live
              </span>
            </div>
            <div className="zone-activity-list">
              {zoneActivity.length === 0 ? (
                <div className="p-4 text-center muted text-sm">Pas de données.</div>
              ) : (
                zoneActivity.map((z, i) => (
                  <div key={i} className="zone-activity-item">
                    <div className="zone-activity-header">
                      <div
                        style={{ display: "flex", alignItems: "center", gap: 8 }}
                      >
                        <span
                          className="zone-dot"
                          style={{ background: z.color }}
                        />
                        <span className="zone-name">{z.name}</span>
                      </div>
                      <span className="zone-collecte tnum">{z.collecte}</span>
                    </div>
                    <div className="zone-activity-bar">
                      <div
                        className="zone-activity-fill"
                        style={{ width: `${z.pct}%`, background: z.color }}
                      />
                    </div>
                    <div className="zone-activity-footer">
                      <span>
                        <strong className="tnum">{z.agents}</strong>/
                        {z.totalAgents} agents actifs
                      </span>
                      <span className="tnum fw-600">{z.pct}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Alertes récentes ── */}
        <div className="dash-grid mt-9 mb-10 grid-cols-1">
          <div className="card">
            <div className="card-head">
              <div>
                <h4>Alertes récentes</h4>
                <div className="sub">Problèmes opérationnels nécessitant une attention</div>
              </div>
            </div>
            
            <div className="col gap-4">
              {alerts.length === 0 ? (
                <div className="p-6 bg-green-50 text-green-700 rounded-xl flex items-center justify-center gap-2">
                  <Ic.Check /> Aucune alerte active
                </div>
              ) : (
                alerts.map(a => (
                  <div key={a.id} className={`flex justify-between items-center p-4 rounded-xl border ${a.severity === 'CRITICAL' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
                    <div className="flex gap-4 items-center">
                      <div className={`p-2 rounded-full ${a.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        <Ic.Alert />
                      </div>
                      <div>
                        <div className={`font-semibold ${a.severity === 'CRITICAL' ? 'text-red-900' : 'text-orange-900'}`}>
                          {a.type || "Alerte système"}
                        </div>
                        <div className={`text-sm mt-1 ${a.severity === 'CRITICAL' ? 'text-red-700' : 'text-orange-700'}`}>
                          {a.message}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-mono text-gray-500">{new Date(a.createdAt).toLocaleString("fr-FR")}</span>
                      <button className="btn btn-ghost btn-sm bg-white" onClick={() => handleResolveAlert(a.id)}>Résoudre</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
