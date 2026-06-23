# Implémentation : Clients KYC (Core Backoffice)

**Date** : 17 Juin 2026
**Objectif** : Remplacer les données de démonstration du listing clients par l'API Client réelle, finalisant ainsi la Phase 4.

## 1. Mise à jour de `client.service.ts`
- Ajout de la méthode `getAll()` pour interroger `GET /clients` qui n'était pas initialement définie mais logique pour l'affichage de ce Dashboard.

## 2. Listing des Clients (`ClientsScreen.tsx`)
- Suppression du mock `clientsData`.
- Utilisation de `clientService.getAll()`.
- Remplacement du mapping : 
  - L'avatar prend les premières lettres du nom/prénom.
  - Affichage de `firstName`, `lastName`, `phone`.
  - Le solde épargne affiché vient de `r.savingsAccounts[0].balance` (selon la définition API).
  - La CNI (ID Card Number) remplace le statut factice.

## 3. Fiche Modal (`ClientFicheModal.tsx`)
- Adaptations de l'UI pour intégrer le type global `Client` (`r.firstName`, `r.phone`, `r.idCardNumber`, etc.) à la place des anciennes lettres d'objets (`r.n`, `r.ac`, `r.s`).
- Les graphiques et 5 dernières transactions sont conservés en mode visuel (Mock Partiel) en attendant la connexion à la brique "Transactions" de la Phase 5.

## Statut
- Fonctionnel et sans crash sur donnée vide grâce à la robustesse des fallbacks. La Phase 4 du projet est 100% connectée aux endpoints REST.
