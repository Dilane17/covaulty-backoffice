"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { Topbar } from "@/components/layout/Topbar";
import { PlanEpargneFormModal } from "@/components/modals/PlanEpargneFormModal";
import { fcfa } from "@/utils/fcfa";
import { SavingsPlan, CreateSavingsPlanPayload } from "@/types/savings.types";
import { savingsService } from "@/services/savings.service";

export function PlansEpargneScreen() {
  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res: any = await savingsService.getPlans();
      setPlans(Array.isArray(res) ? res : (res.data || []));
    } catch (err) {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async (payload: CreateSavingsPlanPayload) => {
    const res = await savingsService.createPlan(payload);
    fetchPlans();
    return res;
  };

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Finance", "Plans d'épargne"]}
        title="Plans d'Épargne"
        sub={`${plans.length} plans configurés`}
        actions={<button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}><Ic.Plus /> Nouveau plan</button>}
      />

      <div className="content pt-4">
        <div className="card p-0">
          {loading ? (
             <div className="p-8 text-center muted">Chargement des plans d'épargne...</div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Nom du plan</th>
                  <th className="num">Taux annuel</th>
                  <th className="num">Dépôt minimum</th>
                  <th className="num">Durée blocage</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 muted">Aucun plan d'épargne configuré.</td></tr>
                )}
                {plans.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-500">{p.name}</td>
                    <td className="num tnum text-accent">
                      {p.annualRate ? `${p.annualRate}%` : "Aucun"}
                    </td>
                    <td className="num tnum">{fcfa(p.minDeposit || 0)}</td>
                    <td className="num tnum">
                      {p.durationMonths ? `${p.durationMonths} mois` : "1 mois"}
                    </td>
                    <td>
                      {p.isActive !== false ? (
                        <span className="pill good"><span className="dot" /> Actif</span>
                      ) : (
                        <span className="pill muted"><span className="dot bg-ink-4" /> Inactif</span>
                      )}
                    </td>
                    <td><button className="btn-icon text-ink-3" aria-label="Configurer le plan"><Ic.Cog /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <PlanEpargneFormModal
          onClose={() => setShowForm(false)}
          onSave={handleCreatePlan}
        />
      )}
    </>
  );
}
