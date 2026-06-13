"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { Stat } from "@/components/ui/Stat";
import { InstMetric } from "@/components/ui/Field";
import { Logomark } from "@/components/ui/Logomark";
import { Topbar } from "@/components/layout/Topbar";
import { AgenceModal } from "@/components/modals/AgenceModal";
import { fcfa } from "@/utils/fcfa";
import { agencesData } from "@/data/agences";
import { Agence } from "@/types/agence";

export function AgencesScreen() {
  const [open, setOpen] = useState<Agence | null>(null);

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Agences"]}
        title="Agences"
        sub="7 agences · COOPEC Akpakpa"
        actions={<button className="btn btn-primary btn-sm"><Ic.Plus /> Nouvelle agence</button>}
      />

      <div className="content">
        <div style={{ background: "var(--carbon)", color: "#fff", borderRadius: 14, padding: "20px 24px", display: "grid", gridTemplateColumns: "auto 1fr repeat(4, auto)", gap: 28, alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logomark size={36} />
          </div>
          <div>
            <div className="h3" style={{ color: "#fff", fontSize: 18 }}>COOPEC Akpakpa</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 }}>Cotonou, Bénin · RCCM RB/COT/26 B 0142</div>
          </div>
          <InstMetric v="7" l="Agences" />
          <InstMetric v="22" l="Agents" />
          <InstMetric v="12 480" l="Clients" />
          <InstMetric v="2,8 M F" l="par mois" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {agencesData.map((a) => (
            <div className="card" key={a.id} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, borderRadius: 22 }}>
              <div>
                <span className="pill" style={{ background: "var(--primary-50)", color: "var(--primary)" }}>{a.a.split(" · ")[0]}</span>
                <div className="h3" style={{ marginTop: 8 }}>{a.n}</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{a.a}</div>
              </div>

              <div className="between" style={{ padding: "10px 0", borderTop: "1px solid var(--line-2)", borderBottom: "1px solid var(--line-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="av sm">{a.di}</div>
                  <div>
                    <div className="fw-500" style={{ fontSize: 13 }}>{a.d}</div>
                    <span className="pill role" style={{ fontSize: 10, padding: "2px 8px", marginTop: 2 }}>Directeur</span>
                  </div>
                </div>
                <span className="pill good"><span className="dot" /> Opérationnelle</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <Stat v={a.nA} l="Agents" />
                <Stat v={a.nC.toLocaleString("fr-FR")} l="Clients" />
                <Stat v={fcfa(a.w)} l="Cette sem." big />
                <Stat v={`${a.o}%`} l="Objectif" />
              </div>

              <div className="bar full thick"><span style={{ width: `${a.o}%` }} /></div>

              <div className="between">
                <div style={{ display: "flex", marginLeft: 0 }}>
                  {a.agents.slice(0, 4).map((ag, i) => (
                    <div key={i} className="av sm" style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid #fff" }}>{ag}</div>
                  ))}
                  {a.agents.length > 4 && (
                    <div className="av sm" style={{ marginLeft: -8, background: "var(--paper-3)", color: "var(--ink-3)", border: "2px solid #fff" }}>
                      +{a.agents.length - 4}
                    </div>
                  )}
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setOpen(a)}>Voir le détail <Ic.Arrow /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && <AgenceModal a={open} onClose={() => setOpen(null)} />}
    </>
  );
}
