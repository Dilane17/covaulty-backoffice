# Workflow du Module Prêt (Loans)

## 1. Demande de Prêt
1. Un agent sur le terrain soumet une demande de prêt pour un client via l'application mobile (`POST /loans`).
2. Il précise le montant (`principal`), le taux d'intérêt (`interestRate`), la durée (`durationMonths`) et le motif (`purpose`).
3. Le prêt est créé avec le statut `PENDING`.

## 2. Approbation et Génération de l'Échéancier
1. Un `MANAGER`, `ADMIN` ou `SUPER_ADMIN` examine la demande.
2. S'il l'approuve (`PATCH /loans/:id/approve`), le système bascule le statut à `APPROVED`.
3. Le système calcule automatiquement les traites mensuelles (Amortissement) et génère les lignes dans `LoanSchedule`.

## 3. Décaissement
1. Une fois approuvé, l'Admin décaisse physiquement les fonds au client (`PATCH /loans/:id/disburse`).
2. Le statut passe à `DISBURSED`.
3. L'API peut tracer cette sortie de fonds dans le module Wallet.

## 4. Remboursement (Repayment)
1. Le client effectue un versement périodique à l'agent (`POST /loans/:id/repayments`).
2. Ce remboursement est enregistré dans `LoanRepayment`.
3. Le système parcourt l'échéancier (`LoanSchedule`) et marque les mensualités concernées comme `PAID` ou met à jour le montant restant à payer.
4. Si le total remboursé couvre le principal et les intérêts, le prêt est clôturé et passe en statut `CLOSED`.
