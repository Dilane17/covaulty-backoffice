"use client";

import { Ic } from "@/components/ui/Icons";
import { Field } from "@/components/ui/Field";
import { KpiSm } from "@/components/ui/KpiCard";
import { Stars } from "@/components/ui/Stars";
import { LineChart } from "@/components/charts/LineChart";
import { fcfa } from "@/utils/fcfa";
import { Agent } from "@/types/agent";

interface AgentFicheModalProps {
  a: Agent;
  onClose: () => void;
  onEdit?: () => void;
  editAgent?: Agent;
}

const STATUS_MAP = {
  on: { label: "Sur le terrain", cls: "live" },
  off: { label: "Inactif", cls: "warn" },
  ofl: { label: "Hors-ligne", cls: "off" },
} as const;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AgentFicheModal({ a, onClose, onEdit }: AgentFicheModalProps) {
  const status = STATUS_MAP[a.s];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal max-w-[720px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head brand">
          <div
            className="av lg bg-primary text-white"
          >
            {a.i}
          </div>
          <div className="flex-1">
            <div className="title">{a.n}</div>
            <div className="sub">Agent terrain · {a.z}</div>
          </div>
          <span className={`pill ${status.cls}`}>
            <span className="dot" /> {status.label}
          </span>
          <button
            className="btn btn-ghost btn-sm bg-transparent text-[rgba(255,255,255,0.9)] border border-[rgba(255,255,255,0.2)]"
            onClick={onEdit}
          >
            Modifier
          </button>
          <button
            className="btn btn-sm bg-transparent text-[rgba(255,255,255,0.9)] border border-[rgba(255,255,255,0.2)]"
          >
            Désactiver
          </button>
          <button className="close" onClick={onClose}>
            <Ic.X />
          </button>
        </div>
        <div className="modal-body">
          <div className="grid grid-cols-2 gap-7">
            <div>
              <div className="eyebrow mb-2">Statistiques Terrain</div>
              <div className="col gap-10">
                <Field k="Téléphone">{a.tel}</Field>
                <Field k="Email">{a.em}</Field>
                <Field k="Zone assignée">{a.z}</Field>
                <Field k="Date d'embauche">{formatDate(a.dn)}</Field>
                <Field k="Appareil mobile">{a.device}</Field>
                <Field k="Dernière synchro">{a.lastSync}</Field>
              </div>
            </div>
            <div>
              <div className="eyebrow mb-2">Performance aujourd&apos;hui</div>
              <div
                className="grid grid-cols-2 gap-2"
              >
                <KpiSm v={a.d} l="Dépôts" />
                <KpiSm v={fcfa(a.c)} l="Collecté" />
                <KpiSm v={`${a.o}%`} l="Objectif" />
                <KpiSm v={a.alerts30d} l="Alertes 30j" />
              </div>
              <div className="mt-16">
                <div className="eyebrow mb-2">Équipement</div>
                <LineChart
                  data={a.weeklyData}
                  width={400}
                  height={140}
                  color="var(--primary)"
                />
              </div>
            </div>
          </div>

          <div className="divider" />

          <div className="eyebrow" style={{ marginBottom: 10 }}>
            5 dernières collectes
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th className="num">Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {a.transactions.map((r, i) => (
                <tr key={i}>
                  <td className="muted">{r.d}</td>
                  <td>{r.c}</td>
                  <td className="num tnum text-accent fw-600">
                    {fcfa(r.m, { sign: true })}
                  </td>
                  <td>
                    <span className="pill good">
                      <span className="dot" /> Confirmé
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="divider" />

          <div className="between">
            <div>
              <div className="eyebrow mb-1">Caisse Agent</div>
              <div className="flex items-center gap-2">
                <Stars value={Math.round(a.rt)} />
                <span className="text-xl font-semibold">
                  {a.rt.toFixed(1)} / 5.0
                </span>
                <span className="muted text-xs">
                  · Sur 84 retours clients
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontSize: 12,
                color: "var(--ink-3)",
                maxWidth: 320,
              }}
            >
              <div>« Ponctuel, toujours souriant. » — Mme Hounkpati</div>
              <div>« Il prend le temps de compter avec moi. » — M. Adjovi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
