# Checklist de Test d'Intégration - Backoffice Covaulty

Ce document référence le parcours de test d'intégration "End-to-End" (E2E) exhaustif pour le backoffice Covaulty, basé sur l'ordre des dépendances métier.

---

## 1. Auth (Déjà validé)
- [x] Connexion réussie et récupération du JWT (`POST /auth/login`).
- [x] Interception automatique du Refresh Token au bout de 15mn.
- [x] Sécurisation des routes via Guards frontend.

---

## 2. Institution (Super Admin uniquement)
**Pré-requis** : Être connecté avec un compte Super Admin.
- [ ] **Action** : Naviguer vers Paramètres > Institution. Remplir Nom, Slug, Configuration Branding.
- [ ] **Résultat Attendu** : L'UI se met à jour instantanément avec les nouvelles couleurs (`branding.primaryColor`). L'API renvoie un succès (200).
- [ ] **Cohérence** : Les informations du `useTenantStore` sont mises à jour sans rechargement complet de la page.

---

## 3. Agence (`Agency`)
**Pré-requis** : Connecté en tant que Super Admin ou Admin.
- [x] **Action** : Aller sur l'écran **Agences** (`AgencesScreen`). Cliquer sur "Nouvelle agence". Remplir Nom, Adresse, Téléphone, Email.
- [x] **Résultat Attendu** : La nouvelle ligne apparaît dans le tableau des agences. L'API retourne un code HTTP 201 avec le nouvel objet `Agency`.
- [x] **Cas d'erreur** : Essayer d'ouvrir le détail d'une agence supprimée dans l'API. (Attendu : `AGENCY_001` - Agence introuvable).

---

## 4. Staff (Manager + Agents)
**Pré-requis** : Avoir au moins 1 agence existante.
- [x] **Action** : Aller sur **Équipe / Agents**. Créer un nouvel utilisateur avec le rôle `AGENT`, lui affecter l'Agence précédemment créée.
- [x] **Résultat Attendu** : L'agent apparaît dans la liste de l'agence. Le tableau de bord affiche "1 Agent actif".
- [x] **Cas d'erreur à provoquer** : 
  - Créer un agent avec un email déjà existant (Attendu : `USER_002`).
  - Affecter l'agent à une agence d'une autre institution (Attendu : `WALLET_003`).

---

## 5. Client (KYC)
**Pré-requis** : Avoir un agent enregistré.
- [x] **Action** : Écran **Clients KYC**. Cliquer sur "Nouveau client KYC". Remplir Prénom, Nom, Téléphone, Adresse, N° de CNI.
- [x] **Résultat Attendu** : Le client apparaît avec un `clientCode` généré automatiquement et un Credit Score initialisé.
- [x] **Cas d'erreur à provoquer** : 
  - Saisir un numéro de téléphone mal formaté (Attendu : `VALID_001`).

---

## 6. Plans d'épargne
**Pré-requis** : Avoir les droits d'Admin.
- [x] **Action** : (Via UI existante si implémentée ou via un script Postman en attendant). Créer un plan "Épargne Tontine" (Intérêt 2.5%, Lock 12 mois).
- [x] **Résultat Attendu** : L'API retourne le `SavingsPlan`.

---

## 7. Compte Épargne Client
**Pré-requis** : Un client (`cli_xyz`) et un plan d'épargne (`plan_xyz`).
- [x] **Action** : Ouvrir la fiche du Client. Lui ouvrir un compte épargne lié au plan créé.
- [x] **Résultat Attendu** : Le client possède un compte avec solde = 0.
- [x] **Cohérence** : Le compte est listé sur `RapportsScreen` et `BCEAOScreen` avec statut "Actif".

---

## 8. Collecte Terrain (Dépôt / Retrait)
**Pré-requis** : Un Client avec un compte épargne actif. Un Agent.
- [ ] **Action** : Simuler une collecte (`POST /collection/transactions`). `clientId`, type `DEPOSIT`, montant 5000.
- [ ] **Résultat Attendu** : Transaction ajoutée sur `TransactionsScreen`. Badge VERT (Dépôt).
- [ ] **Cohérence inter-modules** : 
  - Le solde du client (`SavingsAccount.balance`) doit avoir augmenté de 5000.
  - Le solde d'encaisse de l'Agent (`AgentWallet.cashBalance`) doit avoir augmenté de 5000.
- [ ] **Cas d'erreur à provoquer** : 
  - Faire la collecte en dehors des heures définies (`COLLECT_001`).
  - Faire un retrait terrain (`WITHDRAWAL`) d'un montant supérieur au solde du client (`COLLECT_003`).
  - Client sans compte épargne actif (`SAVINGS_006`).

---

