# Implémentation : RBAC Sidebar & Système Action PIN

**Date** : 17 Juin 2026
**Objectif** : Achever la Phase 2 (Fondations Restantes) en sécurisant la navigation par rôle et en créant la brique de sécurité de l'Action PIN.

## 1. Sidebar Dynamique (RBAC)
- **Configuration des Routes** : Ajout de la propriété `roles: string[]` sur chaque route métier dans `constants/routes.ts` pour définir précisément qui a le droit d'y accéder (ex: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `AGENT`).
- **Filtrage visuel (`Sidebar.tsx`)** : La Sidebar utilise maintenant les informations du `useAuthStore` pour cacher automatiquement les groupes et liens de navigation qui ne correspondent pas au rôle de l'utilisateur connecté.

## 2. Système Global Action PIN
- **Store Zustand (`pin.store.ts`)** : Création d'un store de gestion asynchrone. L'appel à `requestPin()` renvoie une Promesse en attente de la saisie utilisateur.
- **Composant Modale (`ActionPinModal.tsx`)** : Création de la modale de sécurité globale (surcouche) contenant un champ de saisie centré pour le PIN.
- **Injection Globale (`CovaultyApp.tsx`)** : La modale est placée au plus haut niveau pour pouvoir intercepter l'écran de n'importe où dans l'application.

## 3. Configuration de l'Action PIN (`ProfilScreen.tsx`)
- **Onglet Sécurité** : Ajout d'une sous-section dédiée permettant au membre du staff de configurer son propre Action PIN (Validation de 4 chiffres, confirmation).
- **Service API** : Raccordement à `POST /auth/action-pin/setup` avec gestion d'erreurs en direct.
