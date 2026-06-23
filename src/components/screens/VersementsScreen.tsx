"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { Topbar } from "@/components/layout/Topbar";
import { fcfa } from "@/utils/fcfa";
import { CashRemittance } from "@/types/remittance.types";
import { remittanceService } from "@/services/remittance.service";
import { usePinStore } from "@/store/pin.store";

export function VersementsScreen() {
  const [remittances, setRemittances] = useState<CashRemittance[]>([]);
  const [loading, setLoading] = useState(true);
  const { requestPin } = usePinStore();

  const fetchRemittances = async () => {
    try {
      setLoading(true);
      const res: any = await remittanceService.getAll();
      setRemittances(Array.isArray(res) ? res : (res.data || []));
    } catch (err) {
      console.error(err);
      setRemittances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemittances();
  }, []);

  const handleCount = async (id: string, declaredAmount: number) => {
    const countedStr = window.prompt(`Caisse :\nSaisissez le montant physique que vous avez compté :\n\n(L'agent a déclaré ${declaredAmount} F CFA)`, declaredAmount.toString());
    if (!countedStr) return;
    
    const countedAmount = parseInt(countedStr, 10);
    if (isNaN(countedAmount)) return;

    const pin = await requestPin();
    if (!pin) return;

    try {
      await remittanceService.count(id, countedAmount, pin);
      fetchRemittances();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erreur lors du comptage.";
      window.alert(msg);
      if (err.response?.status === 409) {
        // Discrepancy détectée
        fetchRemittances();
      }
    }
  };

  const handleResolve = async (id: string) => {
    const finalStr = window.prompt(`Résolution d'écart de caisse :\nQuel est le montant final retenu après enquête ?`);
    if (!finalStr) return;
    const finalAmount = parseInt(finalStr, 10);
    if (isNaN(finalAmount)) return;

    const reason = window.prompt("Quelle est la raison de l'écart / conclusion de l'enquête ?");
    if (!reason) return;

    const pin = await requestPin();
    if (!pin) return;

    try {
      await remittanceService.resolve(id, finalAmount, reason, pin);
      fetchRemittances();
    } catch (err: any) {
      window.alert(err.response?.data?.message || "Erreur de résolution.");
    }
  };

  const list = Array.isArray(remittances) ? remittances : [];

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Finance", "Versements Agents"]}
        title="Versements (Remittances)"
        sub="Dépôts physiques des agents à la caisse de l'agence"
        actions={<button className="btn btn-ghost btn-sm" onClick={fetchRemittances}><Ic.Refresh /> Actualiser</button>}
      />

      <div className="content mt-8">
        <div className="card p-0">
          {loading ? (
             <div className="p-8 text-center muted">Chargement des versements en attente...</div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Date de déclaration</th>
                  <th>Agent concerné</th>
                  <th className="num">Montant déclaré</th>
                  <th className="num">Montant compté</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-8 muted">Aucun versement en attente.</td></tr>
                )}
                {list.map((r) => (
                  <tr key={r.id}>
                    <td className="mono text-xs">#{r.id.substring(0,8)}</td>
                    <td className="muted">{new Date(r.createdAt).toLocaleString("fr-FR")}</td>
                    <td className="fw-500">{r.agent?.firstName || "Agent"} {r.agent?.lastName || "Inconnu"}</td>
                    <td className="num tnum fw-600">{fcfa(r.declaredAmount)}</td>
                    <td className="num tnum">{r.countedAmount != null ? fcfa(r.countedAmount) : "-"}</td>
                    <td>
                      {r.status === "PENDING" && <span className="pill warn"><span className="dot"/> En attente de caisse</span>}
                      {r.status === "VALIDATED" && <span className="pill good"><Ic.Check /> Validé</span>}
                      {r.status === "DISCREPANCY" && <span className="pill bg-[var(--primary-10)] text-primary"><Ic.Alert /> Écart détecté</span>}
                      {r.status === "RESOLVED" && <span className="pill"><Ic.Check /> Résolu</span>}
                    </td>
                    <td>
                      {r.status === "PENDING" && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleCount(r.id, r.declaredAmount)}>
                          Vérifier & Compter
                        </button>
                      )}
                      {r.status === "DISCREPANCY" && (
                        <button className="btn btn-ghost-danger btn-sm" onClick={() => handleResolve(r.id)}>
                          Résoudre le litige
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