## 9. Versement Agent (Remittance) & Écart de caisse
**Pré-requis** : Un Agent ayant fait des collectes (ex: `cashBalance` de 5000).
- [ ] **Action 1** : L'agent déclare 5000 au guichet (`POST /remittances`).
- [ ] **Résultat Attendu** : Le versement apparaît "En attente" (`PENDING`).
- [ ] **Cas d'erreur à provoquer** : 
  - L'agent déclare 6000 alors qu'il n'a que 5000 (`REM_005` - Solde insuffisant).
  - L'agent déclare à nouveau 5000 avant validation (`REM_001` - Versement déjà en attente).
- [ ] **Action 2 (Guichet/Caissier)** : Comptage `PATCH /remittances/:id/count`. Déclarer 4000 au lieu de 5000 avec le PIN du caissier.
- [ ] **Résultat Attendu** : Déclenchement automatique d'un statut `DISCREPANCY` (Code 409 `REM_002`). Une alerte de niveau CRITICAL est générée pour les managers.
- [ ] **Action 3 (Manager)** : `PATCH /remittances/:id/resolve` avec PIN d'action. Assigner `finalAmount: 4000` avec motif.
- [ ] **Cohérence** : Le statut passe à `RESOLVED`. Le Wallet de l'agence augmente de 4000, le Wallet de l'agent est purgé, la différence est tracée. Le compte épargne du client est inchangé.

---

## 10. Crédit (Loan)
**Pré-requis** : Un Client éligible (Score de crédit correct).
- [ ] **Action 1** : Créer un prêt (`POST /loans`). Principal: 500k, 12 mois.
- [ ] **Résultat Attendu** : Prêt en statut `PENDING`.
- [ ] **Action 2 (Admin)** : Approuver (`PATCH /loans/:id/approve`). 
- [ ] **Résultat Attendu** : Statut `APPROVED`, échéancier (`LoanSchedule`) généré.
- [ ] **Action 3 (Admin)** : Décaisser (`PATCH /loans/:id/disburse`).
- [ ] **Cohérence** : Statut `DISBURSED`. Le `walletBalance` de l'Institution/Agence baisse de 500k. Le solde Client augmente s'il est versé sur l'épargne.
- [ ] **Action 4** : Remboursement partiel (`POST /loans/:id/repayments`). 
- [ ] **Résultat Attendu** : La première échéance passe en `PAID` ou `PARTIAL`.

---

## 11. Alertes (Workflow global)
**Pré-requis** : L'étape de "Versement" en DISCREPANCY a été effectuée.
- [ ] **Action** : Ouvrir le widget d'alerte dans le menu (via Badge). Cliquer sur l'Alerte (Écart de Caisse).
- [ ] **Résultat Attendu** : L'Alerte indique le montant de l'écart. Un bouton "Résoudre" permet de clôturer l'alerte (`PATCH /alerts/:id/resolve`).

---

## 12. Dashboard & Rapports
**Pré-requis** : Avoir généré des transactions, des prêts et des versements.
- [ ] **Action** : Naviguer vers `DashboardScreen` et `RapportsScreen`.
- [ ] **Cohérence** : Les KPIs (Collecte ce mois, Retraits, Net, Commissions 5%) doivent mathématiquement correspondre exactement à la somme des objets de la liste.
- [ ] **Export BCEAO** : Naviguer vers `BCEAOScreen`, générer l'Export CSV Dépôts/Épargne. L'ouvrir avec Excel pour vérifier que l'encodage (UTF-8 BOM) affiche correctement les accents et les colonnes.

---

## 📋 Récapitulatif des Codes Erreur (Check final des UI Toasts)

| Code | Contexte | Message Front-end attendu |
|---|---|---|
| `AGENCY_001` | Agence introuvable | "L'agence demandée n'existe pas ou a été supprimée." |
| `USER_002` | Création Agent | "Cet email est déjà utilisé par un autre compte." |
| `WALLET_003` | Lien Agence-Agent | "L'agence spécifiée n'appartient pas à votre institution." |
| `VALID_001` | Formulaire Client | "Le numéro de téléphone est invalide." |
| `COLLECT_001` | Terrain | "Vous ne pouvez pas collecter en dehors de la plage horaire." |
| `COLLECT_003` | Terrain | "Solde client insuffisant pour effectuer ce retrait." |
| `SAVINGS_006` | Terrain | "Le client ne possède aucun compte épargne actif." |
| `REM_001` | Versement | "Un versement est déjà en attente d'approbation." |
| `REM_002` | Versement (Caissier) | "Écart de caisse détecté ! Un manager doit intervenir." |
| `REM_005` | Versement | "Le montant déclaré dépasse le solde de votre portefeuille." |
| `PIN_002` | Ajustement / Résolution | "Code d'autorisation (PIN) invalide." |
