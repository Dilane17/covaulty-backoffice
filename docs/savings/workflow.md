# Workflow du Module Épargne (Savings)

Le module d'épargne permet aux clients de sécuriser des fonds auprès de l'institution, via des "Plans d'Épargne" préconfigurés par les administrateurs.

## 1. Configuration des Plans d'Épargne (SavingsPlan)
- Les `ADMIN` ou `SUPER_ADMIN` créent des plans d'épargne (ex: "Épargne Tontine 12 Mois", "Épargne Libre").
- Un plan définit :
  - Un taux d'intérêt (optionnel).
  - Un dépôt minimum.
  - Des frais de retrait potentiels.
  - La durée minimale avant retrait (lock-in period).

## 2. Ouverture de Compte Épargne
- Un agent ou manager peut ouvrir un compte (`SavingsAccount`) pour un client existant, en le liant à un `SavingsPlan`.
- **Contrainte d'Unicité (V1)** : Un client ne peut posséder qu'**un seul compte épargne actif** à la fois. Toute tentative de création d'un second compte pour le même client lèvera l'erreur `SAVINGS_005`.
- Lors de l'ouverture, le système vérifie si le solde de dépôt initial est requis.

## 3. Dépôt (Collection - Épargne)
- L'agent sur le terrain effectue une collecte (`POST /collection/transactions`).
- Si le module Savings est actif, la collecte augmente la balance du `SavingsAccount` du client.

## 4. Retrait (Guichet)
- Les retraits d'épargne (Withdrawal) ne se font **pas** sur le terrain pour des raisons de sécurité.
- Le client se présente au guichet de l'agence.
- Le guichetier (Manager) ou le caissier initie un retrait sur le compte épargne (`POST /savings/withdraw`).
- Le système vérifie la balance du compte, calcule les éventuelles pénalités de retrait anticipé, déduit le montant du compte épargne, et remet le cash au client.
- Cela crée une transaction de type `WITHDRAWAL` et déduit l'argent du `walletBalance` de l'agence.
