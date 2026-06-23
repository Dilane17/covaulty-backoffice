"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { CreateSavingsPlanPayload } from "@/types/savings.types";

interface Props {
  onClose: () => void;
  onSave: (data: CreateSavingsPlanPayload) => Promise<any>;
}

export function PlanEpargneFormModal({ onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [minDeposit, setMinDeposit] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSave({
        name,
        annualRate: annualRate ? Number(annualRate) : 0,
        durationMonths: durationMonths ? Number(durationMonths) : 1,
        minDeposit: minDeposit ? Number(minDeposit) : 0,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la création du plan d'épargne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal max-w-[450px]" onClick={e => e.stopPropagation()}>
        <div className="modal-head brand">
          <div className="title">Nouveau Plan d'Épargne</div>
          <button className="btn-icon" aria-label="Fermer" onClick={onClose}><Ic.X /></button>
        </div>
        <div className="modal-body">
          <p className="muted mb-6">Créer un nouveau produit d'épargne pour l'institution.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 flex items-start gap-2">
            <span className="mt-0.5"><Ic.Alert /></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="input-group">
            <label htmlFor="plan-name">Nom du plan</label>
            <input id="plan-name" required value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Épargne Tontine 12 Mois" disabled={loading} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="input-group">
              <label htmlFor="plan-rate">Taux d'intérêt annuel (%)</label>
              <input id="plan-rate" type="number" step="0.1" min="0" value={annualRate} onChange={e => setAnnualRate(e.target.value)} placeholder="Ex: 2.5" disabled={loading} />
            </div>
            <div className="input-group">
              <label htmlFor="plan-deposit">Dépôt minimum (FCFA)</label>
              <input id="plan-deposit" type="number" required min="0" value={minDeposit} onChange={e => setMinDeposit(e.target.value)} placeholder="Ex: 1000" disabled={loading} />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="plan-duration">Durée de blocage (mois)</label>
            <input id="plan-duration" type="number" required min="1" value={durationMonths} onChange={e => setDurationMonths(e.target.value)} placeholder="Ex: 12" disabled={loading} />
            <div className="hint mt-1 text-[11px] text-[var(--ink-3)]">1 mois minimum.</div>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" className="btn btn-ghost flex-1 justify-center" onClick={onClose} disabled={loading}>Annuler</button>
            <button type="submit" className="btn btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? "Création..." : "Enregistrer le plan"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
