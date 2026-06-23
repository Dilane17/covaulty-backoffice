"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { Topbar } from "@/components/layout/Topbar";
import { fcfa } from "@/utils/fcfa";
import { Loan, LoanSchedule } from "@/types/loan.types";
import { Client } from "@/types/client.types";
import { loanService } from "@/services/loan.service";
import { clientService } from "@/services/client.service";
import { usePinStore } from "@/store/pin.store";

export function CreditsScreen() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const [loading, setLoading] = useState(true);
  const { requestPin } = usePinStore();

  const [scheduleModalOpen, setScheduleModalOpen] = useState<Loan | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<LoanSchedule[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [loansRes, clientsRes] = await Promise.all([
        loanService.getAll(),
        clientService.getAll()
      ]).catch(() => [[], []]);
      
      const lData = Array.isArray(loansRes) ? loansRes : ((loansRes as unknown as {data: Loan[]}).data || []);
      const cData = Array.isArray(clientsRes) ? clientsRes : ((clientsRes as unknown as {data: Client[]}).data || []);
      
      setLoans(lData);
      
      const clientMap: Record<string, Client> = {};
      for (const c of cData) {
        clientMap[c.id] = c;
      }
      setClients(clientMap);
    } catch (err) {
      console.error(err);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Voulez-vous approuver cette demande de crédit et générer l'échéancier ?")) return;
    try {
      await loanService.approve(id);
      fetchData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      window.alert(axiosErr.response?.data?.message || "Erreur lors de l'approbation.");
    }
  };

  const handleDisburse = async (id: string) => {
    if (!window.confirm("Procéder au décaissement des fonds sur le compte du client ?")) return;
    const pin = await requestPin();
    if (!pin) return;
    
    try {
      await loanService.disburse(id);
      fetchData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      window.alert(axiosErr.response?.data?.message || "Erreur lors du décaissement.");
    }
  };

  const handleRepay = async (id: string) => {
    const amtStr = window.prompt("Montant du remboursement reçu ?");
    if (!amtStr) return;
    const amount = parseInt(amtStr, 10);
    if (isNaN(amount)) return;
    
    try {
      await loanService.createRepayment(id, { amount, note: "Paiement manuel" });
      window.alert("Remboursement enregistré avec succès !");
      fetchData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      window.alert(axiosErr.response?.data?.message || "Erreur lors de l'enregistrement du remboursement.");
    }
  };

  const handleOpenSchedule = async (loan: Loan) => {
    setScheduleModalOpen(loan);
    setScheduleLoading(true);
    try {
      const data = await loanService.getSchedule(loan.id);
      setScheduleData(data);
    } catch (err) {
      console.error(err);
      setScheduleData([]);
      window.alert("Erreur lors de la récupération de l'échéancier");
    } finally {
      setScheduleLoading(false);
    }
  };

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Finance", "Crédits"]}
        title="Dossiers de Crédit (Loans)"
        sub="Pipeline d'approbation et suivi des remboursements"
        actions={<button className="btn btn-ghost btn-sm" onClick={fetchData}><Ic.Refresh /> Actualiser</button>}
      />

      <div className="content mt-8">
        <div className="card p-0">
          {loading ? (
             <div className="p-8 text-center muted">Chargement des dossiers de crédit...</div>
          ) : (
            <table className="tbl w-full">
              <thead>
                <tr>
                  <th className="text-left">Client</th>
                  <th className="num text-right">Principal</th>
                  <th className="text-left">Taux</th>
                  <th className="text-left">Durée</th>
                  <th className="text-left">Motif</th>
                  <th className="text-left">Statut</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-8 muted">Aucun dossier de prêt enregistré.</td></tr>
                )}
                {loans.map((r) => {
                  const client = clients[r.clientId] || (r as unknown as { client?: Client }).client;
                  const clientName = client ? `${client.firstName} ${client.lastName}` : r.clientId.substring(0, 8);
                  
                  return (
                  <tr key={r.id}>
                    <td className="fw-500">{clientName}</td>
                    <td className="num tnum fw-600 text-primary">{fcfa(r.principal)}</td>
                    <td className="tnum">{r.interestRate}%</td>
                    <td>{r.durationMonths} mois</td>
                    <td className="muted max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {r.purpose || "Non défini"}
                    </td>
                    <td>
                      {(!r.status || r.status === "PENDING") && <span className="pill warn"><span className="dot"/> En attente</span>}
                      {r.status === "APPROVED" && <span className="pill bg-[var(--primary-10)] text-[var(--primary)]"><Ic.Check /> Approuvé (À décaisser)</span>}
                      {r.status === "DISBURSED" && <span className="pill live"><span className="dot"/> Actif (Décaissé)</span>}
                      {r.status === "CLOSED" && <span className="pill good"><Ic.Check /> Soldé</span>}
                    </td>
                    <td className="flex gap-2">
                      {(!r.status || r.status === "PENDING") && (
                        <button className="btn btn-ghost btn-sm" onClick={() => handleApprove(r.id)}>
                          Approuver
                        </button>
                      )}
                      {r.status === "APPROVED" && (
                        <button className="btn btn-primary btn-sm" onClick={() => handleDisburse(r.id)}>
                          Décaisser
                        </button>
                      )}
                      {r.status === "DISBURSED" && (
                        <button className="btn btn-ghost btn-sm text-[var(--accent)]" onClick={() => handleRepay(r.id)}>
                          Paiement
                        </button>
                      )}
                      {r.status && ["APPROVED", "DISBURSED", "CLOSED"].includes(r.status) && (
                        <button className="btn btn-ghost btn-sm" onClick={() => handleOpenSchedule(r)}>
                          <Ic.Eye /> Échéancier
                        </button>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {scheduleModalOpen && (
        <div className="modal-overlay" onClick={() => setScheduleModalOpen(null)}>
          <div className="modal max-w-[600px] w-full" onClick={e => e.stopPropagation()}>
            <div className="modal-head brand">
              <div className="flex-1">
                <div className="title">Échéancier de Crédit</div>
                <div className="sub">Prêt de {fcfa(scheduleModalOpen.principal)}</div>
              </div>
              <button className="close" onClick={() => setScheduleModalOpen(null)}><Ic.X /></button>
            </div>
            <div className="modal-body p-0">
              {scheduleLoading ? (
                <div className="p-8 text-center muted">Chargement de l'échéancier...</div>
              ) : (
                <>
                  <div className="max-h-[60vh] overflow-y-auto">
                    <table className="tbl w-full">
                      <thead>
                        <tr>
                          <th className="text-left">N°</th>
                          <th className="text-left">Date d'échéance</th>
                          <th className="num text-right">Montant dû</th>
                          <th className="text-left">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduleData.length === 0 && (
                          <tr><td colSpan={4} className="text-center py-8 muted">Aucune échéance trouvée.</td></tr>
                        )}
                        {scheduleData.map((s, i) => (
                          <tr key={s.id}>
                            <td className="muted">{i + 1}</td>
                            <td className="fw-500">{new Date(s.dueDate).toLocaleDateString("fr-FR")}</td>
                            <td className="num tnum fw-600">{fcfa(s.amountDue)}</td>
                            <td>
                              {s.status === "PAID" && <span className="pill good">Payé</span>}
                              {s.status === "PENDING" && <span className="pill bg-gray-100 text-gray-600 border border-gray-200">En attente</span>}
                              {s.status === "OVERDUE" && <span className="pill warn">En retard</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-5 bg-[var(--paper)] border-t border-[var(--line)] flex justify-between items-center rounded-b-[inherit]">
                    <div>
                      <div className="muted text-xs mb-1">Total remboursé</div>
                      <div className="tnum fw-600 text-[var(--good)] text-lg">
                        {fcfa(scheduleData.filter(s => s.status === "PAID").reduce((acc, s) => acc + s.amountDue, 0))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="muted text-xs mb-1">Reste à payer</div>
                      <div className="tnum fw-600 text-[var(--ink)] text-lg">
                        {fcfa(scheduleData.filter(s => s.status !== "PAID").reduce((acc, s) => acc + s.amountDue, 0))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
