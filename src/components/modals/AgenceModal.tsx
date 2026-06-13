"use client";

import { Ic } from "@/components/ui/Icons";
import { KpiSm } from "@/components/ui/KpiCard";
import { LineChart } from "@/components/charts/LineChart";
import { fcfa } from "@/utils/fcfa";
import { Agence } from "@/types/agence";

interface AgenceModalProps {
  a: Agence;
  onClose: () => void;
}

export function AgenceModal({ a, onClose }: AgenceModalProps) {
  const chart = [
    { x: "Sem 17", y: 0.9 },
    { x: "Sem 18", y: 1.0 },
    { x: "Sem 19", y: 1.1 },
    { x: "Sem 20", y: 1.18 },
    { x: "Cette sem.", y: 1.247 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head brand-red">
          <div style={{ flex: 1 }}>
            <div className="title">{a.n}</div>
            <div className="sub">{a.a}</div>
          </div>
          <span className="pill good"><span className="dot" /> Opérationnelle</span>
          <button className="close" onClick={onClose}><Ic.X /></button>
        </div>
        <div className="tabs-underline" style={{ padding: "0 28px" }}>
          <button className="tab active">Vue générale</button>
          <button className="tab">Agents</button>
          <button className="tab">Performances</button>
        </div>
        <div className="modal-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            <KpiSm v={a.nA} l="Agents" />
            <KpiSm v={a.nC.toLocaleString("fr-FR")} l="Clients" />
            <KpiSm v={fcfa(a.w)} l="Cette sem." />
            <KpiSm v={`${a.o}%`} l="Objectif" />
          </div>

          <div className="eyebrow" style={{ marginBottom: 10 }}>Évolution hebdomadaire</div>
          <LineChart data={chart} width={580} height={180} color="var(--primary)" />

          <div className="divider" />

          <div className="eyebrow" style={{ marginBottom: 10 }}>Agents de l&apos;agence</div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Zone</th>
                <th className="num">Collecté/sem</th>
                <th>Objectif</th>
              </tr>
            </thead>
            <tbody>
              {a.agents.slice(0, 5).map((ag, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="av sm">{ag}</div>
                    </div>
                  </td>
                  <td className="muted">Zone {i + 1}</td>
                  <td className="num tnum fw-600">{fcfa(110000 + i * 20000)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="bar"><span style={{ width: `${90 - i * 10}%` }} /></div>
                      <span className="muted" style={{ fontSize: 12 }}>{90 - i * 10}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
