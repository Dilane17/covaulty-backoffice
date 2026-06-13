"use client";

import { Ic } from "@/components/ui/Icons";
import { Field } from "@/components/ui/Field";
import { fcfa } from "@/utils/fcfa";
import { initials } from "@/utils/initials";
import { CollecteRow } from "@/types/collecte";

interface CollecteDetailModalProps {
  row: CollecteRow;
  onClose: () => void;
}

export function CollecteDetailModal({
  row,
  onClose,
}: CollecteDetailModalProps) {
  const isConfirmed = row.st === "ok";
  const soldeAfter = row.soldeBefore + row.m;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 580 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <div className="title">Détail · #{row.r}</div>
            <div
              className="sub"
              style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}
            >
              {isConfirmed
                ? "Transaction confirmée et signée"
                : "En attente de synchronisation"}
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
              <Field k="Référence">
                <span className="mono">#{row.r}</span>
              </Field>
              <Field k="Date · heure">
                {row.date} · {row.h}
              </Field>
              <Field k="Agent">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="av sm">{row.ai}</div>
                  <span style={{ fontWeight: 500 }}>{row.a}</span>
                </div>
              </Field>
              <Field k="Client">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="av sm">{initials(row.c)}</div>
                  <span style={{ fontWeight: 500 }}>{row.c}</span>
                </div>
              </Field>
              <Field k="Zone">{row.z}</Field>
              <Field k="Mode">{row.md}</Field>
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
                  {fcfa(row.m)}
                </div>
              </div>
              <Field k="Solde avant">{fcfa(row.soldeBefore)}</Field>
              <Field k="Solde après">
                <strong>{fcfa(soldeAfter)}</strong>
              </Field>
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

          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              Géolocalisation
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: 14,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: 80,
                  borderRadius: 10,
                  background:
                    "linear-gradient(135deg, #DCE7F2 0%, #B3001B22 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "55%",
                    top: "50%",
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    background: "var(--primary)",
                    border: "2px solid #fff",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{row.loc}</div>
                <div
                  className="muted mono"
                  style={{ fontSize: 12, marginTop: 2 }}
                >
                  {row.lat} · {row.lng} · ±12 m
                </div>
              </div>
            </div>
          </div>

          <div className="receipt">
            <div className="ti">COVAULTY · REÇU</div>
            <div className="rl">
              <span>Réf</span>
              <span>#{row.r}</span>
            </div>
            <div className="rl">
              <span>Date</span>
              <span>
                {row.date} {row.h}
              </span>
            </div>
            <div className="rl">
              <span>Agent</span>
              <span>{row.a}</span>
            </div>
            <div className="rl">
              <span>Client</span>
              <span>{row.c}</span>
            </div>
            <div className="sep" />
            <div className="rl total">
              <span>DÉPÔT</span>
              <span>{fcfa(row.m)}</span>
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
