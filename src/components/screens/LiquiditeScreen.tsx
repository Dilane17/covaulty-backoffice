"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { Topbar } from "@/components/layout/Topbar";
import { fcfa } from "@/utils/fcfa";
import { useAuthStore } from "@/store/auth.store";
import { walletService } from "@/services/wallet.service";
import { userService } from "@/services/user.service";
import { analyticsService } from "@/services/analytics.service";
import { usePinStore } from "@/store/pin.store";
import { AgencyWallet, AgentWallet } from "@/types/wallet.types";
import { User } from "@/types/user.types";
import { LineChart } from "@/components/charts/LineChart";

export function LiquiditeScreen() {
  const user = useAuthStore(s => s.user);
  const { requestPin } = usePinStore();
  
  const [agencyWallet, setAgencyWallet] = useState<AgencyWallet | null>(null);
  const [agents, setAgents] = useState<User[]>([]);
  const [agentWallets, setAgentWallets] = useState<Record<string, AgentWallet>>({});
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [fundNotes, setFundNotes] = useState("");
  const [fundLoading, setFundLoading] = useState(false);

  const agencyId = user?.agencyId || "1";

  const fetchData = async () => {
    try {
      setLoading(true);
      const w = await walletService.getAgencyWallet(agencyId).catch(() => null);
      setAgencyWallet(w);
      
      const forecast = await analyticsService.getForecast(agencyId).catch(() => []);
      const fData = Array.isArray(forecast) ? forecast : (forecast as any).data || [];
      if (fData.length > 0) {
         setForecastData(fData.map((f: any) => ({
             x: new Date(f.date || f.x || new Date()).toLocaleDateString("fr-FR", { weekday: 'short' }),
             y: (f.forecast || f.amount || f.y || 0) / 1000000,
             tip: fcfa(f.forecast || f.amount || f.y || 0)
         })));
      } else {
         // Mock fallback si backend non dispo
         setForecastData([
             { x: "Lun", y: 1.2 }, { x: "Mar", y: 1.5 }, { x: "Mer", y: 1.1 },
             { x: "Jeu", y: 1.8 }, { x: "Ven", y: 2.1 }, { x: "Sam", y: 1.4 }
         ]);
      }
      
      const res = await userService.getAll();
      const ags: User[] = Array.isArray(res) ? res : ((res as unknown as {data: User[]}).data || []);
      const fieldAgents = ags.filter(a => a.role === "AGENT");
      setAgents(fieldAgents);
      
      const wallets: Record<string, AgentWallet> = {};
      await Promise.all(fieldAgents.map(async (a) => {
        try {
          wallets[a.id] = await walletService.getAgentWallet(a.id);
        } catch(e) {}
      }));
      setAgentWallets(wallets);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(fundAmount, 10);
    if (isNaN(amount) || amount <= 0) return window.alert("Montant invalide");
    
    const pin = await requestPin();
    if (!pin) return;
    
    setFundLoading(true);
    try {
      await walletService.fundAgency(agencyId, { amount, notes: fundNotes }, pin);
      setFundModalOpen(false);
      setFundAmount("");
      setFundNotes("");
      fetchData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string, code?: string } } };
      const msg = axiosErr.response?.data?.message || axiosErr.response?.data?.code || "Erreur de transaction";
      if (axiosErr.response?.data?.code === "WALLET_001") window.alert("Solde insuffisant pour cette opération");
      else if (axiosErr.response?.data?.code === "WALLET_002") window.alert("Montant invalide");
      else if (axiosErr.response?.data?.code === "WALLET_003") window.alert("Agence introuvable");
      else window.alert(msg);
    } finally {
      setFundLoading(false);
    }
  };

  const txs = agencyWallet?.transactions || [];

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Finance", "Liquidité & Coffre"]}
        title="Liquidité (Wallet)"
        actions={
          <button className="btn btn-ghost btn-sm" onClick={fetchData}><Ic.Refresh /> Actualiser</button>
        }
      />

      <div className="content mt-8">
        {loading ? (
          <div className="card text-center p-8 muted">Chargement des portefeuilles...</div>
        ) : (
          <>
            <div className="bg-[var(--carbon)] text-white rounded-[22px] p-8 mb-6 relative overflow-hidden">
              <div className="grid grid-cols-[1fr_auto] gap-7 items-center">
                <div>
                  <div className="eyebrow text-white/55">Solde Coffre Agence</div>
                  <div className="tnum font-semibold tracking-tight leading-none mt-3 text-white text-5xl">
                    {fcfa(agencyWallet?.balance || 0)}
                  </div>
                </div>
                <div>
                  <button className="btn btn-primary" onClick={() => setFundModalOpen(true)}>
                    <Ic.Plus /> Injecter des fonds
                  </button>
                </div>
              </div>
            </div>

            <div className="card p-0 mb-6 border border-indigo-100">
              <div className="p-6 border-b border-[var(--line)] bg-indigo-50/50 rounded-t-[22px] flex justify-between items-center">
                <div>
                  <h4 className="flex items-center gap-2"><Ic.Sparkles className="text-indigo-600" /> Prévisions IA (7 jours)</h4>
                  <div className="muted text-sm mt-1">Estimation des besoins en trésorerie pour éviter les ruptures</div>
                </div>
              </div>
              <div className="p-6">
                {forecastData.length > 0 ? (
                  <LineChart data={forecastData} width={800} height={200} color="#4F46E5" />
                ) : (
                  <div className="text-center py-8 muted">Données IA indisponibles</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[1.5fr_1fr] gap-6">
              <div className="card p-0">
                <div className="p-6 border-b border-[var(--line)]">
                  <h4>Historique du coffre</h4>
                </div>
                <table className="tbl w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Type</th>
                      <th className="text-left">Date</th>
                      <th className="text-left">Notes</th>
                      <th className="num text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txs.length === 0 && (
                      <tr><td colSpan={4} className="text-center py-8 muted">Aucune transaction</td></tr>
                    )}
                    {txs.map((tx: { type: string; amount: number; createdAt: string; notes?: string }, i: number) => (
                      <tr key={i}>
                        <td>
                          {tx.type === "FUNDING" && <span className="pill good"><Ic.ArrowDown /> Injection</span>}
                          {tx.type === "WITHDRAWAL" && <span className="pill warn"><Ic.ArrowUp /> Retrait</span>}
                          {tx.type === "REMITTANCE" && <span className="pill"><Ic.ArrowDown /> Versement agent</span>}
                          {tx.type === "LOAN_DISBURSEMENT" && <span className="pill warn"><Ic.ArrowUp /> Crédit</span>}
                        </td>
                        <td className="muted">{new Date(tx.createdAt).toLocaleString("fr-FR")}</td>
                        <td className="muted truncate max-w-[150px]">{tx.notes || "-"}</td>
                        <td className={`num tnum fw-600 ${tx.amount > 0 ? "text-[var(--good)]" : "text-[var(--warn)]"}`}>
                          {fcfa(tx.amount, { sign: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card p-0 h-fit">
                <div className="p-6 border-b border-[var(--line)]">
                  <h4>Encaisse Agents (Terrain)</h4>
                </div>
                <div className="col">
                  {agents.length === 0 && (
                    <div className="text-center py-8 muted">Aucun agent trouvé</div>
                  )}
                  {agents.map(a => {
                    const w = agentWallets[a.id];
                    return (
                      <div key={a.id} className="flex justify-between items-center p-4 border-b border-[var(--line-2)] last:border-b-0">
                        <div className="flex gap-3 items-center">
                          <div className="av bg-[var(--line)] text-[var(--ink)]">{a.firstName[0]}{a.lastName?.[0]}</div>
                          <div>
                            <div className="fw-500">{a.firstName} {a.lastName}</div>
                            <div className="muted text-xs">{a.agentCode || "Agent"}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="tnum fw-600">{w ? fcfa(w.cashBalance) : "-"}</div>
                          <div className="muted text-[10px] uppercase tracking-wider mt-0.5">Non versé</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {fundModalOpen && (
        <div className="modal-overlay" onClick={() => setFundModalOpen(false)}>
          <div className="modal max-w-[400px]" onClick={e => e.stopPropagation()}>
            <div className="modal-head brand">
              <div className="av lg bg-[var(--primary)] text-white"><Ic.ArrowDown /></div>
              <div className="flex-1">
                <div className="title">Injecter des fonds</div>
                <div className="sub">Alimenter le coffre de l'agence</div>
              </div>
              <button className="close" onClick={() => setFundModalOpen(false)}><Ic.X /></button>
            </div>
            <form className="modal-body" onSubmit={handleFund}>
              <div className="col gap-4">
                <div className="input-group">
                  <label htmlFor="liq-amount">Montant (F CFA)</label>
                  <input id="liq-amount" type="number" required min="1" value={fundAmount} onChange={e => setFundAmount(e.target.value)} placeholder="Ex: 5000000" disabled={fundLoading} />
                </div>
                <div className="input-group">
                  <label htmlFor="liq-notes">Notes / Référence</label>
                  <input id="liq-notes" type="text" value={fundNotes} onChange={e => setFundNotes(e.target.value)} placeholder="Ex: Virement BOA du 21/05" disabled={fundLoading} />
                </div>
              </div>
              
              <div className="muted mt-4 text-xs flex gap-2">
                <Ic.Alert /> Cette action nécessite votre Action PIN (demandé à l'étape suivante).
              </div>
              <div className="divider" />
              <div className="flex gap-2 justify-end">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFundModalOpen(false)} disabled={fundLoading}>Annuler</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={fundLoading}>
                  {fundLoading ? "Traitement..." : "Valider l'injection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
