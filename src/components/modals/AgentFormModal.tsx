"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { FieldInput } from "@/components/ui/Field";
import { Agent } from "@/types/agent";

interface AgentFormModalProps {
  agent?: Agent;
  onClose: () => void;
  onSave: (data: AgentFormData) => void;
}

export interface AgentFormData {
  n: string;
  z: string;
  tel: string;
  em: string;
}

const ZONES = [
  "Akpakpa T1",
  "Akpakpa T2",
  "Cotonou T1",
  "Cotonou T2",
  "Cotonou T3",
  "Adjarra T1",
  "Adjarra T2",
  "Ouando T4",
  "Cadjehoun",
  "Porto-Novo",
  "Sèmè-Kpodji",
  "Sèmè T2",
];

export function AgentFormModal({ agent, onClose, onSave }: AgentFormModalProps) {
  const isEdit = !!agent;

  const [form, setForm] = useState<AgentFormData>({
    n:   agent?.n   ?? "",
    z:   agent?.z   ?? "",
    tel: agent?.tel ?? "",
    em:  agent?.em  ?? "",
  });

  const [errors, setErrors] = useState<Partial<AgentFormData>>({});

  function set(k: keyof AgentFormData, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<AgentFormData> = {};
    if (!form.n.trim())   e.n   = "Nom requis";
    if (!form.z.trim())   e.z   = "Zone requise";
    if (!form.tel.trim()) e.tel = "Téléphone requis";
    if (!form.em.trim())  e.em  = "Email requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 520 }}
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="modal-head brand">
          <div className="av lg" style={{ background: "var(--primary)", color: "#fff" }}>
            {isEdit ? agent.i : <Ic.Plus />}
          </div>
          <div style={{ flex: 1 }}>
            <div className="title">
              {isEdit ? `Modifier ${agent.n}` : "Ajouter un agent"}
            </div>
            <div className="sub">
              {isEdit ? "Mise à jour des informations" : "Nouvel agent terrain"}
            </div>
          </div>
          <button className="close" onClick={onClose}>
            <Ic.X />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit} noValidate>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div className="field">
              <label>Nom complet</label>
              <div className={`input${errors.n ? " input--error" : ""}`}>
                <input
                  type="text"
                  placeholder="ex. Koffi Adjovi"
                  value={form.n}
                  onChange={(e) => set("n", e.target.value)}
                  autoFocus
                />
              </div>
              {errors.n && (
                <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 4 }}>
                  {errors.n}
                </div>
              )}
            </div>

            <div className="field">
              <label>Zone assignée</label>
              <div className={`input${errors.z ? " input--error" : ""}`}>
                <select
                  value={form.z}
                  onChange={(e) => set("z", e.target.value)}
                  style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: 14, color: form.z ? "var(--ink)" : "var(--ink-4)" }}
                >
                  <option value="" disabled>Choisir une zone…</option>
                  {ZONES.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>
              {errors.z && (
                <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 4 }}>
                  {errors.z}
                </div>
              )}
            </div>

            <div className="field">
              <label>Téléphone</label>
              <div className={`input${errors.tel ? " input--error" : ""}`}>
                <input
                  type="tel"
                  placeholder="+229 97 00 00 00"
                  value={form.tel}
                  onChange={(e) => set("tel", e.target.value)}
                />
              </div>
              {errors.tel && (
                <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 4 }}>
                  {errors.tel}
                </div>
              )}
            </div>

            <div className="field">
              <label>Email</label>
              <div className={`input${errors.em ? " input--error" : ""}`}>
                <input
                  type="email"
                  placeholder="prenom.nom@coopec.bj"
                  value={form.em}
                  onChange={(e) => set("em", e.target.value)}
                />
              </div>
              {errors.em && (
                <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 4 }}>
                  {errors.em}
                </div>
              )}
            </div>

          </div>

          <div className="divider" />

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {isEdit ? <><Ic.Check /> Enregistrer</> : <><Ic.Plus /> Ajouter l&apos;agent</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
