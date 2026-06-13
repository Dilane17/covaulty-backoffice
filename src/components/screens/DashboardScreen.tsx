"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { KpiCard } from "@/components/ui/KpiCard";
import { Topbar } from "@/components/layout/Topbar";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { fcfa } from "@/utils/fcfa";
import {
  dashboardChartData,
  dashboardBarData,
  dashboardStream,
  dashboardAgents,
  dashboardKpis,
  dashboardZones,
  dashboardAlerts,
  dashboardFinanceSummary,
  dashboardZoneActivity,
} from "@/data/dashboard";

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

function formatTime() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* ── Component ───────────────────────────────────── */
export function DashboardScreen() {
  const [tick, setTick] = useState(0);
  const [now, setNow] = useState("");

  useEffect(() => {
    // Horloge client (1s) + rotation du flux (3,5s).
    // setState uniquement dans les callbacks des timers (pas dans le corps de l'effet).
    const clock = setInterval(() => setNow(formatTime()), 1000);
    const rotate = setInterval(() => setTick((x) => x + 1), 3500);
    return () => {
      clearInterval(clock);
      clearInterval(rotate);
    };
  }, []);

  const offset = tick % dashboardStream.length;
  const visibleStream = [
    ...dashboardStream.slice(offset),
    ...dashboardStream.slice(0, offset),
  ];

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
            <button className="topbar-action">
              <Ic.Calendar /> Aujourd&apos;hui <Ic.Chevron />
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
          {dashboardFinanceSummary.map((f) => (
            <div key={f.label} className="finance-item">
              <div className="finance-val tnum">{f.value}</div>
              <div className="finance-lbl">{f.label}</div>
              <div className="finance-sub">{f.sub}</div>
            </div>
          ))}
        </div>

        {/* ── 6 KPI Cards ──────────────────────────── */}
        <div className="grid-kpi-6">
          {dashboardKpis.map((k, idx) => (
            <div
              key={k.lbl}
              className="kpi-enter"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <KpiCard
                lbl={k.lbl}
                val={
                  k.unit ? (
                    <>
                      {k.val}
                      <small>{k.unit}</small>
                    </>
                  ) : (
                    k.val
                  )
                }
                delta={k.delta}
                spark={k.spark}
                progress={k.progress}
                highlight={k.highlight}
              />
            </div>
          ))}
        </div>

        {/* ── Alertes prioritaires ──────────────────── */}
        <div className="alert-band">
          <div className="alert-band-head">
            <span className="ic">
              <Ic.Alert />
            </span>
            <div>
              <div className="t">Alertes prioritaires</div>
              <div className="s">{dashboardAlerts.length} à traiter</div>
            </div>
          </div>
          <div className="alert-band-list">
            {dashboardAlerts.map((a, i) => (
              <button key={i} className={`alert-mini ${a.level}`}>
                <span className="tag">{a.kind}</span>
                <span className="ttl">{a.title}</span>
                <span className="ago">{a.ago}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Charts Row : Line + Bar ──────────────── */}
        <div
          className="dash-grid"
          style={{ marginTop: 28, gridTemplateColumns: "1fr 1fr" }}
        >
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
            <LineChart
              data={dashboardChartData}
              width={620}
              height={220}
              color="var(--primary)"
            />
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
            <BarChart
              data={dashboardBarData}
              width={520}
              height={220}
              colors={["var(--primary)", "var(--accent-soft)"]}
            />
          </div>
        </div>

        {/* ── Activité en direct + Répartition par zone ── */}
        <div className="dash-grid" style={{ marginTop: 28 }}>
          <div className="card">
            <div className="card-head">
              <div>
                <h4>Activité en direct</h4>
                <div className="sub">
                  Flux temps réel · mise à jour {now || "—"}
                </div>
              </div>
              <span className="chip live">
                <span className="dot" />
                Live
              </span>
            </div>
            <div className="stream">
              {visibleStream.map((s, i) => (
                <div
                  key={`${s.i}-${s.who}-${tick}-${i}`}
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
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h4>Répartition par zone</h4>
                <div className="sub">% du collecté du jour</div>
              </div>
            </div>
            <div
              style={{ display: "grid", placeItems: "center", marginBottom: 8 }}
            >
              <DonutChart data={dashboardZones} size={180} />
            </div>
            <div className="col gap-10">
              {dashboardZones.map((z, i) => (
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
        <div className="dash-grid" style={{ marginTop: 28 }}>
          <div className="card" style={{ padding: 0 }}>
            <div
              className="card-head"
              style={{ padding: "20px 24px", marginBottom: 0 }}
            >
              <div>
                <h4>Performance des agents · Aujourd&apos;hui</h4>
                <div className="sub">Classement par montant collecté</div>
              </div>
              <button className="chip">
                5 sur 22 <Ic.Chevron />
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
                  <th>Objectif</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {dashboardAgents.map((a, i) => (
                  <tr key={i}>
                    <td>
                      <span className={`rank-badge${i < 3 ? " top" : ""}`}>
                        {i + 1}
                      </span>
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
                    <td className="num tnum fw-600">{fcfa(a.c)}</td>
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Zone Activity Widget */}
          <div className="card">
            <div className="card-head">
              <div>
                <h4>Activité par zone</h4>
                <div className="sub">Agents & collecte en temps réel</div>
              </div>
              <span className="chip live">
                <span className="dot" />
                Live
              </span>
            </div>
            <div className="zone-activity-list">
              {dashboardZoneActivity.map((z, i) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
