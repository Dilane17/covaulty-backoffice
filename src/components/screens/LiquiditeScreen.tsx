"use client";

import { Ic } from "@/components/ui/Icons";
import { Legend, LegendDash, Row } from "@/components/ui/Field";
import { Topbar } from "@/components/layout/Topbar";
import { ForecastChart } from "@/components/charts/ForecastChart";
import { ChartPoint, ForecastPoint } from "@/types/common";

function buildHistory(): ChartPoint[] {
  const h: ChartPoint[] = [];
  for (let i = 0; i < 14; i++) {
    h.push({ x: `J-${14 - i}`, y: 14 + i * 0.3 + Math.sin(i * 0.7) * 0.4 });
  }
  h.push({ x: "Auj", y: 18.24 });
  return h;
}

function buildForecast(): ForecastPoint[] {
  const f: ForecastPoint[] = [];
  for (let i = 1; i <= 30; i++) {
    const base = 18.24 + i * 0.35 + Math.sin(i * 0.5) * 0.5;
    f.push({ x: `+${i}j`, y: base, band: 0.6 + i * 0.05 });
  }
  return f;
}

function buildOptimistic(): ForecastPoint[] {
  const o: ForecastPoint[] = [];
  for (let i = 1; i <= 30; i++) {
    const base = 18.24 + i * 0.35 + Math.sin(i * 0.5) * 0.5;
    o.push({ x: `+${i}j`, y: base + 0.4 + i * 0.06 });
  }
  return o;
}

const history = buildHistory();
const forecast = buildForecast();
const optimistic = buildOptimistic();

export function LiquiditeScreen() {
  return (
    <>
      <Topbar
        crumb={["Dashboard", "Finance", "Prévision de liquidité"]}
        title="Prévision de liquidité"
        actions={
          <>
            <span className="chip danger-soft"><Ic.Spark /> IA · Modèle mis à jour il y a 2 h</span>
            <button className="btn btn-ghost btn-sm"><Ic.Refresh /> Actualiser</button>
          </>
        }
      />

      <div className="content">
        <div style={{ background: "var(--carbon)", color: "#fff", borderRadius: 22, padding: 32, marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28, alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div className="eyebrow" style={{ color: "rgba(255,255,255,0.55)" }}>Solde actuel</div>
                <div className="muted" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>21 mai 2026</div>
              </div>
              <div className="tnum" style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1, marginTop: 12, color: "#fff" }}>
                18 240 000 F
              </div>
              <div className="text-accent" style={{ marginTop: 12, fontSize: 14, fontWeight: 500 }}>▲ +4,2% vs sem. dernière</div>
              <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
                <span className="chip" style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.10)" }}>
                  <Ic.ArrowUp /> Tendance haussière
                </span>
                <span className="chip" style={{ background: "var(--warn-soft)", color: "var(--warn-text)", border: "none" }}>
                  <Ic.Alert /> 1 risque identifié
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ padding: 16, background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="eyebrow" style={{ color: "rgba(255,255,255,0.55)" }}>Prévision à 7 j</div>
                <div className="tnum" style={{ fontSize: 22, fontWeight: 600, color: "#fff", marginTop: 6 }}>22 140 000 F</div>
                <div className="text-accent" style={{ fontSize: 12, marginTop: 4 }}>▲ +3 900 000 F</div>
              </div>
              <div style={{ padding: 16, background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="eyebrow" style={{ color: "rgba(255,255,255,0.55)" }}>Prévision à 30 j</div>
                <div className="tnum" style={{ fontSize: 22, fontWeight: 600, color: "#fff", marginTop: 6 }}>28 700 000 F</div>
                <div className="text-accent" style={{ fontSize: 12, marginTop: 4 }}>▲ +10 460 000 F</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h4>Évolution du solde · Historique + prévision 30 jours</h4>
              <div className="sub">Bande de confiance à 90% · M F CFA</div>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Legend c="var(--primary)" l="Historique" />
              <LegendDash c="var(--primary)" l="Prévision centrale" />
              <Legend c="rgba(179,0,27,0.18)" l="Intervalle de confiance" />
              <LegendDash c="var(--accent)" l="Scénario optimiste" />
            </div>
          </div>
          <ForecastChart history={history} forecast={forecast} optimistic={optimistic} width={1080} height={300} />
        </div>

        <div className="grid-3" style={{ marginTop: 16 }}>
          <div className="card" style={{ borderLeft: "4px solid var(--warn)" }}>
            <div className="alert-tagrow"><span className="alert-tag warn">RISQUE FAIBLE</span></div>
            <div className="h3 mt-8" style={{ fontSize: 17 }}>Baisse prévisionnelle sem. 23</div>
            <p className="body mt-8">
              Historiquement, les collectes baissent de 8% en fin de mois. À surveiller particulièrement la zone Cotonou.
            </p>
            <div style={{ background: "var(--paper)", borderRadius: 10, padding: 12, marginTop: 12, borderLeft: "2px solid var(--warn)" }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Recommandation</div>
              <div style={{ fontSize: 13 }}>Alerter les agents zone Cotonou pour intensification des tournées.</div>
            </div>
          </div>

          <div className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
            <div className="alert-tagrow"><span className="alert-tag ok">OPPORTUNITÉ</span></div>
            <div className="h3 mt-8" style={{ fontSize: 17 }}>Forte saisonnalité · zone Akpakpa</div>
            <p className="body mt-8">
              L&apos;historique montre +22% de collecte la 3ᵉ semaine du mois. Pic attendu du 23 au 27 mai.
            </p>
            <div style={{ background: "var(--paper)", borderRadius: 10, padding: 12, marginTop: 12, borderLeft: "2px solid var(--accent)" }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Recommandation</div>
              <div style={{ fontSize: 13 }}>Déployer 2 agents supplémentaires sur les tournées Akpakpa T1 et T2.</div>
            </div>
          </div>

          <div className="card">
            <div className="eyebrow">Paramètres du modèle</div>
            <div className="h3 mt-8" style={{ fontSize: 17 }}>Précision du modèle</div>
            <div className="between mt-12">
              <span className="tnum" style={{ fontSize: 28, fontWeight: 600 }}>94,2<small style={{ fontSize: 14, color: "var(--ink-3)", marginLeft: 2 }}>%</small></span>
              <span className="muted" style={{ fontSize: 12 }}>sur 30 j</span>
            </div>
            <div className="bar full thick mt-8" style={{ background: "var(--accent-soft)" }}><span style={{ width: "94%", background: "var(--accent)" }} /></div>
            <div className="divider" />
            <div className="col gap-8">
              <Row k="Données d'entrée" v="127 semaines" />
              <Row k="Agents suivis" v="22" />
              <Row k="Zones" v="7" />
              <Row k="Dernière calibration" v="il y a 2 h" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
