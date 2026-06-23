# Implémentation : Versements Physiques (Remittance)

**Date** : 17 Juin 2026
**Objectif** : Créer l'interface de Caisse permettant aux Managers de valider les versements d'espèces effectués par les agents terrain.

## 1. Création du Module Remittance
- Création de `src/types/remittance.types.ts` pour définir le `CashRemittance`.
- Création de `src/services/remittance.service.ts` avec les appels `GET /remittances`, `PATCH /remittances/:id/count` et `PATCH /remittances/:id/resolve`.

## 2. Nouvel Écran (`VersementsScreen.tsx`)
Comme cet écran n'existait pas dans la maquette statique, j'ai conçu un écran **Versements (Remittances)** intégré au menu **Finance**.
- Tableau listant les versements déclarés par les agents (En attente).
- Bouton **Vérifier & Compter** : Le caissier saisit le montant physique qu'il a devant lui (via un simple prompt rapide pour une ergonomie optimale).
- **Protection par Action PIN** : Une fois le montant saisi, la Modale globale de sécurité PIN (`usePinStore`) intercepte l'action pour s'assurer de l'identité du caissier.
- Gestion des écarts (`DISCREPANCY`) avec bouton **Résoudre le litige** permettant aux admins de clore une erreur de caisse (avec justification).

## 3. Mise à jour du Routeur
- Ajout de `versements` dans `VALID_ROUTES`.
- Injection dans la Sidebar.

## Statut
- Le flux complet est opérationnel. Le pont entre le front-end et le workflow backend strict de sécurité financière est assuré.
