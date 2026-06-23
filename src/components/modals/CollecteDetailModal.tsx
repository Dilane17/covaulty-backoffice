"use client";

import { Ic } from "@/components/ui/Icons";
import { Field } from "@/components/ui/Field";
import { fcfa } from "@/utils/fcfa";
import { initials } from "@/utils/initials";
import { CollectionTransaction } from "@/types/collection.types";

interface CollecteDetailModalProps {
  row: CollectionTransaction;
  onClose: () => void;
}

export function CollecteDetailModal({
  row,
  onClose,
}: CollecteDetailModalProps) {
  // Extraction des infos (fallback sur "N/A" si receiptPayload manque)
  const isConfirmed = true; // par défaut ok si reçu par l'API centrale
  const p = row.receiptPayload || {};
  const localRef = p.localRef || row.id.substring(0, 8);
  const dateStr = p.date ? new Date(p.date).toLocaleString("fr-FR") : "Date inconnue";
  const agentName = p.agentName || "Agent inconnu";
  const clientName = p.clientName || "Client inconnu";
  const amountNum = typeof row.amount === "number" ? row.amount : parseFloat(row.amount as string) || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 580 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <div className="title">Détail · #{localRef}</div>
            <div
              className="sub"
              style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}
            >
              Transaction synchronisée et vérifiée
            </div>
          </div>
          <button className="close" onClick={onClose}>
            <Ic.X />
          </button>
        </div>
        <div className="modal-body" style={{ display: "grid", gap: 20 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          >
            <div className="col gap-10">
              <Field k="Référence Système">
                <span className="mono text-xs">{row.id}</span>
              </Field>
              <Field k="Référence Locale">
                <span className="mono">#{localRef}</span>
              </Field>
              <Field k="Date · heure">
                {dateStr}
              </Field>
              <Field k="Agent">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="av sm">{initials(agentName)}</div>
                  <span style={{ fontWeight: 500 }}>{agentName}</span>
                </div>
              </Field>
              <Field k="Client">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="av sm">{initials(clientName)}</div>
                  <span style={{ fontWeight: 500 }}>{clientName}</span>
                </div>
              </Field>
              <Field k="Type d'Opération">
                <span className="pill" style={{ background: "var(--paper-3)", color: "var(--ink)" }}>{row.type}</span>
              </Field>
            </div>
            <div className="col gap-10">
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  Montant
                </div>
                <div
                  className="tnum"
                  style={{
                    fontSize: 36,
                    fontWeight: 600,
                    color: "var(--primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {fcfa(amountNum)}
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                {isConfirmed ? (
                  <span className="pill good">
                    <Ic.Check /> Confirmé
                  </span>
                ) : (
                  <span className="pill warn">
                    <span className="dot" /> En attente sync.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="receipt">
            <div className="ti">COVAULTY · REÇU</div>
            <div className="rl">
              <span>Institution</span>
              <span>{p.institutionName || "Covaulty"}</span>
            </div>
            <div className="rl">
              <span>Réf locale</span>
              <span>#{localRef}</span>
            </div>
            <div className="rl">
              <span>Date</span>
              <span>{dateStr}</span>
            </div>
            <div className="rl">
              <span>Agent</span>
              <span>{agentName}</span>
            </div>
            <div className="rl">
              <span>Client</span>
              <span>{clientName}</span>
            </div>
            <div className="sep" />
            <div className="rl total">
              <span>TOTAL {row.type}</span>
              <span>{fcfa(amountNum)}</span>
            </div>
            <div className="mt-4 text-center">
              <span className="mono text-xs text-gray-400">SIGNATURE: {p.signature?.substring(0, 16) || "N/A"}...</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost">
              <Ic.Print /> Imprimer le reçu
            </button>
            <button className="btn btn-ghost-danger">
              <Ic.Alert /> Signaler un problème
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
