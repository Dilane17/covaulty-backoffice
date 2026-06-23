# Plan de Développement Covaulty (Roadmap Officielle)

**Date** : 17 Juin 2026
**Statut** : Phase 1 terminée. Prêt pour la Phase 2.

---

## Phase 1 - Stabilisation Auth (✅ Terminée)
- [x] Tests manuels Login / OTP / 2FA / Refresh / Logout
- [x] Vérifier `localStorage` + redirections (Zustand persist)
- [x] Résolution Multi-Tenant (slug + `x-tenant-id`)
- [x] Fondations validées

## Phase 2 - Fondations restantes (✅ Terminée)
- [x] **Setup Password** : Écran de configuration initiale `/auth/setup-password`.
- [x] **Action PIN** : Setup `/auth/action-pin/setup` et modale globale d'interception.
- [x] **RBAC Sidebar dynamique** : Masquage conditionnel des items de menu selon le rôle de l'utilisateur.

## Phase 2.5 - Couche Services API (✅ Terminée)
*Centralisation de tous les appels Axios et typages TypeScript avant d'attaquer les écrans.*
- [x] `institution.service.ts` (Compléter)
- [x] `agency.service.ts`
- [x] `user.service.ts` (Staff)
- [x] `client.service.ts` (KYC)
- [x] `collection.service.ts`
- [x] `savings.service.ts`
- [x] `loan.service.ts`
- [x] `wallet.service.ts`

## Phase 3 - Admin SaaS (✅ Terminée)
- [x] **Écran Institutions** : Liste et gestion des microfinances clientes.
- [x] **Workflow Onboarding** : Formulaire d'invitation (`POST /institutions/invite`).

## Phase 4 - Core Backoffice (✅ Terminée)
- [x] **Agences** : Gestion des points de présence.
- [x] **Staff (Agents & Managers)** : Gestion des employés et affectations.
- [x] **Clients KYC** : Validation d'identité et gestion des dossiers emprunteurs/épargnants.

## Phase 5 - Flux Financier (✅ Terminée)
- [x] **Collectes & Épargne** : Historique et validation de la collecte terrain.
- [x] **Versements (Remittance)** : Suivi des versements physiques des agents.
- [x] **Crédits (Loans)** : Pipeline d'approbation et suivi des remboursements.

## Phase 6 - Dashboard (✅ Terminée)
- [x] **KPIs consolidés** : Connexion des widgets aux données réelles (issues des Phases 4 & 5).
- [x] **Flux d'activité Live**.

## Phase 7 - Améliorations Futures (✅ Terminée)
- [x] **WebSocket / SSE** : Smart Polling + Focus Refetch intégrés.
- [x] **PWA + Mode Offline** : Manifest web-app inclus pour installation locale.
- [x] **Export BCEAO PDF/Excel** : Moteur de génération de CSV et JSON réglementaires fonctionnel.

> 🎉 L'infrastructure Front-End Covaulty est terminée !
